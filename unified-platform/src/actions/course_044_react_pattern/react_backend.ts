'use server';

import { queryLLM } from '@/lib/llm_helper';

export interface ReactStep {
    id: number;
    type: 'THOUGHT' | 'ACTION' | 'OBSERVATION' | 'ANSWER';
    content: string;
}

// Mock Search Tool
async function searchTool(query: string): Promise<string> {
    const q = query.toLowerCase();
    if (q.includes('president') && q.includes('us')) return "The current US President is Joe Biden.";
    if (q.includes('biden') && (q.includes('age') || q.includes('born') || q.includes('birth'))) return "Joe Biden was born on November 20, 1942.";
    return "No relevant information found.";
}

export async function runReactLoop(question: string, modelName: string = 'auto'): Promise<ReactStep[]> {
    const steps: ReactStep[] = [];
    let idCounter = 1;

    // We will run a max of 3 iterations
    const history: string[] = [];
    const maxSteps = 3;

    // Initial System Prompt
    const systemPrompt = `You are a ReAct Agent. You have access to a SEARCH tool.
    To solve the user's question, you must alternate Thought, Action, and Observation.
    
    Format:
    Thought: [Your reasoning]
    Action: SEARCH:[query]
    
    If you have the answer, output:
    Thought: I have the answer.
    Action: FINISH:[The answer]
    
    ONLY OUTPUT ONE STEP AT A TIME (Thought + Action). Wait for Observation.`;

    let currentInput = `Question: ${question}`;

    for (let i = 0; i < maxSteps; i++) {
        // Query LLM
        // We accumulate history manually
        const prompt = currentInput;
        const response = await queryLLM(systemPrompt, prompt, modelName, false);

        // Parse Response
        const lines = response.split('\n');
        let thought = '';
        let action = '';

        for (const line of lines) {
            if (line.startsWith('Thought:')) thought = line.replace('Thought:', '').trim();
            if (line.startsWith('Action:')) action = line.replace('Action:', '').trim();
        }

        // If LLM fails to follow format, try to salvage
        if (!thought && response.length > 0) thought = response;

        steps.push({ id: idCounter++, type: 'THOUGHT', content: thought || "Thinking..." });

        if (action) {
            steps.push({ id: idCounter++, type: 'ACTION', content: action });

            // Check for Finish
            if (action.startsWith('FINISH:')) {
                const answer = action.replace('FINISH:', '').replace('[', '').replace(']', '').trim();
                steps.push({ id: idCounter++, type: 'ANSWER', content: answer });
                break;
            }

            // Execute Tool
            if (action.startsWith('SEARCH:')) {
                const query = action.replace('SEARCH:', '').replace('[', '').replace(']', '').trim();
                const observation = await searchTool(query);

                steps.push({ id: idCounter++, type: 'OBSERVATION', content: observation });

                // Prepare next turn
                currentInput += `\nThought: ${thought}\nAction: ${action}\nObservation: ${observation}`;
            }
        } else {
            // If no action, maybe it just answered?
            steps.push({ id: idCounter++, type: 'ANSWER', content: response });
            break;
        }
    }

    return steps;
}
