'use server';

export interface SwarmAgent {
    id: string;
    x: number;
    y: number;
    energy: number;
    hasFood: boolean;
}

const GRID_SIZE = 10;

export async function tickSwarm(agents: SwarmAgent[], foodLocation: [number, number]): Promise<SwarmAgent[]> {
    return agents.map(agent => {
        let { x, y, hasFood } = agent;
        const [fx, fy] = foodLocation;

        // Simple Pheromone Logic
        // If has food, go home (0,0)
        // If no food, go to food

        const targetX = hasFood ? 0 : fx;
        const targetY = hasFood ? 0 : fy;

        if (x < targetX) x++;
        else if (x > targetX) x--;

        if (y < targetY) y++;
        else if (y > targetY) y--;

        // Check pickup
        if (!hasFood && x === fx && y === fy) {
            hasFood = true;
        }

        // Check dropoff
        if (hasFood && x === 0 && y === 0) {
            hasFood = false; // Delivered
        }

        return { ...agent, x, y, hasFood, energy: agent.energy - 1 };
    });
}
