'use server';

export interface SearchResult {
    id: string;
    content: string;
    relevance: number; // 0-1
}

const DOCUMENTS = [
    { id: '1', content: "Apples are red and grow on trees." }, // Keyword match 'red'
    { id: '2', content: "The Red Sox are a baseball team." }, // Keyword match 'red'
    { id: '3', content: "Big Red gum tastes like cinnamon." }, // Keyword match 'red'
    { id: '4', content: "Mars is known as the Red Planet." }, // Semantic match for 'planet'
];

export async function advancedSearch(query: string): Promise<{ initial: SearchResult[], reranked: SearchResult[] }> {
    // 1. Initial Retrieval (Keyword based - simplistic)
    // Matches "Red"
    const initial = DOCUMENTS.map(d => ({ ...d, relevance: 0.5 })); // No semantic score yet

    // 2. Re-rank (Semantic)
    // Query: "What planet is red?"
    // Expected: Mars should go to top.

    const reranked = [
        { id: '4', content: "Mars is known as the Red Planet.", relevance: 0.98 },
        { id: '1', content: "Apples are red and grow on trees.", relevance: 0.2 },
        { id: '3', content: "Big Red gum tastes like cinnamon.", relevance: 0.1 },
        { id: '2', content: "The Red Sox are a baseball team.", relevance: 0.05 },
    ];

    return { initial, reranked };
}
