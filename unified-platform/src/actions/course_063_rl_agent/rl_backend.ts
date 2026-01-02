'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface GridState {
    agentPos: { r: number, c: number };
    goalPos: { r: number, c: number };
    trapPos: { r: number, c: number };
    lastReward: number;
    steps: number;
    status: 'playing' | 'won' | 'lost';
}

// Initial state creator
export async function initRLGame(): Promise<GridState> {
    return {
        agentPos: { r: 0, c: 0 },
        goalPos: { r: 4, c: 4 },
        trapPos: { r: 2, c: 2 },
        lastReward: 0,
        steps: 0,
        status: 'playing'
    };
}

export async function getAgentAction(state: GridState, modelName: string = 'auto'): Promise<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'> {
    const systemPrompt = `You are a Grid World Agent.
    Grid Size: 5x5 (Rows 0-4, Cols 0-4).
    Your Goal: Reach [4, 4].
    Avoid Trap at: [${state.trapPos.r}, ${state.trapPos.c}].
    Current Pos: [${state.agentPos.r}, ${state.agentPos.c}].
    
    Decide the best ONE move to get closer to Goal without hitting Trap.
    
    Output JSON ONLY: { "thought": "reasoning", "move": "UP/DOWN/LEFT/RIGHT" }`;

    try {
        const raw = await queryLLM(systemPrompt, "Make your move.", modelName, true);
        const result = await extractJSON(raw);
        const move = result.move.toUpperCase();
        if (['UP', 'DOWN', 'LEFT', 'RIGHT'].includes(move)) {
            return move;
        }
        return 'DOWN'; // Fallback
    } catch (e) {
        return 'RIGHT'; // Fallback
    }
}

export async function stepRLAgent(currentState: GridState, action: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'): Promise<GridState> {
    const next = { ...currentState, steps: currentState.steps + 1 };

    // Move logic
    // We clone positions to avoid mutating original state reference issues if any
    next.agentPos = { ...currentState.agentPos };

    if (action === 'UP' && next.agentPos.r > 0) next.agentPos.r--;
    if (action === 'DOWN' && next.agentPos.r < 4) next.agentPos.r++;
    if (action === 'LEFT' && next.agentPos.c > 0) next.agentPos.c--;
    if (action === 'RIGHT' && next.agentPos.c < 4) next.agentPos.c++;

    // Check collision
    if (next.agentPos.r === next.goalPos.r && next.agentPos.c === next.goalPos.c) {
        next.lastReward = 10;
        next.status = 'won';
    } else if (next.agentPos.r === next.trapPos.r && next.agentPos.c === next.trapPos.c) {
        next.lastReward = -10;
        next.status = 'lost';
    } else {
        next.lastReward = -0.1; // Living penalty to encourage speed
        next.status = 'playing';
    }

    return next;
}
