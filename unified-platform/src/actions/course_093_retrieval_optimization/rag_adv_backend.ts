'use server';

import { queryLLM, extractJSON } from '@/lib/llm_helper';

export interface SearchResult {
    id: string;
    content: string;
    relevance: number;
}

const DOCUMENTS = [
    { id: '1', content: "Apples are red and grow on trees." },
    { id: '2', content: "The Red Sox are a baseball team." },
    { id: '3', content: "Big Red gum tastes like cinnamon." },
    { id: '4', content: "Mars is known as the Red Planet." },
    { id: '5', content: "Roses are red, violets are blue." },
];

export async function advancedSearch(query: string, modelName: string = 'auto'): Promise<{ initial: SearchResult[], reranked: SearchResult[], hyde: string }> {
    // 1. HyDE (Hypothetical Document Embeddings): Generate ideal answer first
    const hydePrompt = `User Query: "${query}"
    
    Task: Generate a hypothetical perfect answer to this query (1-2 sentences).
    This will be used for semantic search.
    Return JSON: { "hypothetical_answer": "string" }`;

    let hyde = "Mars is the red planet in our solar system.";
    try {
        const raw = await queryLLM(hydePrompt, "Generate HyDE.", modelName, true);
        const res = await extractJSON(raw);
        hyde = res.hypothetical_answer;
    } catch { }

    // 2. Initial Retrieval (Keyword-based simulation - all docs)
    const initial = DOCUMENTS.map(d => ({ ...d, relevance: 0.5 }));

    // 3. Reranking using LLM-as-Judge
    // For each document, ask LLM to score relevance to the query
    const reranked: SearchResult[] = [];

    for (const doc of DOCUMENTS) {
        const rerankPrompt = `Query: "${query}"
        HyDE Context: "${hyde}"
        Document: "${doc.content}"
        
        Rate relevance (0.0 to 1.0) of this document to the query.
        Return JSON: { "score": number }`;

        let score = 0.1;
        try {
            const raw = await queryLLM(rerankPrompt, "Rerank.", modelName, true);
            const res = await extractJSON(raw);
            score = res.score;
        } catch { }

        reranked.push({ ...doc, relevance: score });
    }

    // Sort by relevance descending
    reranked.sort((a, b) => b.relevance - a.relevance);

    return { initial, reranked, hyde };
}
