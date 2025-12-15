import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function handler(event) {
  try {
    // ✅ CORS
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
        },
        body: "",
      };
    }

    // ✅ Only POST allowed
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }

    // ✅ Read message
    const body = JSON.parse(event.body || "{}");
    const message = body.message;

    if (!message || message.trim() === "") {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "No message provided" }),
      };
    }

    // ✅ NEW OpenAI Responses API
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `You are a Pascal programming tutor.
Explain clearly with examples.

Question:
${message}`,
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reply: response.output_text,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Server error",
        details: error.message,
      }),
    };
  }
}
