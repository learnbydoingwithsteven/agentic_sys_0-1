'use server';

export interface WorkflowNode {
    id: string;
    label: string;
    status: 'pending' | 'running' | 'success' | 'failed';
    log?: string;
}

export async function executeWorkflow(triggerType: 'EMAIL' | 'WEBHOOK'): Promise<WorkflowNode[]> {
    // Defines the steps
    let steps: WorkflowNode[] = [
        { id: '1', label: 'Trigger: New Email', status: 'pending' },
        { id: '2', label: 'AI: Extract Intent', status: 'pending' },
        { id: '3', label: 'CRM: Create Lead', status: 'pending' },
        { id: '4', label: 'Slack: Notify Sales', status: 'pending' }
    ];

    // We yield the state progressively? 
    // Server Actions can't stream objects easily without `stream-ui`.
    // I will return the FINAL log, but the frontend will "simulate" the step-by-step for the demo.
    return steps;
}

// Actually, let's make it stateful/interactive per step? 
// No, simpler to just simulate the 'result' logs and let frontend handle animation.
export async function getWorkflowLogs(trigger: string): Promise<string[]> {
    await new Promise(r => setTimeout(r, 800));
    if (trigger === 'spam') {
        return [
            "Trigger: New Email from 'Prince of Nigeria'",
            "AI: Analyzed content. Intent: SPAM.",
            "Logic: Dropping workflow.",
            "End."
        ];
    } else {
        return [
            "Trigger: New Email from 'client@bigcorp.com'",
            "AI: Analyzed content. Intent: INQUIRY.",
            "CRM: Created Lead #9921",
            "Slack: Sent notification to #sales channel.",
            "Success."
        ];
    }
}
