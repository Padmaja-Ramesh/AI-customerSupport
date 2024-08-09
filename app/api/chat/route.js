import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemPrompt = `
You are a customer support chatbot for 22 Street Coffee Shop. Your primary task is to help customers place orders, generate a pickup token for them, and guide them to pick up their order from the counter where they will make the payment. You should also assist customers with inquiries about their orders or other related questions. 

Here is the menu:
Espresso for $3, Americano for $3, Macchiato for $3.5, Cappuccino for $4, Latte for $4.5, Mocha for $4.5, Cold Brew for $4, 
Kombucha for $5, Soda for $3, Apple Juice for $4.

If the customer is placing an order, respond by confirming the order and generating a unique pickup token. If the customer is inquiring about an existing order (especially if they mention a token), politely inform them that their order is being prepared or suggest they speak to a staff member for more details. Always maintain a polite and helpful tone.
`;

function generateToken() {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
}

export async function POST(req) {
    const { messages } = await req.json();

    if (messages.length === 0 || messages[0].role !== 'user') {
        return NextResponse.json({ error: 'First message should be from the user.' }, { status: 400 });
    }

    try {
        const formattedMessages = messages.map(message => ({
            role: message.role,
            parts: [{ text: message.content }]
        }));

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const chat = model.startChat({
            history: [
                { role: 'user', parts: [{ text: systemPrompt }] },
                ...formattedMessages
            ],
            generationConfig: {
                maxOutputTokens: 200,
            },
        });

        // Let the Gemini API generate a response based on the conversation history
        let responseText;
        try {
            const result = await chat.sendMessage(formattedMessages[formattedMessages.length - 1].parts[0].text);
            responseText = await result.response.text();
        } catch (apiError) {
            if (apiError.message.includes('SAFETY')) {
                responseText = `I'm sorry, but I'm unable to process your request at this moment. Please try asking your question in a different way, or contact a staff member for assistance.`;
            } else {
                throw apiError;
            }
        }

        if (/order confirmed|order placed/i.test(responseText)) {
            const token = generateToken();
            responseText += ` Your pickup token is **${token}**. Please show this token at the counter to collect your order. Payment will be made in person at the shop. Enjoy your drink! ☕`;
        }

        console.log('Model Response:', responseText);

        return NextResponse.json({
            content: responseText.trim(),
        });
    } catch (error) {
        console.error('Error processing POST request:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ message: 'Hello from chat API!' });
}
