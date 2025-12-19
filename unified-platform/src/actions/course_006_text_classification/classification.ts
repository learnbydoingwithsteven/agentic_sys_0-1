'use server'

import { ChatOllama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { getOllamaModels } from "@/actions/course_004_state_management/chat";

export type ClassificationType = 'binary' | 'multi-class' | 'multi-label' | 'hierarchical';

export type ClassificationResult = {
    label: string;
    reasoning?: string;
    confidence?: string; // Simulated for this demo
    rawInput: string;
    type: ClassificationType;
};

async function getModel() {
    const models = await getOllamaModels();
    const modelName = models.length > 0 ? models[0] : "llama3.2";

    return new ChatOllama({
        baseUrl: "http://127.0.0.1:11434",
        model: modelName,
        temperature: 0.1, // Low temp for classification
    });
}

export async function classifyText(text: string, type: ClassificationType): Promise<ClassificationResult> {
    const llm = await getModel();
    let promptTemplate = "";

    // 02 Few-Shot Classifiers - Aligning with Course Content
    switch (type) {
        case 'binary':
            promptTemplate = `
You are a Spam Detection Agent. Classify the following text as either "SPAM" or "NOT_SPAM".
            
Examples:
Text: "Win $1,000,000 now! Click here!" -> SPAM
Text: "Hey, can we meet for lunch tomorrow?" -> NOT_SPAM
Text: "Urgent: Your account password has expired." -> SPAM

Current Text: "{text}"
Classification (SPAM/NOT_SPAM):`;
            break;

        case 'multi-class':
            promptTemplate = `
You are a Topic Classifier. Classify into ONE of: NEWS, SPORTS, TECH, FINANCE.

Examples:
Text: "The Lakers won the championship." -> SPORTS
Text: "Apple released the new M3 chip." -> TECH
Text: "Local elections are held today." -> NEWS

Current Text: "{text}"
Classification (One Word):`;
            break;

        case 'multi-label':
            promptTemplate = `
You are a Movie Genre Tagger. Classify into one OR MORE of: [Action, Sci-Fi, Romance, Comedy, Thriller].
Return as comma-separated list.

Examples:
Text: "A robot travels back in time to save the world." -> Action, Sci-Fi
Text: "Two people fall in love during a war." -> Romance, Drama
Text: "A funny cop movie with explosions." -> Action, Comedy

Current Text: "{text}"
Tags:`;
            break;

        case 'hierarchical':
            promptTemplate = `
You are a Product Categorizer. Classify into the format: Category > Subcategory > Item.

Examples:
Text: "MacBook Pro 16 inch" -> Electronics > Computers > Laptops
Text: "Nike Air Jordan" -> Apparel > Footwear > Sneakers
Text: "Harry Potter Book 1" -> Media > Books > Fantasy

Current Text: "{text}"
Category Path:`;
            break;
    }

    try {
        const prompt = PromptTemplate.fromTemplate(promptTemplate);
        const chain = prompt.pipe(llm).pipe(new StringOutputParser());
        const result = await chain.invoke({ text });

        // Simulate confidence based on length or clarity (Mock metric as real logprobs are complex here)
        return {
            label: result.trim(),
            rawInput: text,
            type: type,
            confidence: "High (0.92)" // Mocked for demo purposes as requested in 'Metrics'
        };
    } catch (error) {
        console.error("Classification Error:", error);
        return {
            label: "Error",
            rawInput: text,
            type: type,
            confidence: "N/A"
        };
    }
}
