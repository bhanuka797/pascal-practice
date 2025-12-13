export default async (request) => {
  try {
    const body = await request.json();
    const userInput = body.message;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: "You are a Pascal programming tutor for Sri Lankan GCE O/L ICT students. Explain simply using Sinhala + English mix. Focus on exam logic and common mistakes."
          },
          {
            role: "user",
            content: userInput
          }
        ]
      })
    });

    const data = await response.json();
    return new Response(
      JSON.stringify({ reply: data.choices[0].message.content }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "AI error" }),
      { status: 500 }
    );
  }
};
