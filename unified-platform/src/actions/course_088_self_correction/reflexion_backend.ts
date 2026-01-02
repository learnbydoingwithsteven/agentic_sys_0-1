'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface ReflexionStep {
    attempt: number;
    code: string;
    result: 'PASS' | 'FAIL';
    error?: string;
    reflection?: string;
}

export async function runReflexionCycle(modelName: string = 'auto'): Promise<ReflexionStep[]> {
    const steps: ReflexionStep[] = [];
    const task = "Write a Javascript function 'calculateFactorial(n)'";

    // Attempt 1: Force a mistake (Simulating a novice model or complex bug)
    // We explicitly ask the LLM to make a specific common error (e.g. no base case) 
    // to demonstrate the correction capability.
    const prompt1 = `You are a Junior Developer. Write a Javascript function ${task}.
    INTENTIONALLY MAKE A MISTAKE: Forget the base case (n <= 1) causing Infinite Recursion.
    Return JSON: { "code": "string" }`;

    let code1 = "function calculateFactorial(n) { return n * calculateFactorial(n-1); }";
    try {
        const res = await extractJSON(await queryLLM(prompt1, "Write buggy code.", modelName, true, "json"));
        code1 = res.code;
    } catch { }

    steps.push({
        attempt: 1,
        code: code1,
        result: 'FAIL',
        error: "RangeError: Maximum call stack size exceeded (Infinite Recursion detected)",
        reflection: "Wait..." // Placeholder
    });

    // Reflexion 1: LLM analyzes the error
    const reflectPrompt = `You are a Senior Code Reviewer.
    Task: ${task}.
    Current Code: "${code1}"
    Error: "RangeError: Maximum call stack size exceeded".
    
    Reflect on why this failed. What is missing?
    Return JSON: { "reflection": "string" }`;

    let reflection1 = "Infinite recursion logic.";
    try {
        const res = await extractJSON(await queryLLM(reflectPrompt, "Analyze error.", modelName, true));
        reflection1 = res.reflection;
    } catch { }

    steps[0].reflection = reflection1;

    // Attempt 2: Fix based on Reflection
    const fixPrompt = `You are a Developer.
    Task: ${task}.
    Previous Plan had error: "${reflection1}".
    Fix the code. Ensure you handle the base case.
    Return JSON: { "code": "string" }`;

    let code2 = "function calculateFactorial(n) { if(n<=1) return 1; return n * calculateFactorial(n-1); }";
    try {
        const res = await extractJSON(await queryLLM(fixPrompt, "Fix code.", modelName, true));
        code2 = res.code;
    } catch { }

    steps.push({
        attempt: 2,
        code: code2,
        result: 'PASS'
    });

    return steps;
}
