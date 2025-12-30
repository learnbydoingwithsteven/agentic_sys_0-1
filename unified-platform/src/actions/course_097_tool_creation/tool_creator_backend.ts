'use server';

export async function generateToolCode(task: string): Promise<string> {
    // Mock Agent generation based on task description
    if (task.includes('area') && task.includes('circle')) {
        return `function calculateCircleArea(radius) {\n  return Math.PI * radius * radius;\n}`;
    }
    if (task.includes('fibonacci')) {
        return `function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}`;
    }
    return `function unknownTask() {\n  return "I do not know how to do that yet.";\n}`;
}

export async function runGeneratedTool(code: string, input: number): Promise<string | number> {
    // Dangerous in prod, but fine for mock/demo with restricted inputs
    // We will simulate execution rather than eval() for safety in this mock backend

    if (code.includes('Math.PI')) {
        return Math.PI * input * input;
    }
    if (code.includes('fibonacci')) {
        // approximate fib for demo
        const fib = (n: number): number => n <= 1 ? n : fib(n - 1) + fib(n - 2);
        return fib(Math.min(input, 10)); // cap recursion
    }

    return "No execution logic found for this mock.";
}
