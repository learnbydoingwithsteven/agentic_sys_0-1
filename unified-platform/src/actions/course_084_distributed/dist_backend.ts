'use server';

export interface DistNode {
    id: string;
    role: 'FOLLOWER' | 'CANDIDATE' | 'LEADER';
    votes: number;
}

export async function runElection(nodes: DistNode[]): Promise<DistNode[]> {
    // 1. Reset
    let updatedNodes = nodes.map(n => ({ ...n, role: 'CANDIDATE', votes: 1 } as DistNode));

    // 2. Voting Logic (Randomized Latency Simulation)
    // Every node votes for a random candidate (simplification)
    updatedNodes.forEach(() => {
        const randomTarget = Math.floor(Math.random() * updatedNodes.length);
        updatedNodes[randomTarget].votes += 1;
    });

    // 3. Determine Leader
    const maxVotes = Math.max(...updatedNodes.map(n => n.votes));
    const leaders = updatedNodes.filter(n => n.votes === maxVotes);

    // Tie breaker: first one
    const winnerId = leaders[0].id;

    return updatedNodes.map(n => ({
        ...n,
        role: n.id === winnerId ? 'LEADER' : 'FOLLOWER'
    }));
}
