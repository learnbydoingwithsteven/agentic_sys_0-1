'use server';

export type ChunkingStrategy = 'fixed' | 'recursive' | 'token';

interface ChunkingParams {
    strategy: ChunkingStrategy;
    chunkSize: number;
    chunkOverlap: number;
}

export async function chunkText(text: string, params: ChunkingParams): Promise<string[]> {
    switch (params.strategy) {
        case 'fixed':
            return fixedSizeSplit(text, params.chunkSize, params.chunkOverlap);
        case 'recursive':
            return recursiveSplit(text, params.chunkSize, params.chunkOverlap);
        case 'token':
            return tokenSplit(text, params.chunkSize, params.chunkOverlap);
        default:
            return recursiveSplit(text, params.chunkSize, params.chunkOverlap);
    }
}

function fixedSizeSplit(text: string, size: number, overlap: number): string[] {
    const chunks: string[] = [];
    let start = 0;
    while (start < text.length) {
        const end = Math.min(start + size, text.length);
        chunks.push(text.slice(start, end));
        start += size - overlap;
        if (start >= end) start = end; // Prevent infinite loops if overlap >= size
    }
    return chunks;
}

function recursiveSplit(text: string, size: number, overlap: number): string[] {
    const separators = ["\n\n", "\n", " ", ""];
    const chunks: string[] = [];
    let start = 0;

    // Simplified recursive logic for demo/visualization
    // In a real robust implementation, this would recurse on separators.
    // Here we implement an iterative approach that tries to snap to separators.

    while (start < text.length) {
        let end = Math.min(start + size, text.length);

        if (end < text.length) {
            // BACKTRACK to find a separator
            let foundSep = false;
            for (const sep of separators) {
                const lastIdx = text.lastIndexOf(sep, end);
                // We must ensure we made progress (lastIdx > start)
                if (lastIdx !== -1 && lastIdx > start) {
                    end = lastIdx + sep.length; // Include the separator? Usually splitters drop or keep it. We'll keep it simple.
                    foundSep = true;
                    break;
                }
            }
            // If no separator found in the chunk range, we force split at size (handled by loop condition)
        }

        chunks.push(text.slice(start, end));

        // Move start, considering overlap
        // For recursive, overlap typically means we go back 'overlap' characters from the end
        // BUT we must align to separators again for better results. 
        // For this simple demo, we just subtract overlap.
        start = end - overlap;

        // Safety checks
        if (start >= end) start = end;
    }

    return chunks;
}

function tokenSplit(text: string, tokens: number, overlapTokens: number): string[] {
    // Approximation: 1 token ~= 4 characters
    const charSize = tokens * 4;
    const charOverlap = overlapTokens * 4;
    return fixedSizeSplit(text, charSize, charOverlap);
}
