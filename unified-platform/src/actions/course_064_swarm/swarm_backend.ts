'use server';

export interface SwarmMessage {
    sender: string;
    text: string;
}

export async function runSwarmStep(history: SwarmMessage[]): Promise<SwarmMessage> {
    const lastSender = history.length > 0 ? history[history.length - 1].sender : 'User';

    // AutoGen-style Round Robin or Selector
    let nextSender = 'Manager';
    let text = "";

    if (lastSender === 'User' || lastSender === 'Reviewer') {
        nextSender = 'Manager';
        text = "I'll outline the plan. @Coder please implement the core logic.";
    } else if (lastSender === 'Manager') {
        nextSender = 'Coder';
        text = "Confirmed. Writing Python script to handle the request...";
    } else if (lastSender === 'Coder') {
        nextSender = 'Reviewer';
        text = "Checking code. Looks good, but add error handling.";
    }

    await new Promise(r => setTimeout(r, 1000));

    return { sender: nextSender, text };
}
