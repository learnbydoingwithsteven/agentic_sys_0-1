'use server';

import { ChatOllama } from "@langchain/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export interface ReflectionResult {
    draft: string;
    critique: string;
    final: string;
}

const llm = new ChatOllama({
    model: "qwen2.5:1.5b",
    baseUrl: "http://127.0.0.1:11434",
    temperature: 0.7,
});

export async function runSelfReflection(prompt: string): Promise<ReflectionResult> {

    // 1. Draft
    const draftPrompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a helpful assistant. Write a first draft for the user's request."],
        ["user", "{input}"]
    ]);
    const draft = await draftPrompt.pipe(llm).pipe(new StringOutputParser()).invoke({ input: prompt });

    // 2. Critique
    const critiquePrompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a harsh critic. Identify 3 ways to improve the following text. Be concise."],
        ["user", `Request: ${prompt}\n\nDraft: ${draft}`]
    ]);
    const critique = await critiquePrompt.pipe(llm).pipe(new StringOutputParser()).invoke({});

    // 3. Revise
    const revisePrompt = ChatPromptTemplate.fromMessages([
        ["system", "You are an expert editor. Rewrite the draft based on the critique."],
        ["user", `Original Request: ${prompt}\n\nDraft: ${draft}\n\nCritique: ${critique}\n\nWrite the Final Version:`]
    ]);
    const final = await revisePrompt.pipe(llm).pipe(new StringOutputParser()).invoke({});

    return { draft, critique, final };
}
