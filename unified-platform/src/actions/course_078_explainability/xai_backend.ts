'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface Explanation {
    decision: 'APPROVED' | 'DENIED';
    score: number;
    factors: { name: string, impact: number, reasoning: string }[];
    summary: string;
}

export async function explainDecision(creditScore: number, income: number, debt: number, modelName: string = 'auto'): Promise<Explanation> {

    const systemPrompt = `You are an XAI (Explainable AI) Loan Officer.
    Evaluate the loan application based on the financial data.
    
    Rules:
    - Credit Score > 700 is Good. < 600 is Bad.
    - DTI (Debt to Income Ratio) should be low.
    - Income should be sufficient.
    
    Return JSON detailed explanation:
    {
      "decision": "APPROVED" | "DENIED",
      "score": number (0-100 probability),
      "summary": "Short explanation text...",
      "factors": [
        { "name": "Credit Score", "impact": number (-50 to +50), "reasoning": "Why?" },
        { "name": "Income", "impact": number (-50 to +50), "reasoning": "Why?" },
        { "name": "Debt", "impact": number (-50 to +50), "reasoning": "Why?" }
      ]
    }`;

    const userPrompt = `
    Credit Score: ${creditScore}
    Annual Income: $${income}
    Total Debt: $${debt}
    `;

    // Default Fallback
    let result: Explanation = {
        decision: 'DENIED',
        score: 0,
        summary: 'AI Analysis Failed',
        factors: []
    };

    try {
        const raw = await queryLLM(systemPrompt, userPrompt, modelName, true);
        result = await extractJSON(raw);
    } catch (e) {
        console.error("XAI Failed", e);
    }

    return result;
}
