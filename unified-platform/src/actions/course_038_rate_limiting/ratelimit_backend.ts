'use server';

// --- Interfaces ---

export interface RateLimitStatus {
    allowed: boolean;
    remaining: number;
    resetTime: number; // TS when next token added
    totalCapacity: number;
    message?: string;
}

export interface Bucket {
    tokens: number;
    lastRefill: number;
}

// --- Configuration ---

const CAPACITY = 5;         // Max tokens
const REFILL_RATE_MS = 2000; // 1 token every 2s

// --- In-Memory Store (Singleton) ---
const buckets = new Map<string, Bucket>();

// --- Helper: Refill Logic ---

function getBucket(userId: string): Bucket {
    const now = Date.now();
    let bucket = buckets.get(userId);

    if (!bucket) {
        bucket = { tokens: CAPACITY, lastRefill: now };
        buckets.set(userId, bucket);
    } else {
        // Calculate refill
        const timePassed = now - bucket.lastRefill;
        const tokensToAdd = Math.floor(timePassed / REFILL_RATE_MS);

        if (tokensToAdd > 0) {
            bucket.tokens = Math.min(CAPACITY, bucket.tokens + tokensToAdd);
            bucket.lastRefill = now; // roughly, or now - remainder
        }
    }
    return bucket;
}

export async function checkRateLimit(userId: string): Promise<RateLimitStatus> {
    const bucket = getBucket(userId);

    // Check if we can consume
    if (bucket.tokens >= 1) {
        bucket.tokens -= 1;
        return {
            allowed: true,
            remaining: bucket.tokens,
            resetTime: Date.now() + REFILL_RATE_MS,
            totalCapacity: CAPACITY
        };
    } else {
        return {
            allowed: false,
            remaining: 0,
            resetTime: bucket.lastRefill + REFILL_RATE_MS, // Approx next token time
            totalCapacity: CAPACITY,
            message: "Rate limit exceeded. Please wait."
        };
    }
}

// --- Main Action (Simulated LLM Call) ---

export async function processLimitedRequest(userId: string, input: string) {
    const limit = await checkRateLimit(userId);

    if (!limit.allowed) {
        return {
            success: false,
            response: limit.message,
            meta: limit
        };
    }

    // Simulate work
    await new Promise(r => setTimeout(r, 500));

    return {
        success: true,
        response: `Processed: "${input}". (Tokens left: ${limit.remaining})`,
        meta: limit
    };
}

export async function getStatus(userId: string): Promise<Bucket & { capacity: number, rateMs: number }> {
    const bucket = getBucket(userId);
    return { ...bucket, capacity: CAPACITY, rateMs: REFILL_RATE_MS };
}
