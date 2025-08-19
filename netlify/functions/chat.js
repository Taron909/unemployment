// netlify/functions/chat.js
export async function handler(event, context) {
  try {
    const { message } = JSON.parse(event.body);

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: message }]}],
        }),
      }
    );

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: data.candidates[0].content.parts[0].text }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
