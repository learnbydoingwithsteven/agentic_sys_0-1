'use server';

export interface EventLog {
    id: string;
    topic: string;
    consumer: string;
    status: 'RECEIVED' | 'PROCESSED';
    timestamp: number;
}

export async function publishMockEvent(topic: string): Promise<EventLog[]> {
    // Determine subscribers based on topic
    const timestamp = Date.now();

    if (topic === 'ORDER_PLACED') {
        return [
            { id: '1', topic, consumer: 'ShippingAgent', status: 'PROCESSED', timestamp },
            { id: '2', topic, consumer: 'EmailAgent', status: 'PROCESSED', timestamp },
            { id: '3', topic, consumer: 'InventoryAgent', status: 'PROCESSED', timestamp }
        ];
    }

    if (topic === 'USER_SIGNUP') {
        return [
            { id: '4', topic, consumer: 'OnboardingAgent', status: 'PROCESSED', timestamp },
            { id: '5', topic, consumer: 'CRMAgent', status: 'PROCESSED', timestamp }
        ];
    }

    return [];
}
