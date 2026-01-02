'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface EvalResult {
    id: number;
    question: string;
    expected: string;
    actual: string;
    passed: boolean;
    reasoning: string;
}

const DATASET = [
    { q: "What is 2 + 2?", a: "4" },
    { q: "Capital of France?", a: "Paris" },
    { q: "Color of the clear sky?", a: "Blue" },
    { q: "Who wrote Hamlet?", a: "Shakespeare" },
    { q: "Boiling point of water at sea level (C)?", a: "100" }
];

async function gradeResponse(question: string, expected: string, actual: string, modelName: string): Promise<{ passed: boolean; reason: string }> {
    // LLM-as-a-Judge Pattern
    const prompt = `You are an impartial Judge. Evaluate the Student's answer.
    
    Question: "${question}"
    Expected Truth: "${expected}"
    Student Answer: "${actual}"
    
    Does the student answer the question correctly based on the expected truth? 
    Ignore minor casing or punctuation differences.
    
    CRITICAL: Return ONLY valid JSON.
    Format:
    { "passed": true, "reason": "The answer matches the expected value." }`;

    try {
        const raw = await queryLLM("You are a Judge.", prompt, modelName, false);
        const result = await extractJSON(raw);
        return {
            passed: Boolean(result.passed),
            reason: String(result.reason || "No reasoning provided.")
        };
    } catch (e) {
        // Fallback to naive check if Judge fails
        const passed = actual.toLowerCase().includes(expected.toLowerCase());
        return { passed, reason: "Judge failed, using string match fallback." };
    }
}

export async function runEvalSet(modelName: string = 'auto'): Promise<EvalResult[]> {
    const results: EvalResult[] = [];

    for (let i = 0; i < DATASET.length; i++) {
        const item = DATASET[i];

        // 1. Get Subject Code Answer
        // Instructing it to be concise to make judging easier
        const subjectPrompt = `Question: ${item.q}\nAnswer concisely (one phrase or word).`;
        let actual = "";
        try {
            actual = await queryLLM("Answer the question.", subjectPrompt, modelName, false);
        } catch (e) {
            actual = "Error generating response.";
        }

        // 2. Grade It (Eval)
        // We use the same model as judge for simplicity in local setups, 
        // but typically a stronger model is better.
        const grade = await gradeResponse(item.q, item.a, actual, modelName);

        results.push({
            id: i + 1,
            question: item.q,
            expected: item.a,
            actual: actual.trim(),
            passed: grade.passed,
            reasoning: grade.reason
        });
    }

    return results;
}
