'use server';

import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// --- Prompts ---

const SYSTEM_1_PROMPT = `
You are a fast, intuitive AI assistant.
Answer the following question as quickly and concisely as possible.
Do not provide step-by-step reasoning. Just give the answer.

Question: {input}
`;

const SYSTEM_2_PROMPT = `
You are a careful, analytical AI assistant.
To answer the question, you MUST follow these steps:
1. Break the problem down into small logical pieces.
2. Analyze each piece inside <thought> tags.
3. Check your work for potential logic traps.
4. Only AFTER thinking, provide the final answer inside <answer> tags.

Question: {input}
`;

// --- Action ---

export interface ReasoningResult {
    rawOutput: string;
    thoughtProcess?: string;
    finalAnswer: string;
    mode: 'system1' | 'system2';
}

export async function solveProblem(
    problem: string,
    mode: 'system1' | 'system2',
    model: string = "llama3.2"
): Promise<ReasoningResult> {

    // System 1 often fails on logic puzzles if temp is too high, 
    // but we want to simulate "gut feeling" vs "analysis".
    const llm = new ChatOllama({
        baseUrl: "http://127.0.0.1:11434",
        model: model,
        temperature: mode === 'system1' ? 0.3 : 0.1, // Analysis needs to be more deterministic
    });

    const template = mode === 'system1' ? SYSTEM_1_PROMPT : SYSTEM_2_PROMPT;

    const chain = ChatPromptTemplate.fromTemplate(template)
        .pipe(llm)
        .pipe(new StringOutputParser());

    const result = await chain.invoke({ input: problem });

    if (mode === 'system1') {
        return {
            rawOutput: result,
            finalAnswer: result,
            mode: 'system1'
        };
    } else {
        // Parse XML-like tags for System 2
        const thoughtMatch = result.match(/<thought>([\s\S]*?)<\/thought>/);
        const answerMatch = result.match(/<answer>([\s\S]*?)<\/answer>/);

        // Fallback if model forgets tags (common with smaller models)
        // We'll treat the whole thing as thought if no tags
        const thought = thoughtMatch ? thoughtMatch[1].trim() : result;
        const answer = answerMatch ? answerMatch[1].trim() : (thoughtMatch ? "See above." : result);

        return {
            rawOutput: result,
            thoughtProcess: thought,
            finalAnswer: answer,
            mode: 'system2'
        };
    }
}
