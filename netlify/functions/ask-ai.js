const OpenAI = require("openai");

exports.handler = async function (event) {
  try {
    // Allow only POST
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const message = body.message;

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No message provided" }),
      };
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a Pascal programming tutor." },
        { role: "user", content: message },
      ],
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reply: completion.choices[0].message.content,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Server error",
        details: err.message,
      }),
    };
  }
};
