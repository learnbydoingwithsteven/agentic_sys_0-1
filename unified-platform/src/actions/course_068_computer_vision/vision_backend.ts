'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';
import fs from 'fs/promises';
import path from 'path';

export interface BoundingBox {
    id: string;
    label: string;
    confidence: number;
    x: number; // Percentage 0-100
    y: number; // Percentage 0-100
    width: number; // Percentage
    height: number; // Percentage
    color: string;
}

export async function detectObjects(imageId: string, modelName: string = 'auto'): Promise<BoundingBox[]> {

    // 1. Read real image
    const filePath = path.join(process.cwd(), 'public', 'assets', 'course_068', `${imageId}.png`);

    try {
        const fileBuffer = await fs.readFile(filePath);
        const base64Image = fileBuffer.toString('base64');

        // 2. Query LLM to estimate boxes
        const systemPrompt = `You are an Object Detection module.
        Task: Identify 3-5 main objects in the image.
        Output: A JSON Array of objects with estimated bounding boxes (0-100 coordinate system).
        Format:
        [
          { "label": "Car", "confidence": 0.9, "x": 10, "y": 50, "width": 20, "height": 15, "color": "blue" }
        ]
        
        Note: x, y is the top-left corner. Estimate positions based on visual layout.
        If you cannot see the image, return an empty array.`;

        const userPrompt = "Detect objects in this image. Return JSON ONLY.";

        const raw = await queryLLM(systemPrompt, userPrompt, modelName, true, [base64Image]);

        // 3. Parse JSON
        try {
            let boxes = await extractJSON(raw);
            if (!Array.isArray(boxes)) boxes = [];

            // Validate/Normalize structure to avoid UI crashes
            return boxes.map((b: any, i: number) => ({
                id: i.toString(),
                label: b.label || 'Unknown',
                confidence: typeof b.confidence === 'number' ? b.confidence : 0.5,
                x: validate(b.x),
                y: validate(b.y),
                width: validate(b.width),
                height: validate(b.height),
                color: b.color || 'white'
            }));

        } catch (e) {
            console.error("JSON Parse Error:", e);
            // Fallback for demo continuity if model fails to output JSON
            return [];
        }

    } catch (e) {
        console.error("Vision Error:", e);
        return [];
    }
}

function validate(val: any): number {
    const num = Number(val);
    return isNaN(num) ? 0 : Math.max(0, Math.min(100, num));
}
