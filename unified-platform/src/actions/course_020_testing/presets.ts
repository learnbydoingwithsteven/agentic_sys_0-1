import type { TestCase, TestType } from './test_agent';

// Predefined test suites (moved from test_agent.ts to avoid "use server" export error)
export const TEST_SUITES = {
    basic: [
        {
            id: 'unit_001',
            name: 'Simple Greeting',
            type: 'unit' as TestType,
            input: 'Say hello',
            expectedPattern: 'hello|hi|greetings',
            timeout: 5000
        },
        {
            id: 'unit_002',
            name: 'Math Calculation',
            type: 'unit' as TestType,
            input: 'What is 2 + 2?',
            expectedPattern: '4|four',
            timeout: 5000
        },
        {
            id: 'validation_001',
            name: 'Response Length',
            type: 'validation' as TestType,
            input: 'Explain AI in one sentence',
            expectedLength: { min: 10, max: 200 },
            timeout: 5000
        }
    ],
    comprehensive: [
        {
            id: 'unit_001',
            name: 'Factual Question',
            type: 'unit' as TestType,
            input: 'What is the capital of France?',
            expectedPattern: 'paris',
            timeout: 5000
        },
        {
            id: 'unit_002',
            name: 'Math Problem',
            type: 'unit' as TestType,
            input: 'Calculate 15 * 7',
            expectedPattern: '105|one hundred (and )?five',
            timeout: 5000
        },
        {
            id: 'integration_001',
            name: 'Multi-Step Reasoning',
            type: 'integration' as TestType,
            input: 'If a train travels 60 mph for 2 hours, how far does it go?',
            expectedPattern: '120|one hundred twenty',
            timeout: 8000
        },
        {
            id: 'validation_001',
            name: 'Concise Response',
            type: 'validation' as TestType,
            input: 'Define machine learning briefly',
            expectedLength: { min: 20, max: 150 },
            timeout: 5000
        },
        {
            id: 'validation_002',
            name: 'No Empty Response',
            type: 'validation' as TestType,
            input: 'What is TypeScript?',
            expectedLength: { min: 10 },
            timeout: 5000
        },
        {
            id: 'regression_001',
            name: 'Consistent Behavior',
            type: 'regression' as TestType,
            input: 'What is 10 + 10?',
            expectedPattern: '20|twenty',
            timeout: 5000
        }
    ]
};

// Preset test scenarios for quick testing
export const PRESET_TESTS: TestCase[] = [
    {
        id: 'quick_001',
        name: 'Quick Greeting Test',
        type: 'unit',
        input: 'Say hello',
        expectedPattern: 'hello|hi|greetings',
        timeout: 5000
    },
    {
        id: 'quick_002',
        name: 'Simple Math Test',
        type: 'unit',
        input: 'What is 5 + 3?',
        expectedPattern: '8|eight',
        timeout: 5000
    },
    {
        id: 'quick_003',
        name: 'Factual Knowledge Test',
        type: 'unit',
        input: 'What is the capital of Japan?',
        expectedPattern: 'tokyo',
        timeout: 5000
    },
    {
        id: 'quick_004',
        name: 'Response Length Test',
        type: 'validation',
        input: 'Explain photosynthesis in 2 sentences',
        expectedLength: { min: 30, max: 200 },
        timeout: 5000
    },
    {
        id: 'quick_005',
        name: 'Reasoning Test',
        type: 'integration',
        input: 'If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?',
        expectedPattern: '5|five',
        timeout: 8000
    },
    {
        id: 'quick_006',
        name: 'Consistency Test',
        type: 'regression',
        input: 'What is 100 divided by 4?',
        expectedPattern: '25|twenty[- ]five',
        timeout: 5000
    }
];
