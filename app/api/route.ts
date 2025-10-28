import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use your server-side API key
});

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { message, websiteData } = await request.json();

    // Prepare the system message with optional website data
    const systemMessage = websiteData
      ? `You are an AI assistant for a website. Here is the current website data: ${JSON.stringify(
          websiteData
        )}. Answer questions based on this data.`
      : `You are an AI assistant. Answer questions based on your general knowledge.`;

    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: message },
      ],
    });

    // Extract the bot's response
    const botMessage = response.choices[0]?.message?.content;

    // Return the bot's response
    return NextResponse.json({ botMessage });
  } catch (error) {
    console.error("Error with OpenAI API:", error);

    // Return an error response
    return NextResponse.json(
      { error: "Failed to fetch response from OpenAI" },
      { status: 500 }
    );
  }
}