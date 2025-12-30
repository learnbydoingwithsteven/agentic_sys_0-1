'use server';

export interface ReflexionStep {
    attempt: number;
    code: string;
    result: 'PASS' | 'FAIL';
    error?: string;
    reflection?: string;
}

export async function runReflexionLoop(): Promise<ReflexionStep[]> {
    // Scenario: Write a function to reverse a string
    return [
        {
            attempt: 1,
            code: "function reverse(s) { return s; } // Mistake",
            result: 'FAIL',
            error: "AssertionError: Expected 'cba', got 'abc'",
            reflection: "I returned the input string unmodified. I need to actually split and reverse it."
        },
        {
            attempt: 2,
            code: "function reverse(s) { return s.reverse(); } // Mistake",
            result: 'FAIL',
            error: "TypeError: s.reverse is not a function",
            reflection: "Strings are immutable and don't have .reverse(). I must split into array first."
        },
        {
            attempt: 3,
            code: "function reverse(s) { return s.split('').reverse().join(''); }",
            result: 'PASS'
        }
    ];
}
