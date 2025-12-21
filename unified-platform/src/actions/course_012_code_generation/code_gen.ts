'use server'

import { ChatOllama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export type CodeGenMode = 'snippet' | 'architect';

export async function generateCode(
    promptStr: string,
    language: string,
    mode: CodeGenMode = 'architect',
    model: string = "llama3.2"
) {

    // We can use a lower temperature for code to ensure correctness
    const llm = new ChatOllama({
        baseUrl: "http://127.0.0.1:11434",
        model: model,
        temperature: 0.2, // Lower temp for code
        format: mode === 'architect' ? "json" : undefined,
    });

    let promptTemplate = '';

    if (mode === 'snippet') {
        promptTemplate = `
    You are a coding assistant.
    Task: Write a {language} code snippet for the following request.
    Return ONLY the code. No explanation.

    Request:
    "{input}"
        `;
    } else {
        promptTemplate = `
    You are a Senior Software Architect Agent.
    Task: Design and implement a robust solution in {language} for the user's request.
    
    Requirements:
    1. Implementation: deeply thoughtful, production-ready code.
    2. Documentation: Add JSDoc/Docstrings for all functions.
    3. Types: Use strict typing where applicable.
    4. Output: strictly JSON format.

    User Request:
    "{input}"

    JSON Output Structure:
    {{
        "code": "The complete source code",
        "explanation": "High-level architectural overview",
        "complexity_analysis": "Big O analysis or performance notes",
        "edge_cases": ["List of handled edge cases"]
    }}
        `;
    }

    try {
        const prompt = PromptTemplate.fromTemplate(promptTemplate);
        const chain = prompt.pipe(llm).pipe(new StringOutputParser());

        const resultRaw = await chain.invoke({
            input: promptStr,
            language
        });

        // Parse if architect, otherwise wrap string
        let data;
        try {
            data = mode === 'architect'
                ? JSON.parse(resultRaw.trim())
                : { code: resultRaw.trim() };
        } catch (e) {
            // Fallback if JSON parse fails (LLM hallucinated markdown often)
            // Try to extract JSON from code block if present
            const match = resultRaw.match(/```json\n([\s\S]*?)\n```/);
            if (match) {
                data = JSON.parse(match[1]);
            } else {
                throw new Error("Failed to parse JSON response");
            }
        }

        return {
            success: true,
            data: data,
            systemPrompt: promptTemplate
                .replace("{language}", language)
                .replace("{input}", promptStr),
            mode
        };

    } catch (error) {
        console.error("Code Gen Error:", error);
        return {
            success: false,
            data: null,
            error: String(error)
        };
    }
}
