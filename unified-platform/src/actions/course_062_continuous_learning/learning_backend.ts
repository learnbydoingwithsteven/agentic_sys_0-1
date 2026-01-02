'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

// In-memory knowledge base for the session
// Real implementation would use a Vector DB (Chroma/LanceDB)
let knowledgeBase: Record<string, string> = {};

export async function askAgent(question: string, modelName: string = 'auto'): Promise<{ answer: string, confidence: number, fromMemory: boolean }> {
    const context = JSON.stringify(knowledgeBase, null, 2);

    const systemPrompt = `You are a Continuous Learning Agent.
    You have a dynamic Memory that overrides your pre-training.
    
    Memory (JSON Key-Value pairs where Key=Question, Value=Learned Fact): 
    ${Object.keys(knowledgeBase).length ? context : "Empty"}
    
    Instructions:
    1. Check if the User's Question matches or is semantically related to any key in Memory.
    2. If yes, Use the Memory value as the Absolute Truth (even if it conflicts with your internal training).
    3. If no, answer based on your internal knowledge.
    
    Output Format (JSON Only):
    {
        "answer": "The answer...",
        "fromMemory": true/false
    }`;

    // Note: We use jsonMode=true for structured output
    try {
        const raw = await queryLLM(systemPrompt, question, modelName, true);
        const result = await extractJSON(raw);
        return {
            answer: result.answer,
            confidence: result.fromMemory ? 1.0 : 0.8,
            fromMemory: result.fromMemory
        };
    } catch (e) {
        return { answer: "I encountered an error accessing my brain.", confidence: 0, fromMemory: false };
    }
}

export async function teachAgent(question: string, correctAnswer: string): Promise<void> {
    // We store it simply keyed by the question text for this demo
    // distinct from vector search but effective for "correction"
    knowledgeBase[question] = correctAnswer;
}

export async function resetBrain(): Promise<void> {
    knowledgeBase = {};
}
