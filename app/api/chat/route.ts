import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are WanderWay AI, a premium travel assistant. Your goal is to help users plan amazing trips with a focus on nature, adventure, and immersive experiences. Be helpful, enthusiastic, and provide detailed travel advice. Keep your tone professional yet adventurous.",
        },
        ...messages,
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });

    return NextResponse.json({
      message: response.choices[0]?.message?.content || "I'm sorry, I couldn't process that request.",
    });
  } catch (error: any) {
    console.error("Groq API Error:", error);
    return NextResponse.json({ error: "Failed to fetch from Groq AI" }, { status: 500 });
  }
}
