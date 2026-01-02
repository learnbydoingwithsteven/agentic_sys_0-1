'use server';

import { queryLLM } from '@/lib/llm_helper';

export interface UserProfile {
    id: string;
    name: string;
    traits: {
        tone: string;
        expertise: string;
        interests: string[];
    };
}

const USERS: UserProfile[] = [
    { id: 'alice', name: 'Alice (The Scientist)', traits: { tone: 'Formal & Academic', expertise: 'PhD Level', interests: ['Physics', 'Math', 'Empirical Data'] } },
    { id: 'bob', name: 'Bob (The 5 Year Old)', traits: { tone: 'Playful & Simple', expertise: 'Kindergarten', interests: ['Dinosaurs', 'Space', 'Candy'] } }
];

export async function getProfiles(): Promise<UserProfile[]> {
    return USERS;
}

export async function generatePersonalizedResponse(userId: string, topic: string, modelName: string = 'auto'): Promise<string> {
    const user = USERS.find(u => u.id === userId);
    if (!user) return "User not found";

    const systemPrompt = `You are a Personalized AI Assistant.
    Adapt your response to match the User Profile.
    
    User Profile:
    - Tone: ${user.traits.tone}
    - Expertise Level: ${user.traits.expertise}
    - Key Interests: ${user.traits.interests.join(', ')}
    
    Instruction: Explain the topic "${topic}" to this user. Use metaphors they would understand based on their interests. Maintain the requested tone.`;

    try {
        const response = await queryLLM(systemPrompt, `Topic: ${topic}`, modelName);
        return response;
    } catch (e) {
        return "Error generating personalized response.";
    }
}
