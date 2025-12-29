'use server';

export interface GraphNode {
    id: string;
    label: string;
    status: 'idle' | 'active' | 'completed';
    data?: string;
}

export interface GraphEdge {
    source: string;
    target: string;
    active: boolean;
}

export interface GraphState {
    nodes: GraphNode[];
    edges: GraphEdge[];
    logs: string[];
}

export async function runHierarchicalAgent(task: string): Promise<GraphState[]> {
    const history: GraphState[] = [];

    // Initial State
    let currentState: GraphState = {
        nodes: [
            { id: 'supervisor', label: 'Supervisor', status: 'active' },
            { id: 'researcher', label: 'Researcher', status: 'idle' },
            { id: 'writer', label: 'Writer', status: 'idle' },
            { id: 'editor', label: 'Editor', status: 'idle' }
        ],
        edges: [
            { source: 'supervisor', target: 'researcher', active: false },
            { source: 'researcher', target: 'writer', active: false },
            { source: 'writer', target: 'editor', active: false },
            { source: 'editor', target: 'supervisor', active: false }
        ],
        logs: [`Task received: "${task}"`, "Supervisor: Planning execution..."]
    };
    history.push(JSON.parse(JSON.stringify(currentState)));

    // Step 1: Supervisor -> Researcher
    currentState.nodes[0].status = 'idle'; // Super
    currentState.nodes[1].status = 'active'; // Researcher
    currentState.edges[0].active = true; // S->R
    currentState.logs.push("Supervisor: Delegating to Researcher to gather facts.");
    history.push(JSON.parse(JSON.stringify(currentState)));

    await new Promise(r => setTimeout(r, 100)); // Simul delay

    // Step 2: Researcher -> Writer
    currentState.nodes[1].status = 'completed';
    currentState.nodes[2].status = 'active';
    currentState.edges[0].active = false;
    currentState.edges[1].active = true; // R->W
    currentState.logs.push("Researcher: Facts gathered. Passing to Writer.");
    history.push(JSON.parse(JSON.stringify(currentState)));

    // Step 3: Writer -> Editor
    currentState.nodes[2].status = 'completed';
    currentState.nodes[3].status = 'active';
    currentState.edges[1].active = false;
    currentState.edges[2].active = true; // W->E
    currentState.logs.push("Writer: Draft complete. Requesting Editor review.");
    history.push(JSON.parse(JSON.stringify(currentState)));

    // Step 4: Editor -> Supervisor (Finish)
    currentState.nodes[3].status = 'completed';
    currentState.nodes[0].status = 'completed'; // Super done
    currentState.edges[2].active = false;
    currentState.edges[3].active = true; // E->S
    currentState.logs.push("Editor: Approved. Sending final output to Supervisor.");
    history.push(JSON.parse(JSON.stringify(currentState)));

    return history;
}
