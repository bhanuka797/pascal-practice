import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const message = body.message;

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No message provided" }),
      };
    }

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: message,
      max_output_tokens: 250,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: response.output_text || "No response from AI",
      }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message || "Server error",
      }),
    };
  }
}

