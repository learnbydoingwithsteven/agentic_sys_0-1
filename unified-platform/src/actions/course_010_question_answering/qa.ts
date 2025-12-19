'use server'

import { ChatOllama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export type QAMode = 'closed_book' | 'rag';

export async function answerQuestion(
    question: string,
    mode: QAMode,
    context: string | null,
    model: string = "llama3.2"
) {

    const llm = new ChatOllama({
        baseUrl: "http://127.0.0.1:11434",
        model: model,
        temperature: 0.3,
    });

    let promptTemplate = "";

    if (mode === 'closed_book') {
        promptTemplate = `
        You are a helpful AI assistant. Answer the question based ONLY on your internal training data.
        If you don't know the answer, just say "I don't know".

        Question: {question}

        Answer:
        `;
    } else {
        // RAG Prompt
        promptTemplate = `
        You are a helpful AI assistant. Answer the question based ONLY on the provided Context below.
        If the answer is not in the context, say "The context doesn't contain this information."

        Context:
        """
        {context}
        """

        Question: {question}

        Answer:
        `;
    }

    try {
        const prompt = PromptTemplate.fromTemplate(promptTemplate);
        const chain = prompt.pipe(llm).pipe(new StringOutputParser());

        const answer = await chain.invoke({
            question,
            context: context || ""
        });

        return {
            success: true,
            answer: answer.trim(),
            systemPrompt: promptTemplate
                .replace("{question}", question)
                .replace("{context}", context || "N/A"),
            mode
        };

    } catch (error) {
        console.error("QA Error:", error);
        return {
            success: false,
            answer: "Error processing request.",
            error: String(error)
        };
    }
}
