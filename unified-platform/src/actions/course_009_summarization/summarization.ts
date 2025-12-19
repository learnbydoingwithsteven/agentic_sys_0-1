'use server'

import { ChatOllama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export type SummaryLength = 'short' | 'medium' | 'long';
export type SummaryFormat = 'paragraph' | 'bullets';

export async function summarizeText(
    text: string,
    length: SummaryLength,
    format: SummaryFormat,
    model: string = "llama3.2"
) {

    const llm = new ChatOllama({
        baseUrl: "http://127.0.0.1:11434",
        model: model,
        temperature: 0.2,
    });

    const lengthInstruction = {
        short: "1-2 sentences. Extremely concise.",
        medium: "1 paragraph (approx 5 sentences). Capture main points.",
        long: "Detailed summary. structured with multiple sections if needed."
    }[length];

    const formatInstruction = {
        paragraph: "Use flowing prose/paragraphs.",
        bullets: "Use a markdown bulleted list for key points."
    }[format];

    const promptTemplate = `
    You are an expert Summarization Agent.
    
    Task: Summarize the following text.
    Target Length: {lengthInstruction}
    Target Format: {formatInstruction}

    Text:
    "{text}"

    Summary:
    `;

    try {
        const prompt = PromptTemplate.fromTemplate(promptTemplate);
        const chain = prompt.pipe(llm).pipe(new StringOutputParser());

        const summary = await chain.invoke({
            text,
            lengthInstruction,
            formatInstruction
        });

        return {
            success: true,
            summary: summary.trim(),
            systemPrompt: promptTemplate
                .replace("{lengthInstruction}", lengthInstruction)
                .replace("{formatInstruction}", formatInstruction)
        };

    } catch (error) {
        console.error("Summarization Error:", error);
        return {
            success: false,
            summary: "Failed to generate summary.",
            error: String(error)
        };
    }
}
