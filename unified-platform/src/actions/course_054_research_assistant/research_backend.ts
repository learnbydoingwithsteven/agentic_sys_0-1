'use server';

import { ChatOllama } from "@langchain/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export interface ResearchResult {
    sources: { title: string, snippet: string, url: string }[];
    synthesis: string;
}

const llm = new ChatOllama({
    model: "qwen2.5:1.5b",
    baseUrl: "http://127.0.0.1:11434",
    temperature: 0.5,
});

export async function runResearch(topic: string): Promise<ResearchResult> {

    // 1. Simulate Search
    const sources = [
        {
            title: `${topic}: An Overview`,
            snippet: `${topic} is a complex subject that involves...`,
            url: "wikipedia.org/wiki/" + topic.replace(' ', '_')
        },
        {
            title: `Recent Developments in ${topic}`,
            snippet: `In 2024, experts discovered that ${topic} has significant impacts on...`,
            url: "nature.com/articles/" + topic.replace(' ', '-')
        },
        {
            title: `The Future of ${topic}`,
            snippet: `Analysts predict that ${topic} will grow by 50% in the next decade...`,
            url: "techcrunch.com/" + topic.replace(' ', '-')
        }
    ];

    await new Promise(r => setTimeout(r, 1500)); // Search delay

    // 2. Synthesize
    const synthesisPrompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a Research Analyst. Synthesize the following snippets into a brief executive summary."],
        ["user", `Topic: ${topic}\n\nSnippets:\n${sources.map(s => s.snippet).join('\n')}`]
    ]);

    const synthesis = await synthesisPrompt.pipe(llm).pipe(new StringOutputParser()).invoke({});

    return {
        sources,
        synthesis
    };
}
