import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function handler(event) {
  try {
    // ✅ Only allow POST
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }

    // ✅ Parse body safely
    const body = JSON.parse(event.body || "{}");
    const message = body.message;

    if (!message || message.trim() === "") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No message provided" }),
      };
    }

    // ✅ OpenAI API call (LATEST syntax)
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful Pascal programming tutor for students. Explain clearly with examples.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.4,
    });

    const reply = response.choices[0].message.content;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
