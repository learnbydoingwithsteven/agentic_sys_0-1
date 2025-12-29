'use server';

import { ChatOllama } from "@langchain/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export interface CrewMessage {
    sender: 'Manager' | 'Researcher' | 'Writer';
    content: string;
}

const llm = new ChatOllama({
    model: "qwen2.5:1.5b",
    baseUrl: "http://127.0.0.1:11434",
    temperature: 0.7,
});

export async function runCrew(topic: string): Promise<CrewMessage[]> {
    const messages: CrewMessage[] = [];

    // 1. Manager -> Researcher
    messages.push({ sender: 'Manager', content: `Researcher, give me 3 key facts about "${topic}".` });

    const researchPrompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a Researcher. Provide 3 short, interesting facts about the topic."],
        ["user", topic]
    ]);
    const facts = await researchPrompt.pipe(llm).pipe(new StringOutputParser()).invoke({});
    messages.push({ sender: 'Researcher', content: facts });

    // 2. Manager -> Writer
    messages.push({ sender: 'Manager', content: `Writer, draft a short LinkedIn post using these facts.` });

    const writePrompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a Marketing Writer. Write a punchy LinkedIn post based on the facts provided."],
        ["user", `Facts: ${facts}`]
    ]);
    const post = await writePrompt.pipe(llm).pipe(new StringOutputParser()).invoke({});
    messages.push({ sender: 'Writer', content: post });

    // 3. Manager Sign-off
    messages.push({ sender: 'Manager', content: "Great work team. Job done." });

    return messages;
}
