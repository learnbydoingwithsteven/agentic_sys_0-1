'use server'

import { ChatOllama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { getOllamaModels } from "@/actions/course_004_state_management/chat";

export type SentimentResult = {
    polarity: 'positive' | 'negative' | 'neutral';
    score: number; // -1 to 1
    emotion: 'joy' | 'anger' | 'sadness' | 'fear' | 'surprise' | 'neutral';
    aspects: Array<{ target: string; sentiment: 'positive' | 'negative' | 'neutral' }>;
    explanation: string;
};

async function getModel() {
    const models = await getOllamaModels();
    const modelName = models.length > 0 ? models[0] : "llama3.2";

    return new ChatOllama({
        baseUrl: "http://127.0.0.1:11434",
        model: modelName,
        temperature: 0.1, // Low temp for consistent analysis
        format: "json", // Request JSON for structured parsing
    });
}

export async function analyzeSentiment(text: string): Promise<SentimentResult> {
    const llm = await getModel();

    const promptTemplate = `
    You are an expert Sentiment Analysis Agent. Analyze the following text deeply.
    
    Return a JSON object with the following fields:
    - "polarity": "positive", "negative", or "neutral"
    - "score": A number between -1.0 (very negative) and 1.0 (very positive).
    - "emotion": One of ["joy", "anger", "sadness", "fear", "surprise", "neutral"] that best matches the tone.
    - "aspects": An array of objects, each having "target" (the noun being discussed) and "sentiment" (positive/negative/neutral). Extract key aspects if present.
    - "explanation": A brief 1-sentence explanation of why these metrics were chosen.

    Text to Analyze: "{text}"

    JSON Output:
    `;

    try {
        const prompt = PromptTemplate.fromTemplate(promptTemplate);
        const chain = prompt.pipe(llm).pipe(new StringOutputParser());
        const jsonStr = await chain.invoke({ text });

        // Parse JSON safely
        const parsed = JSON.parse(jsonStr.trim());

        return {
            polarity: parsed.polarity || 'neutral',
            score: parsed.score || 0,
            emotion: parsed.emotion || 'neutral',
            aspects: parsed.aspects || [],
            explanation: parsed.explanation || "No explanation provided."
        };

    } catch (error) {
        console.error("Sentiment Analysis Error:", error);
        // Fallback result in case of failure
        return {
            polarity: 'neutral',
            score: 0,
            emotion: 'neutral',
            aspects: [],
            explanation: "Failed to analyze sentiment. Ensure Ollama is running."
        };
    }
}
