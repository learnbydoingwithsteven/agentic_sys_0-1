'use server';

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

export async function stepRLAgent(currentState: GridState, action: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'): Promise<GridState> {
    const next = { ...currentState, steps: currentState.steps + 1 };

    // Move logic
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
