'use server'

import { ChatOllama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableMap } from "@langchain/core/runnables";
import { getOllamaModels } from "@/actions/course_004_state_management/chat";

// --- Types ---
export type ChainStep = {
    name: string;
    result: string;
    status: 'pending' | 'running' | 'completed' | 'skipped';
};

export type ChainResult = {
    steps: ChainStep[];
    finalOutput: string;
};

// --- Models ---
async function getModel() {
    const models = await getOllamaModels();
    const modelName = models.length > 0 ? models[0] : "llama3.2"; // Fallback to first available or default

    return new ChatOllama({
        baseUrl: "http://127.0.0.1:11434",
        model: modelName,
        temperature: 0.7,
    });
}

// --- 1. Sequential Chain: Writer Workflow ---
export async function runSequentialChain(topic: string): Promise<ChainResult> {
    const steps: ChainStep[] = [];
    try {
        const llm = await getModel();

        // Step 1: Outline
        const outlinePrompt = PromptTemplate.fromTemplate(
            "Generate a specialized, 3-point outline for a blog post about: {topic}. Return ONLY the 3 points, nothing else."
        );
        const outlineChain = outlinePrompt.pipe(llm).pipe(new StringOutputParser());

        const outlineResult = await outlineChain.invoke({ topic });
        steps.push({ name: 'Generate Outline', result: outlineResult, status: 'completed' });

        // Step 2: Introduction
        const introPrompt = PromptTemplate.fromTemplate(
            "Write a catchy introduction paragraph based on this outline:\n{outline}\n\nIntroduction:"
        );
        const introChain = introPrompt.pipe(llm).pipe(new StringOutputParser());

        const introResult = await introChain.invoke({ outline: outlineResult });
        steps.push({ name: 'Write Introduction', result: introResult, status: 'completed' });

        // Step 3: Critique
        const critiquePrompt = PromptTemplate.fromTemplate(
            "Critique the following introduction for clarity and engagement. Keep it brief (1 sentence).\n\nIntro: {intro}\n\nCritique:"
        );
        const critiqueChain = critiquePrompt.pipe(llm).pipe(new StringOutputParser());

        const critiqueResult = await critiqueChain.invoke({ intro: introResult });
        steps.push({ name: 'AI Critique', result: critiqueResult, status: 'completed' });

        return { steps, finalOutput: introResult };

    } catch (e: any) {
        console.error("Sequential Chain Error:", e);
        return {
            steps: [...steps, { name: 'Error', result: `Failed: ${e.message}`, status: 'completed' }],
            finalOutput: "Error executing chain. Check server logs."
        };
    }
}

// --- 2. Router Chain: Specialist Routing ---
export async function runRouterChain(input: string): Promise<ChainResult> {
    const steps: ChainStep[] = [];
    try {
        const llm = await getModel();

        // Step 1: Classifier
        const classifierPrompt = PromptTemplate.fromTemplate(
            `Classify the following query into ONE of these categories: MATH, CODE, WRITING, or GENERAL.
            Query: {input}
            Category (ONE WORD ONLY):`
        );
        const classifierChain = classifierPrompt.pipe(llm).pipe(new StringOutputParser());

        const categoryRaw = await classifierChain.invoke({ input });
        const category = categoryRaw.trim().toUpperCase().replace(/[^A-Z]/g, ''); // Clean output

        steps.push({ name: 'Classifier', result: `Detected Category: ${category}`, status: 'completed' });

        // Step 2: Route
        let finalPromptTemplate = "";
        let routeName = "";

        if (category.includes('MATH')) {
            finalPromptTemplate = "Solve this math problem step-by-step: {input}";
            routeName = "Math Expert";
        } else if (category.includes('CODE')) {
            finalPromptTemplate = "Write efficient code to solve: {input}";
            routeName = "Coding Expert";
        } else if (category.includes('WRITING')) {
            finalPromptTemplate = "Write a creative response for: {input}";
            routeName = "Creative Writer";
        } else {
            finalPromptTemplate = "Answer this general question: {input}";
            routeName = "General Assistant";
        }

        steps.push({ name: `Routing to ${routeName}`, result: "Routing...", status: 'running' });

        const expertPrompt = PromptTemplate.fromTemplate(finalPromptTemplate);
        const expertChain = expertPrompt.pipe(llm).pipe(new StringOutputParser());

        const finalResult = await expertChain.invoke({ input });

        // Update previous step to completed
        steps[steps.length - 1] = { name: routeName, result: "Task Completed", status: 'completed' };

        return { steps, finalOutput: finalResult };

    } catch (e: any) {
        console.error("Router Chain Error:", e);
        return {
            steps: [...steps, { name: 'Error', result: `Failed: ${e.message}`, status: 'completed' }],
            finalOutput: "Error executing chain."
        };
    }
}

// --- 3. Parallel Chain: Multi-Perspective Analysis ---
export async function runParallelChain(topic: string): Promise<ChainResult> {
    const steps: ChainStep[] = [];
    try {
        const llm = await getModel();

        // We want to run two branches in parallel: "Optimist" vs "Pessimist"

        steps.push({ name: 'Parallel Execution', result: 'Starting parallel branches...', status: 'running' });

        const optimistPrompt = PromptTemplate.fromTemplate("Give 3 OPTIMISTIC reasons why {topic} is great. Keep it brief.");
        const pessimistPrompt = PromptTemplate.fromTemplate("Give 3 PESSIMISTIC reasons/risks about {topic}. Keep it brief.");

        const parallelChain = RunnableMap.from({
            optimist: optimistPrompt.pipe(llm).pipe(new StringOutputParser()),
            pessimist: pessimistPrompt.pipe(llm).pipe(new StringOutputParser()),
        });

        const results = await parallelChain.invoke({ topic });

        steps[0] = { name: 'Parallel Execution', result: 'Both branches finished.', status: 'completed' };
        steps.push({ name: 'Branch A (Optimist)', result: results.optimist, status: 'completed' });
        steps.push({ name: 'Branch B (Pessimist)', result: results.pessimist, status: 'completed' });

        // Aggregation Step
        const aggregatorPrompt = PromptTemplate.fromTemplate(
            "Synthesize these two perspectives into a balanced conclusion about {topic}.\n\nOptimist View:\n{optimist}\n\nPessimist View:\n{pessimist}\n\nConclusion:"
        );
        const aggChain = aggregatorPrompt.pipe(llm).pipe(new StringOutputParser());

        const finalConclusion = await aggChain.invoke({
            topic,
            optimist: results.optimist,
            pessimist: results.pessimist
        });

        steps.push({ name: 'Aggregator', result: 'Synthesis complete.', status: 'completed' });

        return { steps, finalOutput: finalConclusion };

    } catch (e: any) {
        console.error("Parallel Chain Error:", e);
        return {
            steps: [...steps, { name: 'Error', result: `Failed: ${e.message}`, status: 'completed' }],
            finalOutput: "Error executing chain."
        };
    }
}
