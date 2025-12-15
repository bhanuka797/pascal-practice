import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  try {
    const { message } = JSON.parse(event.body || "{}");

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Message is required" })
      };
    }

    const response = await client.responses.create({
      model: "gpt-5-mini",   // 💰 CHEAP MODEL
      input: message,
      max_output_tokens: 250 // 🔒 COST CONTROL
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: response.output_text
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "AI limit reached or server error"
      })
    };
  }
}
