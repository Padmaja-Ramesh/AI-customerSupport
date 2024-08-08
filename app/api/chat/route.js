import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Ensure this is correctly set

const systemPrompt = `
You are a customer support chatbot for a bustling coffee shop...
`;

// This function converts the message format to meet the API requirements
const formatMessages = (messages) => {
    return messages.map(message => ({
        role: message.role,
        parts: [{ text: message.content }]
    }));
};

export async function POST(req) {
    const { messages } = await req.json();

    // Ensure messages start with a user message
    if (messages.length === 0 || messages[0].role !== 'user') {
        return NextResponse.json({ error: 'First message should be from the user.' }, { status: 400 });
    }

    try {
        const formattedMessages = formatMessages(messages);

        // Create the model instance
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Start the chat with user messages only
        const chat = model.startChat({
            history: [
                ...formattedMessages
            ],
            generationConfig: {
                maxOutputTokens: 100,
            },
        });

        // Send the user message and get the response
        const result = await chat.sendMessage(formattedMessages[formattedMessages.length - 1].parts[0].text);
        const response = await result.response;
        const text = await response.text();

        return NextResponse.json({ content: text.trim() });
    } catch (error) {
        console.error('Error processing POST request:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ message: 'Hello from chat API!' });
}
