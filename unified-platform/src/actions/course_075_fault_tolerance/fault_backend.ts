'use server';

export interface CircuitState {
    status: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
    failures: number;
    lastFailure: number;
}

let circuit: CircuitState = { status: 'CLOSED', failures: 0, lastFailure: 0 };

export async function resetCircuit() {
    circuit = { status: 'CLOSED', failures: 0, lastFailure: 0 };
}

export async function unreliableApiCall(): Promise<{ success: boolean; message: string; circuit: CircuitState }> {
    // Check Circuit
    if (circuit.status === 'OPEN') {
        // Pseudo-timeout check (reset after 5s for demo)
        if (Date.now() - circuit.lastFailure > 5000) {
            circuit.status = 'HALF_OPEN';
        } else {
            return { success: false, message: "Circuit OPEN: Fail Fast", circuit };
        }
    }

    // Call Logic
    // Fail 70% of the time to force errors
    const isSuccess = Math.random() > 0.7;

    if (isSuccess) {
        if (circuit.status === 'HALF_OPEN') circuit.status = 'CLOSED'; // Recover
        circuit.failures = 0;
        return { success: true, message: "200 OK", circuit };
    } else {
        circuit.failures++;
        circuit.lastFailure = Date.now();
        if (circuit.failures >= 3) circuit.status = 'OPEN'; // Trip
        return { success: false, message: "500 Internal Error", circuit };
    }
}
