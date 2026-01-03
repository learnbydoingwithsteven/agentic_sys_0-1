'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const WALLS = ['1,1', '1,2', '3,3', '2,3'];
const GOAL = '4,4';
const GRID_SIZE = 5;

export async function predictOutcome(
    currentPos: [number, number], 
    move: Direction, 
    modelName: string = 'auto'
): Promise<{ pos: [number, number], outcome: 'OK' | 'CRASH' | 'WIN', explanation: string }> {
    
    // The World Model LLM simulates the physics/rules of the environment
    const prompt = `You are a Physics Simulator / World Model for a Grid World.
    
    Current Sate: Agent at [Row: ${currentPos[0]}, Col: ${currentPos[1]}].
    Action: Move ${move}.
    Environment Rules:
    - Grid is ${GRID_SIZE}x${GRID_SIZE} (Indices 0 to ${GRID_SIZE - 1}).
    - Walls are at locations: ${JSON.stringify(WALLS)} (Format: "Row,Col").
    - Goal is at: ${GOAL}.
    - Moving into a wall or out of bounds causes a CRASH (Agent stays in place).
    - Landing on Goal is a WIN.
    
    Task: Predict the Next State.
    Return JSON: { 
        "new_row": number, 
        "new_col": number, 
        "outcome": "OK" | "CRASH" | "WIN",
        "explanation": "Brief reasoning"
    }`;

    try {
        const raw = await queryLLM(prompt, "Simulate world step.", modelName, true);
        const res = await extractJSON(raw);
        
        // Return validated prediction
        // In a true generative world model, we'd trust the LLM fully. 
        // Here we return its prediction to the frontend.
        return {
            pos: [res.new_row, res.new_col],
            outcome: res.outcome,
            explanation: res.explanation
        };
    } catch (e) {
        // Fallback logic if LLM fails (Hardcoded physics)
        console.error("World Model Failed, using fallback physics", e);
        let [r, c] = currentPos;
        if (move === 'UP') r--;
        if (move === 'DOWN') r++;
        if (move === 'LEFT') c--;
        if (move === 'RIGHT') c++;
        
        let outcome: 'OK' | 'CRASH' | 'WIN' = 'OK';
        
        if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE || WALLS.includes(`${r},${c}`)) {
            return { pos: currentPos, outcome: 'CRASH', explanation: 'Fallback: Crash detected.' };
        }
        if (`${r},${c}` === GOAL) outcome = 'WIN';
        
        return { pos: [r, c], outcome, explanation: 'Fallback physics.' };
    }
}
