'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface EphemeralResult {
    result: string;
    code: string;
    type: 'COLD_START' | 'WARM_START';
    latency: number;
}

// In-Memory Cache (Simulates "Warm" Containers)
// Key: Task Description (e.g. "Sort Numbers") -> Value: JS Code String
const functionCache = new Map<string, string>();

let lastCall = 0;

export async function runEphemeralAgent(task: string, inputData: string, modelName: string = 'auto'): Promise<EphemeralResult> {
    const start = Date.now();

    // Check if we are "Warm" (called recently on same/similar task)
    // For demo simplicity, we cache based on exact task string.
    // To simulate "Cold Start" timeout, we clear cache if > 10s idle.
    if (Date.now() - lastCall > 10000) {
        functionCache.clear();
    }
    lastCall = Date.now();

    const cachedCode = functionCache.get(task);

    if (cachedCode) {
        // WARM START: Execute immediately
        let result = "";
        try {
            // Unsafe eval for demo (Server side). In prod, use V8 sandbox or Docker.
            // We assume inputData is JSON parsable
            const func = new Function('input', cachedCode);
            result = JSON.stringify(func(JSON.parse(inputData)));
        } catch (e) {
            result = `Execution Error: ${e}`;
        }

        return {
            type: 'WARM_START',
            code: cachedCode,
            result,
            latency: Date.now() - start
        };
    } else {
        // COLD START: Generate Code via LLM
        const systemPrompt = `You are a Serverless Function Generator.
        User request: "${task}".
        Input Data: ${inputData}.
        
        Task: Write a JavaScript function body that processes variable 'input' and returns the result.
        Do NOT wrap in function() {}, just the body. The input is available as 'input'.
        Example Task: "Sum array". Body: "return input.reduce((a,b)=>a+b, 0);"
        
        Return JSON: { "code": "string" }`;

        let code = "";
        let result = "";

        try {
            const raw = await queryLLM(systemPrompt, "Generate function.", modelName, true);
            const extracted = await extractJSON(raw);
            code = extracted.code;

            // Execute
            const func = new Function('input', code);
            result = JSON.stringify(func(JSON.parse(inputData)));

            // Cache it
            functionCache.set(task, code);
        } catch (e) {
            code = "// Error generating";
            result = `Error: ${e}`;
        }

        return {
            type: 'COLD_START',
            code,
            result,
            latency: Date.now() - start
        };
    }
}
