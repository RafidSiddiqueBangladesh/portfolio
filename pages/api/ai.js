export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { message } = req.body;

  if (!message) return res.status(400).json({ reply: "No message provided." });

  try {
    const apiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${process.env.GEMAI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }],
          systemInstruction: {
            parts: [{ text: "You are a helpful AI assistant." }],
          },
        }),
      }
    );

    const data = await apiRes.json();

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";

    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Error: Could not connect to AI API." });
  }
}
