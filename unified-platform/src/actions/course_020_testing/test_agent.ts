'use server'

import { ChatOllama } from "@langchain/ollama";
import { TEST_SUITES } from "./presets";

export type TestType = 'unit' | 'integration' | 'validation' | 'regression';
export type TestStatus = 'passed' | 'failed' | 'skipped';

export interface TestCase {
    id: string;
    name: string;
    type: TestType;
    input: string;
    expectedOutput?: string;
    expectedPattern?: string; // Changed from RegExp to string for Next.js serialization
    expectedLength?: { min?: number; max?: number };
    timeout?: number;
}

export interface TestResult {
    testCase: TestCase;
    status: TestStatus;
    actualOutput: string;
    executionTime: number;
    error?: string;
    passed: boolean;
}

export interface TestSuiteResult {
    success: boolean;
    totalTests: number;
    passed: number;
    failed: number;
    skipped: number;
    executionTime: number;
    results: TestResult[];
    coverage: {
        unitTests: number;
        integrationTests: number;
        validationTests: number;
        regressionTests: number;
    };
}

// Test execution agent
export async function runTestSuite(
    suiteType: 'basic' | 'comprehensive',
    model: string = "llama3.2"
): Promise<TestSuiteResult> {

    const startTime = Date.now();
    const testCases = TEST_SUITES[suiteType];
    const results: TestResult[] = [];

    let passed = 0;
    let failed = 0;
    let skipped = 0;

    // Execute each test case
    for (const testCase of testCases) {
        const testStartTime = Date.now();

        try {
            // Execute agent with tools (not just LLM)
            const timeoutPromise = new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('Test timeout')), testCase.timeout || 5000)
            );

            // Import agent dynamically to avoid circular dependencies
            const { runAgentWithTools } = await import('./agent_with_tools');
            const executionPromise = runAgentWithTools(testCase.input, model);

            const agentResponse = await Promise.race([executionPromise, timeoutPromise]);
            const actualOutput = agentResponse.answer;

            const executionTime = Date.now() - testStartTime;

            // Validate output
            let testPassed = true;
            let error: string | undefined;

            // Check pattern match
            if (testCase.expectedPattern) {
                const pattern = new RegExp(testCase.expectedPattern, 'i');
                if (!pattern.test(actualOutput)) {
                    testPassed = false;
                    error = `Output does not match expected pattern: ${testCase.expectedPattern}`;
                }
            }

            // Check length constraints
            if (testCase.expectedLength) {
                const length = actualOutput.length;
                if (testCase.expectedLength.min && length < testCase.expectedLength.min) {
                    testPassed = false;
                    error = `Output too short: ${length} < ${testCase.expectedLength.min}`;
                }
                if (testCase.expectedLength.max && length > testCase.expectedLength.max) {
                    testPassed = false;
                    error = `Output too long: ${length} > ${testCase.expectedLength.max}`;
                }
            }

            if (testPassed) {
                passed++;
            } else {
                failed++;
            }

            results.push({
                testCase,
                status: testPassed ? 'passed' : 'failed',
                actualOutput,
                executionTime,
                error,
                passed: testPassed
            });

        } catch (error) {
            failed++;
            results.push({
                testCase,
                status: 'failed',
                actualOutput: '',
                executionTime: Date.now() - testStartTime,
                error: String(error),
                passed: false
            });
        }
    }

    const totalExecutionTime = Date.now() - startTime;

    // Calculate coverage
    const coverage = {
        unitTests: results.filter(r => r.testCase.type === 'unit').length,
        integrationTests: results.filter(r => r.testCase.type === 'integration').length,
        validationTests: results.filter(r => r.testCase.type === 'validation').length,
        regressionTests: results.filter(r => r.testCase.type === 'regression').length,
    };

    return {
        success: failed === 0,
        totalTests: testCases.length,
        passed,
        failed,
        skipped,
        executionTime: totalExecutionTime,
        results,
        coverage
    };
}

// Run a single test case
export async function runSingleTest(
    testCase: TestCase,
    model: string = "llama3.2"
): Promise<TestResult> {

    const startTime = Date.now();

    try {
        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Test timeout')), testCase.timeout || 5000)
        );

        // Use agent with tools instead of raw LLM
        const { runAgentWithTools } = await import('./agent_with_tools');
        const executionPromise = runAgentWithTools(testCase.input, model);

        const agentResponse = await Promise.race([executionPromise, timeoutPromise]);
        const actualOutput = agentResponse.answer;

        const executionTime = Date.now() - startTime;

        let testPassed = true;
        let error: string | undefined;

        if (testCase.expectedPattern) {
            const pattern = new RegExp(testCase.expectedPattern, 'i');
            if (!pattern.test(actualOutput)) {
                testPassed = false;
                error = `Output does not match expected pattern`;
            }
        }

        if (testCase.expectedLength) {
            const length = actualOutput.length;
            if (testCase.expectedLength.min && length < testCase.expectedLength.min) {
                testPassed = false;
                error = `Output too short: ${length} < ${testCase.expectedLength.min}`;
            }
            if (testCase.expectedLength.max && length > testCase.expectedLength.max) {
                testPassed = false;
                error = `Output too long: ${length} > ${testCase.expectedLength.max}`;
            }
        }

        return {
            testCase,
            status: testPassed ? 'passed' : 'failed',
            actualOutput,
            executionTime,
            error,
            passed: testPassed
        };

    } catch (error) {
        return {
            testCase,
            status: 'failed',
            actualOutput: '',
            executionTime: Date.now() - startTime,
            error: String(error),
            passed: false
        };
    }
}
