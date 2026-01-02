'use server';

import { queryLLM } from '@/lib/llm_helper';
import fs from 'fs/promises';
import path from 'path';

export async function analyzeImage(imageId: string, modelName: string = 'auto'): Promise<string> {

    // 1. Read real image file
    const filePath = path.join(process.cwd(), 'public', 'assets', 'course_067', `${imageId}.png`);

    try {
        const fileBuffer = await fs.readFile(filePath);
        const base64Image = fileBuffer.toString('base64');

        // 2. Query LLM with Image
        const systemPrompt = "You are a Vision AI. Describe the image in detail but concisely. Focus on objects, colors, and text if present.";
        const userPrompt = "What do you see in this image?";

        const response = await queryLLM(systemPrompt, userPrompt, modelName, false, [base64Image]);

        // Fallback for Text-Only models if they ignore the image or hallucinate completely unrelated text
        if (response.includes("Error") || response.length < 5) {
            return "Model Error: Ensure you have selected a Vision-Capable model (like 'llava').";
        }

        return response;

    } catch (e) {
        console.error("Image Analysis Error:", e);
        return "Error loading image asset. Please ensure assets are generated.";
    }
}
