'use server';

export async function analyzeImage(imageId: string): Promise<string> {
    await new Promise(r => setTimeout(r, 1500)); // Simulate processing

    // Mock Vision API responses
    switch (imageId) {
        case 'cat':
            return "I see a fluffy ginger cat sitting on a windowsill. Ideally, it looks like a sunny afternoon.";
        case 'chart':
            return "This is a bar chart showing Q3 revenue growth. The trend is upward, with a 20% increase in September.";
        case 'code':
            return "A screenshot of a VS Code editor. The code appears to be a React component using the `useState` hook.";
        default:
            return "Unable to process image.";
    }
}
