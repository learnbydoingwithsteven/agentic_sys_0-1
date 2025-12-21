'use server'

import { ChatOllama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

export type LogLevel = 'basic' | 'verbose';

export interface LogEvent {
    id: string;
    timestamp: number;
    type: 'chain_start' | 'llm_start' | 'llm_end' | 'chain_end' | 'error';
    name: string;
    content: string;
    metadata?: any;
}

export async function runDebugAgent(
    input: string,
    model: string = "llama3.2"
) {
    const logs: LogEvent[] = [];

    // Helper to add logs
    const addLog = (type: LogEvent['type'], name: string, content: string, metadata?: any) => {
        logs.push({
            id: Math.random().toString(36).substring(7),
            timestamp: Date.now(),
            type,
            name,
            content: typeof content === 'string' ? content : JSON.stringify(content),
            metadata
        });
    };

    const llm = new ChatOllama({
        baseUrl: "http://127.0.0.1:11434",
        model: model,
        temperature: 0.7,
        callbacks: [
            {
                handleLLMStart: async (llm, prompts) => {
                    addLog('llm_start', 'ChatOllama', `Prompts: ${JSON.stringify(prompts)}`);
                },
                handleLLMEnd: async (output) => {
                    addLog('llm_end', 'ChatOllama', `Generations: ${JSON.stringify(output.generations)}`);
                },
                handleLLMError: async (err) => {
                    addLog('error', 'ChatOllama', String(err));
                }
            }
        ]
    });

    const prompt = PromptTemplate.fromTemplate(`
    You are a helpful debugging assistant.
    Input: {input}
    Response:
    `);

    // Create sequence with callbacks
    const chain = prompt.pipe(llm).pipe(new StringOutputParser()).withConfig({
        runName: "DebugSequence",
        callbacks: [
            {
                handleChainStart: async (chain, inputs) => {
                    addLog('chain_start', 'DebugSequence', `Inputs: ${JSON.stringify(inputs)}`);
                },
                handleChainEnd: async (outputs) => {
                    addLog('chain_end', 'DebugSequence', `Outputs: ${JSON.stringify(outputs)}`);
                }
            }
        ]
    });

    try {
        const result = await chain.invoke({ input });

        return {
            success: true,
            output: result,
            logs: logs,
            systemPrompt: "You are a helpful debugging assistant.\nInput: {input}\nResponse:"
        };
    } catch (error) {
        return {
            success: false,
            output: null,
            logs: logs,
            error: String(error)
        };
    }
}
