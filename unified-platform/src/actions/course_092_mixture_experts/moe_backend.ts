'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface MoeLog {
    query: string;
    selectedExpert: 'CODE' | 'MATH' | 'GENERAL';
    confidence: number;
    reasoning: string;
    response: string;
}

export async function processMoeRequest(query: string, modelName: string = 'auto'): Promise<MoeLog> {
    // 1. Router Agent: Classify the query type
    const routerPrompt = `You are a Router Agent in a Mixture of Experts system.
    User Query: "${query}"
    
    Available Experts:
    - CODE: For programming, debugging, code generation
    - MATH: For calculations, equations, numerical problems
    - GENERAL: For general knowledge, conversation, other topics
    
    Select the best expert and provide confidence (0-1).
    Return JSON: { "expert": "CODE" | "MATH" | "GENERAL", "confidence": number, "reasoning": "string" }`;

    let selectedExpert: 'CODE' | 'MATH' | 'GENERAL' = 'GENERAL';
    let confidence = 0.5;
    let reasoning = "Default routing.";

    try {
        const raw = await queryLLM(routerPrompt, "Route query.", modelName, true);
        const res = await extractJSON(raw);
        selectedExpert = res.expert;
        confidence = res.confidence;
        reasoning = res.reasoning;
    } catch { }

    // 2. Expert Agent: Generate response using specialized persona
    const expertPrompts = {
        CODE: `You are a Code Expert. User asks: "${query}". Provide a concise, technical code-focused answer.`,
        MATH: `You are a Math Expert. User asks: "${query}". Provide a precise mathematical answer with calculations.`,
        GENERAL: `You are a General Knowledge Expert. User asks: "${query}". Provide a helpful, conversational answer.`
    };

    const response = await queryLLM(expertPrompts[selectedExpert], "Answer as expert.", modelName);

    return {
        query,
        selectedExpert,
        confidence,
        reasoning,
        response
    };
}
