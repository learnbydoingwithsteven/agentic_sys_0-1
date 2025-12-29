'use server';

export interface BoundingBox {
    id: string;
    label: string;
    confidence: number;
    x: number; // Percentage 0-100
    y: number; // Percentage 0-100
    width: number; // Percentage
    height: number; // Percentage
    color: string;
}

export async function detectObjects(imageId: string): Promise<BoundingBox[]> {
    await new Promise(r => setTimeout(r, 1000)); // Latency

    if (imageId === 'street') {
        return [
            { id: '1', label: 'Car', confidence: 0.98, x: 10, y: 50, width: 30, height: 20, color: 'blue' },
            { id: '2', label: 'Person', confidence: 0.95, x: 50, y: 45, width: 10, height: 25, color: 'red' },
            { id: '3', label: 'Traffic Light', confidence: 0.99, x: 80, y: 10, width: 5, height: 15, color: 'green' }
        ];
    }

    if (imageId === 'office') {
        return [
            { id: '1', label: 'Laptop', confidence: 0.99, x: 30, y: 60, width: 25, height: 20, color: 'purple' },
            { id: '2', label: 'Coffee Cup', confidence: 0.92, x: 60, y: 65, width: 8, height: 10, color: 'orange' },
            { id: '3', label: 'Person', confidence: 0.88, x: 20, y: 20, width: 30, height: 40, color: 'red' }
        ];
    }

    return [];
}
