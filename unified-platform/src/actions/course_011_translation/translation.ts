'use server'

import { ChatOllama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { getOllamaModels } from "@/actions/course_004_state_management/chat";

export type TargetLanguage = 'Spanish' | 'French' | 'German' | 'Chinese' | 'Japanese' | 'Italian' | 'Portuguese' | 'Russian' | 'Hindi' | 'Arabic';

export type TranslationMode = 'simple' | 'polyglot';

export async function translateText(
    text: string,
    targetLanguage: TargetLanguage,
    mode: TranslationMode = 'polyglot',
    model: string = "llama3.2"
) {

    const llm = new ChatOllama({
        baseUrl: "http://127.0.0.1:11434",
        model: model,
        temperature: 0.3,
        format: mode === 'polyglot' ? "json" : undefined, // JSON only for polyglot
    });

    let promptTemplate = '';

    if (mode === 'simple') {
        promptTemplate = `
    You are a professional translator.
    Task: Translate the following text into {targetLanguage}.
    Just provide the translation, nothing else.

    Text:
    "{text}"
        `;
    } else {
        promptTemplate = `
    You are an expert Polyglot Polymath Agent. 
    Task: Translate the following text into {targetLanguage}.
    
    Requirements:
    1. Preserve the original tone and intent.
    2. If there are idioms, translate their *meaning*, not just the words.
    3. Output strictly in JSON format.

    Text to Translate:
    "{text}"

    JSON Output Structure:
    {{
        "translation": "The translated text",
        "detected_source_language": "The language of the input text (e.g., English)",
        "tone_analysis": "Brief analysis of the original tone (e.g., Formal, Casual, Urgent)",
        "nuance_notes": "Explanation of any specific translation choices (e.g., why a specific word was chosen for cultural fit)"
    }}
        `;
    }

    try {
        const prompt = PromptTemplate.fromTemplate(promptTemplate);
        const chain = prompt.pipe(llm).pipe(new StringOutputParser());

        const resultRaw = await chain.invoke({
            text,
            targetLanguage
        });

        // Parse if polyglot, otherwise return raw string wrapped
        const data = mode === 'polyglot'
            ? JSON.parse(resultRaw.trim())
            : { translation: resultRaw.trim() };

        return {
            success: true,
            data: data,
            systemPrompt: promptTemplate
                .replace("{targetLanguage}", targetLanguage)
                .replace("{text}", text),
            mode
        };

    } catch (error) {
        console.error("Translation Error:", error);
        return {
            success: false,
            data: null,
            error: String(error)
        };
    }
}
