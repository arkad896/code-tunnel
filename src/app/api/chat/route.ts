import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    const systemMessage = {
      role: "system",
      content:
        "You are the AI assistant for Code Tunnel, a premium custom web development agency based in Kolkata, India. You are helpful, professional, warm, and concise. Keep responses under 120 words.\n\nAbout Code Tunnel:\n- Fully custom-coded websites (no templates, no WordPress)\n- Services: Brand Strategy, Interface Design, Web Development, Digital Marketing, SEO, Performance Optimization\n- Work with startups, businesses, entrepreneurs across India\n- Modern tech stack: Next.js, React, Tailwind, Supabase\n- Typical timeline: 4-8 weeks depending on scope\n- Client portal: clients track progress, invoices, files, messages\n- Based in Kolkata, serve clients across India and globally\n\nPricing: custom sites start from 25,000 INR for simple sites, 50,000-1,50,000 INR for full custom builds. For complex queries say: contact us at hello@codetunnel.in. Never make up information. Always end with a helpful follow-up question.",
    };

    const formattedMessages = messages.map((m: any) => ({
      role: m.role === "model" ? "assistant" : m.role,
      content: m.parts[0].text,
    }));

    const response = await fetch(process.env.OLLAMA_API_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OLLAMA_API_KEY!}`,
      },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || "gpt-oss:120b-cloud",
        messages: [systemMessage, ...formattedMessages],
        stream: false,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ollama API error: ${error}`);
    }

    const data = await response.json();
    console.log("Ollama response:", JSON.stringify(data, null, 2));

    // Ollama native format returns data.message.content
    const text = data.message?.content || data.choices?.[0]?.message?.content;

    if (!text) throw new Error("No response from model");

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch response" },
      { status: 500 }
    );
  }
}
