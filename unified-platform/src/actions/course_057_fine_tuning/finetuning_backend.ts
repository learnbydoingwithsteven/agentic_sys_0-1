'use server';

import { queryLLM } from '@/lib/llm_helper';

export async function getPreTrainedOutput(input: string, modelName: string = 'auto'): Promise<string> {
    // Simulates the "Base Model" behavior (Standard Assistant)
    const systemPrompt = "You are a helpful, standard AI assistant. Respond concisely and clearly.";
    const userPrompt = input;

    try {
        return await queryLLM(systemPrompt, userPrompt, modelName, false);
    } catch (error) {
        return "Error from base model.";
    }
}

export async function getFineTunedOutput(input: string, modelName: string = 'auto'): Promise<string> {
    // Simulates the "Fine-Tuned Model" behavior (Yoda Style)
    // In a real SOTA pipeline, this would point to a custom model endpoint (e.g., 'llama3:yoda-adapter')
    // For this educational module, we use System Prompting (In-Context Learning) to demonstrate the *effect* of fine-tuning.

    const systemPrompt = `You are Yoda. 
    Speak like Yoda you must. 
    Object-subject-verb word order use. 
    Wise and cryptic be. 
    Concise be.`;

    const userPrompt = input;

    try {
        return await queryLLM(systemPrompt, userPrompt, modelName, false);
    } catch (error) {
        return "Error, occurred has.";
    }
}

export async function startTrainingSimulation(): Promise<void> {
    // This action triggers the "Training" workflow on the server side
    // In a real implementation, this would start a Celery task or Modal job
    // We keep it as a signal for the frontend to start the visualizer
    await new Promise(r => setTimeout(r, 500));
}
