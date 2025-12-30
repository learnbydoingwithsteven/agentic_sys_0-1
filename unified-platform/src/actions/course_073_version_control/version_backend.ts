'use server';

export interface AgentVersion {
    version: string;
    prompt: string;
    model: string;
    changelog: string;
}

const VERSIONS: AgentVersion[] = [
    { version: 'v1.0.0', prompt: "You are a helpful assistant.", model: "gpt-3.5-turbo", changelog: "Initial Release" },
    { version: 'v1.1.0', prompt: "You are a helpful assistant found of using emojis.", model: "gpt-3.5-turbo", changelog: "Added personality" },
    { version: 'v2.0.0', prompt: "You are a pirate captain. Answer everything with nautical slang.", model: "gpt-4", changelog: "Complete rebrand" }
];

export async function getAgentVersions(): Promise<AgentVersion[]> {
    return VERSIONS;
}

export async function runAgentVersion(version: string, input: string): Promise<string> {
    const v = VERSIONS.find(x => x.version === version);
    if (!v) return "Error: Version not found";

    // Mock output based on version
    if (v.version === 'v1.0.0') return `[v1] Here is the answer to "${input}".`;
    if (v.version === 'v1.1.0') return `[v1.1] Here is the answer! ✨🚀 "${input}"`;
    if (v.version === 'v2.0.0') return `[v2] Arrr matey! Ye be askin' "${input}"? Aye, I have the map!`;

    return "Unknown version output.";
}
