'use server';

export interface AgentTask {
    id: string;
    description: string;
    status: 'PENDING' | 'RUNNING' | 'COMPLETED';
    subtasks?: AgentTask[];
}

export async function startRecursiveLoop(goal: string): Promise<AgentTask> {
    // Determine tree based on goal
    // Goal: "Plan a Vacation"

    return {
        id: 'root',
        description: goal,
        status: 'RUNNING',
        subtasks: [
            {
                id: '1',
                description: 'Research Destinations',
                status: 'COMPLETED',
                subtasks: [
                    { id: '1.1', description: 'Scrape Travel Blogs', status: 'COMPLETED' },
                    { id: '1.2', description: 'Compare Flight Costs', status: 'COMPLETED' }
                ]
            },
            {
                id: '2',
                description: 'Book Logistics',
                status: 'RUNNING',
                subtasks: [
                    { id: '2.1', description: 'Book Hotel', status: 'RUNNING' },
                    { id: '2.2', description: 'Rent Car', status: 'PENDING' }
                ]
            }
        ]
    };
}
