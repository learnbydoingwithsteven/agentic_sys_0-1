'use server';

import { queryLLM } from '@/lib/llm_helper';

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
    finalOutput?: string;
}

export async function runHierarchicalAgent(task: string, modelName: string = 'auto'): Promise<GraphState[]> {
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
        logs: [`Task received: "${task}"`, "Supervisor: Analyzing task and creating execution plan..."]
    };
    history.push(JSON.parse(JSON.stringify(currentState)));

    // STEP 1: SUPERVISOR PLANNING
    const supervisorPrompt = `You are a Project Supervisor.
Task: "${task}"

Create a brief research directive (1-2 sentences) for a Researcher to gather key facts.
Be specific about what information is needed.`;

    const researchDirective = await queryLLM("You are a strategic planner.", supervisorPrompt, modelName, false);

    currentState.nodes[0].status = 'idle';
    currentState.nodes[0].data = researchDirective;
    currentState.nodes[1].status = 'active';
    currentState.edges[0].active = true;
    currentState.logs.push(`Supervisor → Researcher: "${researchDirective.substring(0, 80)}..."`);
    history.push(JSON.parse(JSON.stringify(currentState)));

    // STEP 2: RESEARCHER GATHERING FACTS
    const researcherPrompt = `You are a Research Analyst.
Directive: ${researchDirective}

Provide 3-4 key facts or bullet points about this topic. Be concise and factual.`;

    const researchFindings = await queryLLM("You are a researcher.", researcherPrompt, modelName, false);

    currentState.nodes[1].status = 'completed';
    currentState.nodes[1].data = researchFindings;
    currentState.nodes[2].status = 'active';
    currentState.edges[0].active = false;
    currentState.edges[1].active = true;
    currentState.logs.push(`Researcher → Writer: Research complete (${researchFindings.split(' ').length} words)`);
    history.push(JSON.parse(JSON.stringify(currentState)));

    // STEP 3: WRITER CREATING CONTENT
    const writerPrompt = `You are a Content Writer.
Original Task: "${task}"
Research Findings:
${researchFindings}

Write a concise, well-structured response (2-3 paragraphs) that addresses the task using the research.`;

    const draft = await queryLLM("You are a professional writer.", writerPrompt, modelName, false);

    currentState.nodes[2].status = 'completed';
    currentState.nodes[2].data = draft;
    currentState.nodes[3].status = 'active';
    currentState.edges[1].active = false;
    currentState.edges[2].active = true;
    currentState.logs.push(`Writer → Editor: Draft ready for review (${draft.split(' ').length} words)`);
    history.push(JSON.parse(JSON.stringify(currentState)));

    // STEP 4: EDITOR REVIEWING
    const editorPrompt = `You are a Senior Editor.
Original Task: "${task}"
Draft Content:
${draft}

Review the draft. If it's good, respond with "APPROVED: [brief reason]".
If it needs work, respond with "REVISE: [specific feedback]".`;

    const editorDecision = await queryLLM("You are a critical editor.", editorPrompt, modelName, false);

    currentState.nodes[3].status = 'completed';
    currentState.nodes[3].data = editorDecision;
    currentState.nodes[0].status = 'completed';
    currentState.edges[2].active = false;
    currentState.edges[3].active = true;
    currentState.finalOutput = draft; // The final approved content
    currentState.logs.push(`Editor → Supervisor: ${editorDecision.substring(0, 60)}...`);
    currentState.logs.push("✓ Workflow Complete");
    history.push(JSON.parse(JSON.stringify(currentState)));

    return history;
}
