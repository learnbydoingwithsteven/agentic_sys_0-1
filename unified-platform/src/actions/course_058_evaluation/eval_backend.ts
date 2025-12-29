'use server';

import { ChatOllama } from "@langchain/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export interface EvalResult {
    id: number;
    question: string;
    expected: string;
    actual: string;
    passed: boolean;
}

const llm = new ChatOllama({
    model: "qwen2.5:1.5b",
    baseUrl: "http://127.0.0.1:11434",
    temperature: 0,
});

const DATASET = [
    { q: "What is 2 + 2?", a: "4" },
    { q: "Capital of France?", a: "Paris" },
    { q: "Color of the sky?", a: "Blue" },
    { q: "Who wrote Hamlet?", a: "Shakespeare" },
    { q: "Boiling point of water (C)?", a: "100" }
];

export async function runEvalSet(): Promise<EvalResult[]> {
    const results: EvalResult[] = [];

    // Run sequentially to avoid OOM on local device
    for (let i = 0; i < DATASET.length; i++) {
        const item = DATASET[i];

        const prompt = ChatPromptTemplate.fromMessages([
            ["system", "Answer concisely. One word if possible."],
            ["user", item.q]
        ]);

        const actual = await prompt.pipe(llm).pipe(new StringOutputParser()).invoke({});

        // Naive fuzzy check
        const passed = actual.toLowerCase().includes(item.a.toLowerCase());

        results.push({
            id: i + 1,
            question: item.q,
            expected: item.a,
            actual: actual.trim(),
            passed
        });

        // Artificial delay for visualization
        await new Promise(r => setTimeout(r, 500));
    }

    return results;
}
