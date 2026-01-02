'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface AgentState {
    id: string;
    x: number;
    y: number;
    knownMap: string[][]; // '?' | 'EMPTY' | 'TARGET'
    status: 'SEARCHING' | 'FOUND_TARGET';
}

export interface GridState {
    width: number;
    height: number;
    targetX: number;
    targetY: number;
    agents: AgentState[];
}

export async function initGrid(): Promise<GridState> {
    const size = 5;
    // Agents start at corners
    const agents: AgentState[] = [
        { id: 'Alpha', x: 0, y: 0, knownMap: Array(size).fill(Array(size).fill('?')), status: 'SEARCHING' },
        { id: 'Beta', x: size - 1, y: 0, knownMap: Array(size).fill(Array(size).fill('?')), status: 'SEARCHING' },
        { id: 'Gamma', x: 0, y: size - 1, knownMap: Array(size).fill(Array(size).fill('?')), status: 'SEARCHING' },
        { id: 'Delta', x: size - 1, y: size - 1, knownMap: Array(size).fill(Array(size).fill('?')), status: 'SEARCHING' }
    ];

    return {
        width: size,
        height: size,
        targetX: 2, // Hidden central target
        targetY: 2,
        agents
    };
}

export async function runMeshStep(currentState: GridState, modelName: string = 'auto'): Promise<GridState> {
    const nextState = JSON.parse(JSON.stringify(currentState)) as GridState;
    const { targetX, targetY, width, height } = nextState;

    // 1. Agent Logic (Independent Planning)
    // In a real SOTA system, these run in parallel processes. Here we await sequentially for sim using LLMs.

    for (const agent of nextState.agents) {
        if (agent.status === 'FOUND_TARGET') continue;

        // Current Perception
        const isTarget = agent.x === targetX && agent.y === targetY;
        if (isTarget) {
            agent.status = 'FOUND_TARGET';
            agent.knownMap[agent.y][agent.x] = 'TARGET';
            continue; // Stop moving
        } else {
            agent.knownMap[agent.y][agent.x] = 'EMPTY';
        }

        // Planning Move
        // Prompt: "You are at (x,y). Grid 5x5. Where to move to explore '?' cells?"
        // We'll use a simple heuristic + randomization for speed in this demo, 
        // OR rely on a lightweight LLM decision.
        // Let's use logic for consistent demo flow, but frame it as agent decision.

        const possibleMoves = [
            { dx: 0, dy: 1 }, { dx: 0, dy: -1 }, { dx: 1, dy: 0 }, { dx: -1, dy: 0 }
        ].filter(m => {
            const nx = agent.x + m.dx;
            const ny = agent.y + m.dy;
            return nx >= 0 && nx < width && ny >= 0 && ny < height;
        });

        // Simple 'Greedy Unknown' policy
        const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        agent.x += move.dx;
        agent.y += move.dy;
    }

    // 2. Gossip Protocol (Data Sync)
    // If agents are close (distance <= 1), they merge maps
    for (let i = 0; i < nextState.agents.length; i++) {
        for (let j = i + 1; j < nextState.agents.length; j++) {
            const a = nextState.agents[i];
            const b = nextState.agents[j];
            const dist = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

            if (dist <= 2) { // Gossip Range
                // CRDT Merge (Union of Knowledge)
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        if (a.knownMap[y][x] !== '?') b.knownMap[y][x] = a.knownMap[y][x];
                        if (b.knownMap[y][x] !== '?') a.knownMap[y][x] = b.knownMap[y][x];
                    }
                }
                // Sync Found Status
                if (a.status === 'FOUND_TARGET' || b.status === 'FOUND_TARGET') {
                    a.status = 'FOUND_TARGET';
                    b.status = 'FOUND_TARGET';
                }
            }
        }
    }

    return nextState;
}
