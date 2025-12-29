'use server';

import { ChatOllama } from "@langchain/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const llm = new ChatOllama({
    model: "qwen2.5:1.5b",
    baseUrl: "http://127.0.0.1:11434",
    temperature: 0.7,
});

export interface ABResult {
    responseA: string;
    responseB: string;
}

export async function runABTest(prompt: string): Promise<ABResult> {

    // Variant A: Concise, Professional
    const promptA = ChatPromptTemplate.fromMessages([
        ["system", "You are a concise, professional assistant. Answer in < 20 words."],
        ["user", prompt]
    ]);

    // Variant B: Friendly, Emoji-heavy
    const promptB = ChatPromptTemplate.fromMessages([
        ["system", "You are a super friendly, enthusiastic assistant! Use emojis! Answer in < 40 words."],
        ["user", prompt]
    ]);

    const [resA, resB] = await Promise.all([
        promptA.pipe(llm).pipe(new StringOutputParser()).invoke({}),
        promptB.pipe(llm).pipe(new StringOutputParser()).invoke({})
    ]);

    return { responseA: resA, responseB: resB };
}
