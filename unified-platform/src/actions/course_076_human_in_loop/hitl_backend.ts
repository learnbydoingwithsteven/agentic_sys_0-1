'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface ActionTicket {
    id: string;
    actionType: string;
    details: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXECUTED';
    riskScore: number;
    riskReason: string;
}

let tickets: ActionTicket[] = [];

export async function getTickets(): Promise<ActionTicket[]> {
    return tickets;
}

export async function submitRequest(actionType: string, details: string, modelName: string = 'auto'): Promise<ActionTicket[]> {
    // 1. AI Compliance Check
    const systemPrompt = `You are a Risk Compliance AI.
    Analyze the requested action.
    If the action is Risky (e.g. huge refund, deleting data, public tweet), set status to PENDING.
    If the action is Safe/Routine (e.g. small refund, internal log, read data), set status to EXECUTED.
    
    Risk Threshold:
    - Financial > $50: High Risk
    - Delete Data: High Risk
    - Public Post: High Risk
    
    Return JSON:
    {
      "status": "PENDING" | "EXECUTED",
      "risk_score": number (0-100),
      "reason": "Why is it risky or safe?"
    }`;

    let analysis = { status: 'PENDING', risk_score: 50, reason: 'Manual review required.' };

    try {
        const raw = await queryLLM(systemPrompt, `Action: ${actionType}\nDetails: ${details}`, modelName, true);
        analysis = await extractJSON(raw);
    } catch (e) {
        console.error("Compliance Check Failed", e);
    }

    const newTicket: ActionTicket = {
        id: Math.random().toString(36).substr(2, 5),
        actionType,
        details,
        status: analysis.status as any,
        riskScore: analysis.risk_score,
        riskReason: analysis.reason
    };

    tickets = [newTicket, ...tickets];
    return tickets;
}

export async function resolveTicket(id: string, decision: 'APPROVED' | 'REJECTED'): Promise<ActionTicket[]> {
    tickets = tickets.map(t => t.id === id ? { ...t, status: decision } : t);
    return tickets;
}
