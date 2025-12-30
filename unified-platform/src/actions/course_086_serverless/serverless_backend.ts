'use server';

let lastInvocation = 0;

export async function invokeAgentFunction(): Promise<{ status: 'COLD' | 'WARM', executionTime: number }> {
    const now = Date.now();
    const idleDuration = now - lastInvocation;

    // Reset if > 5 sec idle
    const isCold = lastInvocation === 0 || idleDuration > 5000;

    lastInvocation = now;

    if (isCold) {
        // Sim Cold Start (Spin up VM)
        await new Promise(r => setTimeout(r, 2000));
        return { status: 'COLD', executionTime: 2200 };
    } else {
        // Warm Start
        await new Promise(r => setTimeout(r, 100)); // Fast
        return { status: 'WARM', executionTime: 120 };
    }
}
