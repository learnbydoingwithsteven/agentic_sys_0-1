'use server';

export type Cell = 'EMPTY' | 'WALL' | 'GOAL' | 'START';
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 5;
const WALLS = ['1,1', '1,2', '3,3', '2,3']; // Simple walls

export async function predictOutcome(currentPos: [number, number], move: Direction): Promise<{ pos: [number, number], outcome: 'OK' | 'CRASH' | 'WIN' }> {
    let [r, c] = currentPos;

    if (move === 'UP') r--;
    if (move === 'DOWN') r++;
    if (move === 'LEFT') c--;
    if (move === 'RIGHT') c++;

    // Check bounds
    if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) {
        return { pos: currentPos, outcome: 'CRASH' };
    }

    // Check walls
    if (WALLS.includes(`${r},${c}`)) {
        return { pos: currentPos, outcome: 'CRASH' };
    }

    // Check goal
    if (r === 4 && c === 4) {
        return { pos: [r, c], outcome: 'WIN' };
    }

    return { pos: [r, c], outcome: 'OK' };
}
