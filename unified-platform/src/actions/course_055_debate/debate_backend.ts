'use server';

import { ChatOllama } from "@langchain/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export interface DebateTurn {
    speaker: 'Pro' | 'Con';
    text: string;
}

const llm = new ChatOllama({
    model: "qwen2.5:1.5b",
    baseUrl: "http://127.0.0.1:11434",
    temperature: 0.8,
});

export async function runDebateRound(topic: string, history: DebateTurn[]): Promise<DebateTurn> {
    const nextSpeaker = history.length % 2 === 0 ? 'Pro' : 'Con';
    const lastMessage = history.length > 0 ? history[history.length - 1].text : "None";

    const prompt = ChatPromptTemplate.fromMessages([
        ["system", `You are a Debater arguing ${nextSpeaker} regarding the topic: "${topic}". Respond to the previous argument concisely. If you are starting, make an opening statement.`],
        ["user", `Previous Argument: ${lastMessage}`]
    ]);

    const reply = await prompt.pipe(llm).pipe(new StringOutputParser()).invoke({});

    return {
        speaker: nextSpeaker,
        text: reply
    };
}
