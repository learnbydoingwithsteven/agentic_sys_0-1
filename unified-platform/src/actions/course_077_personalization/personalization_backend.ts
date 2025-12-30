'use server';

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
    { id: 'alice', name: 'Alice (The Scientist)', traits: { tone: 'Formal', expertise: 'High', interests: ['Physics', 'Math'] } },
    { id: 'bob', name: 'Bob (The 5 Year Old)', traits: { tone: 'Playful', expertise: 'None', interests: ['Dinosaurs', 'Space'] } }
];

export async function getProfiles(): Promise<UserProfile[]> {
    return USERS;
}

export async function generatePersonalizedResponse(userId: string, topic: string): Promise<string> {
    const user = USERS.find(u => u.id === userId);
    if (!user) return "User not found";

    if (userId === 'alice') {
        return `Regarding ${topic}: One must consider the wave function collapse and the probabilistic nature of subatomic particles. The mathematical formalism implies...`;
    } else {
        return `Wow! ${topic} is like magic! 🦖 Imagine tiny balls bouncing everywhere, but they are also ghosts! So cool!`;
    }
}
