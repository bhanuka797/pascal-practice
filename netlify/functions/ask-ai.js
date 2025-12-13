import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function handler(event) {
  try {
    const { message } = JSON.parse(event.body || "{}");

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ reply: "No input received." }),
      };
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "You are an ICT teacher. Explain Pascal programs simply for school students.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: response.output_text,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "AI server error." }),
    };
  }
}
