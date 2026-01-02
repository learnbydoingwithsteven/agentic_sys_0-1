'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export async function runWorkflow(emailSubject: string, emailBody: string, modelName: string = 'auto'): Promise<string[]> {
    const logs: string[] = [];
    logs.push(`Trigger: Received Email - "${emailSubject}"`);

    // 1. AI Analysis Step
    logs.push("AI Agent: Analyzing content for intent...");

    const systemPrompt = `You are a Workflow Automation Agent. 
    Analyze the incoming email and extract:
    1. Intent (SALES_LEAD, SPAM, SUPPORT, OTHER)
    2. Entity (Company or Person name if found)
    3. Sentiment (Positive, Neutral, Negative)
    
    Return JSON format: { "intent": "...", "entity": "...", "sentiment": "..." }`;

    const userPrompt = `Subject: ${emailSubject}\nBody: ${emailBody}`;

    let result: any = { intent: 'OTHER' };

    try {
        const raw = await queryLLM(systemPrompt, userPrompt, modelName, true);
        result = await extractJSON(raw);
        logs.push(`AI Output: Intent=${result.intent}, Entity=${result.entity || 'N/A'}`);
    } catch (e) {
        logs.push("AI Agent: Failed to parse intent. Defaulting to MANUAL_REVIEW.");
        return logs;
    }

    // 2. Logic Step
    if (result.intent === 'SPAM') {
        logs.push("Logic: Spam detected. Flagging sender and terminating workflow.");
        logs.push("Action: Email moved to Quarantine.");
        return logs;
    }

    if (result.intent === 'SALES_LEAD') {
        logs.push("Logic: Sales opportunity detected. Initiating pipeline.");

        // 3. CRM Step
        logs.push(`CRM: Creating new Record for '${result.entity || 'New Client'}'...`);
        await new Promise(r => setTimeout(r, 500)); // Simulate API
        logs.push("CRM: Success. Lead ID: #L-8842");

        // 4. Slack Step
        logs.push("Slack: Posting alert to #sales-leads channel.");
        return logs;
    }

    logs.push(`Logic: Unhandled intent '${result.intent}'. Forwarding to human review.`);
    return logs;
}
