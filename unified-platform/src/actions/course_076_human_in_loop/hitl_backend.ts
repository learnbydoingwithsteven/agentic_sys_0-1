'use server';

export interface ActionTicket {
    id: string;
    actionType: 'REFUND' | 'DELETE_DATA' | 'PUBLISH_TWEET';
    details: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

// Pseudo-DB
let tickets: ActionTicket[] = [
    { id: '101', actionType: 'REFUND', details: 'Refund $49.99 to user@example.com', status: 'PENDING' },
    { id: '102', actionType: 'PUBLISH_TWEET', details: 'Tweet: "We are having a sale!"', status: 'PENDING' }
];

export async function getTickets(): Promise<ActionTicket[]> {
    return tickets;
}

export async function resolveTicket(id: string, decision: 'APPROVED' | 'REJECTED'): Promise<ActionTicket[]> {
    tickets = tickets.map(t => t.id === id ? { ...t, status: decision } : t);
    return tickets;
}
