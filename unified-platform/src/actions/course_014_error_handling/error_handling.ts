'use server'

import { ChatOllama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export type ReliabilityMode = 'fragile' | 'robust';

export interface ErrorLog {
    attempt: number;
    error: string;
    action: string;
    timestamp: number;
}

export async function runUnreliableAgent(
    input: string,
    mode: ReliabilityMode = 'robust',
    model: string = "llama3.2"
) {
    const logs: ErrorLog[] = [];
    const MAX_RETRIES = 3;

    // 1. Define the core "Risky" operation
    // We simulate randomness to force failures
    const performTask = async (attempt: number) => {
        // roll dice: 70% chance of failure on attempt 1, 30% on attempt 2, 0% on attempt 3
        const failureChance = attempt === 1 ? 0.7 : attempt === 2 ? 0.3 : 0;

        if (Math.random() < failureChance) {
            // Simulate different types of errors
            const errors = [
                "ConnectionTimeout: LLM backend did not respond in 5000ms",
                "JSONParseError: Unexpected token < in JSON at position 0",
                "RateLimitError: Too many requests. Please slow down.",
                "HallucinationError: Output did not match expected schema schema"
            ];
            throw new Error(errors[Math.floor(Math.random() * errors.length)]);
        }

        const llm = new ChatOllama({
            baseUrl: "http://127.0.0.1:11434",
            model: model,
            temperature: 0.7,
        });

        const prompt = PromptTemplate.fromTemplate(`
            You are a helpful assistant. 
            User says: {input}
            Reply nicely.
        `);

        const chain = prompt.pipe(llm).pipe(new StringOutputParser());
        return await chain.invoke({ input });
    };

    // 2. Execution Logic
    if (mode === 'fragile') {
        try {
            const result = await performTask(1);
            return { success: true, data: result, logs };
        } catch (error) {
            logs.push({
                attempt: 1,
                error: String(error),
                action: "Crash",
                timestamp: Date.now()
            });
            return { success: false, error: String(error), logs };
        }
    } else {
        // ROBUST MODE: Retry Loop
        let currentAttempt = 1;

        while (currentAttempt <= MAX_RETRIES) {
            try {
                const result = await performTask(currentAttempt);
                return { success: true, data: result, logs };
            } catch (error) {
                const isLastAttempt = currentAttempt === MAX_RETRIES;
                logs.push({
                    attempt: currentAttempt,
                    error: String(error),
                    action: isLastAttempt ? "Give Up" : `Retry with Backoff (${currentAttempt * 1000}ms)`,
                    timestamp: Date.now()
                });

                if (isLastAttempt) {
                    // Fallback response instead of crash
                    return {
                        success: true, // We handled it gracefully
                        data: "I apologize, but I'm having trouble connecting right now. Please try again in a moment. (Fallback Response)",
                        logs,
                        isFallback: true
                    };
                }

                // Wait (Backoff)
                await new Promise(resolve => setTimeout(resolve, currentAttempt * 1000));
                currentAttempt++;
            }
        }
    }

    return { success: false, error: "Unknown State", logs };
}
