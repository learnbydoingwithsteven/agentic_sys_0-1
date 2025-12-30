'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface EvalRun {
    id: string;
    question: string;
    answer: string;
    metrics: {
        faithfulness: number; // 0-1
        answerRelevance: number; // 0-1
        contextPrecision: number; // 0-1
    };
}

// Fixed dataset for consistent demo
const DATASET = [
    {
        id: '1',
        question: "What is the capital of France?",
        answer: "Paris is the capital of France.",
        context: "France is a country in Europe. Its capital is Paris."
    },
    {
        id: '2',
        question: "How do I reset my password?",
        answer: "You can go to settings.",
        context: "To reset password: Go to Settings > Security > Reset Password."
    },
    {
        id: '3',
        question: "Explain Quantum Physics",
        answer: "It involves cats and boxes.",
        context: "Quantum physics deals with the behavior of matter and energy at the most fundamental level."
    }
];

export async function runEvaluation(datasetName: string, modelName: string = 'auto'): Promise<EvalRun[]> {
    const results: EvalRun[] = [];

    for (const item of DATASET) {
        const systemPrompt = `You are an AI Evaluation Metric. 
        Evaluate the Answer against the Question and Context.
        
        Question: ${item.question}
        Context: ${item.context}
        Answer: ${item.answer}

        Calculate 3 metrics (0.0 to 1.0):
        1. Faithfulness: Is the answer derived from context?
        2. Answer Relevance: Does it answer the question?
        3. Context Precision: How precise is the context usage?

        Return strictly valid JSON: {"faithfulness": 0.9, "answerRelevance": 0.8, "contextPrecision": 0.5}`;

        try {
            const rawResponse = await queryLLM(systemPrompt, "Evaluate this.", modelName, false);
            const metrics = await extractJSON(rawResponse);

            results.push({
                id: item.id,
                question: item.question,
                answer: item.answer,
                metrics: {
                    faithfulness: Number(metrics.faithfulness) || 0,
                    answerRelevance: Number(metrics.answerRelevance) || 0,
                    contextPrecision: Number(metrics.contextPrecision) || 0
                }
            });
        } catch (e) {
            console.error(`Eval failed for ${item.id}`, e);
            // Fallback to random/low if LLM fails
            results.push({
                id: item.id,
                question: item.question,
                answer: item.answer,
                metrics: { faithfulness: 0, answerRelevance: 0, contextPrecision: 0 }
            });
        }
    }

    return results;
}
