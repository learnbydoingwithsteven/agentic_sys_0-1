'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface AgentVersion {
    version: string;
    prompt: string;
    model: string;
    changelog: string;
    timestamp: number;
}

// In-memory stickiness for the session
let VERSIONS: AgentVersion[] = [
    {
        version: 'v1.0.0',
        prompt: "You are a helpful assistant.",
        model: "auto",
        changelog: "Initial Commit",
        timestamp: Date.now()
    }
];

export async function getAgentVersions(): Promise<AgentVersion[]> {
    return VERSIONS.sort((a, b) => b.timestamp - a.timestamp);
}

export async function createNewVersion(currentVersion: string, instruction: string, modelName: string = 'auto'): Promise<AgentVersion> {
    const parent = VERSIONS.find(v => v.version === currentVersion) || VERSIONS[0];

    // Agentic Step: Meta-Prompting
    // The LLM acts as the "Developer" modifying the "System Prompt"
    const systemMeta = `You are a Senior Promopt Engineer.
    Your task is to modify the given System Prompt based on the User's Instruction.
    Also generate a semantic version bump (e.g. 1.0.0 -> 1.1.0 or 1.0.1) and a concise changelog.
    
    Return JSON:
    {
      "new_prompt": "The modified system prompt...",
      "version": "vX.Y.Z",
      "changelog": "Short description of change"
    }`;

    const userMeta = `Current Prompt: "${parent.prompt}"
    User Instruction: "${instruction}"
    Current Version: ${parent.version}`;

    let result = {
        new_prompt: parent.prompt,
        version: parent.version + ".1",
        changelog: "Manual bump"
    };

    try {
        const raw = await queryLLM(systemMeta, userMeta, modelName, true);
        result = await extractJSON(raw);
    } catch (e) {
        console.error("Version generation failed", e);
        result.changelog = "Generation failed, fallback.";
    }

    const newVer: AgentVersion = {
        version: result.version,
        prompt: result.new_prompt,
        model: modelName,
        changelog: result.changelog,
        timestamp: Date.now()
    };

    // Check duplication
    if (!VERSIONS.find(v => v.version === newVer.version)) {
        VERSIONS.push(newVer);
    } else {
        // Fallback if LLM picked same version number
        newVer.version = `${newVer.version}-${Date.now().toString().slice(-4)}`;
        VERSIONS.push(newVer);
    }

    return newVer;
}

export async function runAgentVersion(version: string, userInput: string): Promise<string> {
    const v = VERSIONS.find(x => x.version === version);
    if (!v) return "Error: Version not found";

    // Real Execution using the Stored Prompt
    try {
        const response = await queryLLM(v.prompt, userInput, v.model || 'auto');
        return response;
    } catch (e) {
        return "Error executing version.";
    }
}
