'use server';

import { ChatOllama } from "@langchain/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const llm = new ChatOllama({
    model: "qwen2.5:1.5b",
    baseUrl: "http://127.0.0.1:11434",
    temperature: 0.9, // High creativity
});

export async function generateCreativeText(topic: string, style: string): Promise<string> {
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", `You are a creative writer. Write a short paragraph about the user's topic in the style of: ${style}. Capture the unique voice, vocabulary, and cadence of that style.`],
        ["user", topic]
    ]);

    return await prompt.pipe(llm).pipe(new StringOutputParser()).invoke({});
}
