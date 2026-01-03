'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export async function generateToolCode(task: string, modelName: string = 'auto'): Promise<string> {
    const prompt = `You are a Tool Smith Agent.
    User Task: "${task}"
    
    Objective: Write a single Javascript function that solves this specific task.
    - The function should take a single argument 'input' (which might be a number or string).
    - It must return the result.
    - Do not use external libraries.
    - Output ONLY the function code.
    
    Example:
    Task: "Square a number"
    Return JSON: { "code": "function square(input) { return input * input; }" }`;

    try {
        const raw = await queryLLM(prompt, "Generate JS Code", modelName, true);
        const res = await extractJSON(raw);
        return res.code || "// Error generating code";
    } catch (e) {
        return `function error() { return "Generation failed"; }`;
    }
}

export async function runGeneratedTool(code: string, input: any): Promise<any> {
    // SECURITY WARNING: Executing arbitrary code from LLM is risky.
    // In a real production system, use a sandboxed VM (e.g. 'vm2' or distinct container).
    // For this local educational demo, we use 'new Function' carefully.

    try {
        // We wrap the code to ensure it returns the function, then we call it.
        // Assumes 'code' is "function name(input) { ... }"

        // Hacky way to extract function name or just convert to anonymous
        // Let's force it to be an anonymous function expression if possible
        const wrappedCode = `
            const userFunc = ${code.replace(/function\s+\w+/, 'function')};
            return userFunc(arg);
        `;

        const run = new Function('arg', wrappedCode);
        const result = run(input);
        return result;
    } catch (e: any) {
        return `Runtime Error: ${e.message}`;
    }
}
