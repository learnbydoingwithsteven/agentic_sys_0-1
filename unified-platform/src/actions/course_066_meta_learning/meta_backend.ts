'use server';

import { ChatOllama } from "@langchain/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const llm = new ChatOllama({
    model: "qwen2.5:1.5b",
    baseUrl: "http://127.0.0.1:11434",
    temperature: 0.1,
});

export async function runFewShotTask(examples: { input: string, output: string }[], query: string): Promise<string> {

    // Construct the prompt dynamically with examples
    const exampleText = examples.map(e => `Input: ${e.input}\nOutput: ${e.output}`).join('\n\n');

    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a pattern completion engine. Follow the pattern in the examples exactly."],
        ["user", `Examples:\n${exampleText}\n\nInput: ${query}\nOutput:`]
    ]);

    return await prompt.pipe(llm).pipe(new StringOutputParser()).invoke({});
}
