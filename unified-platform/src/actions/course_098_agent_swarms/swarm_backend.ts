'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface SwarmAgent {
    id: string;
    x: number;
    y: number;
    hasFood: boolean;
    role: 'EXPLORER' | 'WORKER';
}

const GRID_SIZE = 10;

// The Hive Mind Strategy (Global State)
let currentStrategy = "GATHER_FOOD";

export async function updateHiveStrategy(agents: SwarmAgent[], modelName: string = 'auto'): Promise<string> {
    // Hive Mind Agent decides global strategy based on agent states
    const status = agents.map(a => `Agent ${a.id}: At [${a.x},${a.y}], Loaded: ${a.hasFood}`).join('\n');

    const prompt = `You are the Hive Mind of an insect swarm.
    Current Agent Status:
    ${status}
    
    Grid Size: 10x10.
    Base at: 0,0.
    
    Determine the best high-level strategy for the swarm to maximize efficiency.
    Strategies: "EXPLORE_RANDOM", "RUSH_FOOD", "RETURN_BASE", "SPLIT_UP".
    
    Return JSON: { "strategy": "string", "reasoning": "string" }`;

    try {
        const raw = await queryLLM(prompt, "Decide Swarm Strategy", modelName, true);
        const res = await extractJSON(raw);
        currentStrategy = res.strategy;
        return `${res.strategy} (${res.reasoning || 'logic'})`;
    } catch {
        return "DEFAULT_STRATEGY";
    }
}

export async function tickSwarm(agents: SwarmAgent[], foodPos: [number, number]): Promise<SwarmAgent[]> {
    // Movement logic modulated by Strategy (simulated here for speed, influenced by global state)
    // Real implementation would pass strategy to each agent Tick.

    return agents.map(agent => {
        let { x, y, hasFood } = agent;
        const [fx, fy] = foodPos;

        // Target Logic based on Strategy + State
        let tx = x, ty = y;

        if (hasFood) {
            // Always return home if loaded
            tx = 0; ty = 0;
        } else {
            // If empty, look for food or explore
            if (currentStrategy.includes("RUSH_FOOD") || currentStrategy.includes("GATHER")) {
                tx = fx; ty = fy;
            } else if (currentStrategy.includes("RETURN")) {
                tx = 0; ty = 0;
            } else {
                // Random / Split
                tx = Math.floor(Math.random() * GRID_SIZE);
                ty = Math.floor(Math.random() * GRID_SIZE);
            }
        }

        // Move towards target
        if (x < tx) x++; else if (x > tx) x--;
        if (y < ty) y++; else if (y > ty) y--;

        // Physics
        if (!hasFood && x === fx && y === fy) hasFood = true;
        if (hasFood && x === 0 && y === 0) hasFood = false;

        return { ...agent, x, y, hasFood };
    });
}
