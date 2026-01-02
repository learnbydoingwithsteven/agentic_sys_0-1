'use server';

import { queryLLM } from '@/lib/llm_helper';

export interface TraceSpan {
    id: string;
    parent?: string;
    name: string;
    startTime: number;
    endTime: number;
    metadata?: any;
    status: 'success' | 'error';
}

class TraceCollector {
    spans: TraceSpan[] = [];
    startTime: number;

    constructor() {
        this.startTime = Date.now();
    }

    startSpan(name: string, parent?: string, metadata?: any): string {
        const id = 'span_' + Math.random().toString(36).substr(2, 9);
        this.spans.push({
            id,
            parent,
            name,
            startTime: Date.now() - this.startTime, // Relative time
            endTime: 0,
            metadata,
            status: 'success'
        });
        return id;
    }

    endSpan(id: string, status: 'success' | 'error' = 'success', metadataUpdate?: any) {
        const span = this.spans.find(s => s.id === id);
        if (span) {
            span.endTime = Date.now() - this.startTime;
            span.status = status;
            if (metadataUpdate) {
                span.metadata = { ...span.metadata, ...metadataUpdate };
            }
        }
    }

    getSpans() {
        return this.spans;
    }
}

export async function runObservedRequest(input: string, modelName: string = 'auto'): Promise<TraceSpan[]> {
    const tracer = new TraceCollector();
    // Root Span
    const rootId = tracer.startSpan('AgentExecution', undefined, { input });

    try {
        // Step 1: Planning
        const planId = tracer.startSpan('PlanningStep', rootId, { strategy: 'CoT' });
        const planPrompt = `Create a very short 3-step plan to: ${input}`;
        const plan = await queryLLM("You are a Planner.", planPrompt, modelName, false);
        tracer.endSpan(planId, 'success', { output: plan });

        // Step 2: Tool Simulation (Weather)
        const toolId = tracer.startSpan('Tool:WeatherAPI', rootId, { location: 'Inferred' });
        // Simulate tool latency
        await new Promise(r => setTimeout(r, 500));

        let toolResult = "Sunny, 25C";
        if (input.includes("fail")) {
            // Simulate Failure
            tracer.endSpan(toolId, 'error', { error: 'ConnectionTimeout' });
            throw new Error("Tool execution failed");
        } else {
            const toolPrompt = `Simulate a realistic weather report for a vacation destination mentioned in: "${input}". Return just the weather.`;
            toolResult = await queryLLM("You are a Weather Simulator.", toolPrompt, modelName, false);
            tracer.endSpan(toolId, 'success', { result: toolResult });
        }

        // Step 3: Synthesis
        const genId = tracer.startSpan('LLMCall:Summarize', rootId);
        const synthesisPrompt = `Synthesize a response based on Plan: ${plan} and Weather: ${toolResult}`;
        const output = await queryLLM("Concise Assistant", synthesisPrompt, modelName, false);
        tracer.endSpan(genId, 'success', { output });

        tracer.endSpan(rootId, 'success');

    } catch (e: any) {
        tracer.endSpan(rootId, 'error', { error: e.message });
    }

    return tracer.getSpans();
}
