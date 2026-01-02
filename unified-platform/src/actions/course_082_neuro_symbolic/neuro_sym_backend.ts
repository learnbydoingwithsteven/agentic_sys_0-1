'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface MethodResult {
    method: 'PURE_LLM' | 'NEURO_SYMBOLIC';
    answer: string;
    isCorrect: boolean;
    logs: string[];
}

export async function solveSymbolicProblem(problem: string, modelName: string = 'auto'): Promise<MethodResult[]> {
    // 1. Calculate Truth (Symbolic Engine - Typescript)
    // We trust JS engine to be correct for math
    let truth = "Error";
    try {
        // Safe-ish eval for math only
        const clean = problem.replace(/[^0-9+\-*/().]/g, '');
        truth = eval(clean).toString();
    } catch (e) {
        truth = "Invalid Expression";
    }

    // 2. Pure LLM Attempt
    const pureStart = Date.now();
    const purePrompt = `Solve this math problem: ${problem}. Return ONLY the numeric answer. Do not show work.`;
    const pureRes = await queryLLM("You are a calculator.", purePrompt, modelName);
    // Cleanup LLM output (remove commas, text)
    const pureClean = pureRes.replace(/[^0-9.]/g, '');
    const pureCorrect = Math.abs(parseFloat(pureClean) - parseFloat(truth)) < 0.001;

    const pureResult: MethodResult = {
        method: 'PURE_LLM',
        answer: pureRes, // Show raw hallucination/answer
        isCorrect: pureCorrect,
        logs: [
            `Prompt: "${purePrompt}"`,
            `Raw Output: "${pureRes}"`,
            `Cleaned: ${pureClean}`,
            `Deviation: ${Math.abs(parseFloat(pureClean) - parseFloat(truth))}`
        ]
    };

    // 3. Neuro-Symbolic Attempt (ReAct Style)
    const symLogs: string[] = [];
    symLogs.push(`Goal: Solve ${problem}`);

    // Step A: Plan
    const toolSystem = `On receiving a math problem, return JSON: { "tool": "CALCULATOR", "expression": "string" }`;
    const toolPrompt = `Solve: ${problem}`;

    let symAnswer = "";
    try {
        const rawPlan = await queryLLM(toolSystem, toolPrompt, modelName, true);
        symLogs.push(`Agent Plan: ${rawPlan}`);
        const plan = await extractJSON(rawPlan);

        if (plan.tool === 'CALCULATOR') {
            // Step B: Symbolic Execution
            symLogs.push(`Executing Symbolic Tool: eval(${plan.expression})`);
            const cleanExpr = plan.expression.replace(/[^0-9+\-*/().]/g, '');
            const calcResult = eval(cleanExpr);
            symAnswer = calcResult.toString();
            symLogs.push(`Tool Output: ${symAnswer}`);
        } else {
            symAnswer = "Failed to plan";
        }
    } catch (e) {
        symAnswer = "Agent Error";
        symLogs.push(`Error: ${e}`);
    }

    const symCorrect = Math.abs(parseFloat(symAnswer) - parseFloat(truth)) < 0.001;

    const symResult: MethodResult = {
        method: 'NEURO_SYMBOLIC',
        answer: symAnswer,
        isCorrect: symCorrect,
        logs: symLogs
    };

    return [pureResult, symResult];
}
