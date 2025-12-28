'use server';

import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// --- Interfaces ---

export interface EvalResult {
    score: number; // 1 to 5
    reasoning: string;
}

const JUDGE_PROMPT = `
You are an impartial AI Judge. Your job is to evaluate the quality of an AI Assistant's response by comparing it to a Ground Truth answer.

Question: {question}
Ground Truth: {ground_truth}
Agent Response: {agent_response}

Evaluation Criteria:
- Accuracy: Does the agent response match the facts in the ground truth?
- Completeness: Did the agent miss distinct details present in the ground truth?
- Tone: Is the response helpful and polite? (Minor factor compared to accuracy)

Scoring Rubric (1-5):
1 - Completely wrong or irrelevant.
2 - Contains major factual errors or misses the core point.
3 - Partially correct but misses important details or includes minor inaccuracies.
4 - Mostly correct, accurate, but slightly differently worded or less comprehensive.
5 - Perfect match in meaning and facts (wording can vary).

You MUST return a JSON object in this format:
\`\`\`json
{{
    "score": <number>,
    "reasoning": "<concise explanation>"
}}
\`\`\`
`;

export async function runEvaluation(
    question: string,
    groundTruth: string,
    agentResponse: string,
    judgeModel: string = "llama3.2"
): Promise<EvalResult> {

    const llm = new ChatOllama({
        baseUrl: "http://127.0.0.1:11434",
        model: judgeModel,
        temperature: 0, // Deterministic logic for judging
        format: "json"
    });

    const chain = ChatPromptTemplate.fromTemplate(JUDGE_PROMPT)
        .pipe(llm)
        .pipe(new StringOutputParser());

    try {
        const result = await chain.invoke({
            question,
            ground_truth: groundTruth,
            agent_response: agentResponse
        });

        // Parse JSON
        const cleanJson = result.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);

        return {
            score: parsed.score || 0,
            reasoning: parsed.reasoning || "No reasoning provided."
        };
    } catch (e) {
        console.error("Evaluation failed:", e);
        return {
            score: 0,
            reasoning: "Error running evaluation. Check console."
        };
    }
}
