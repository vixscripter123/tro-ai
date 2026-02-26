import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        temperature: 0.7,
        top_p: 0.9,
        messages: [
          {
            role: "system",
            content: `
Você é a TRO AI.

Especialista em programação.
Ajuda iniciantes e profissionais.
Explique simples quando necessário.
Seja divertida e leve.
Nunca incentive coisas ilegais.
`
          },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });

  } catch (error) {
    res.status(500).json({ error: "Erro na TRO AI" });
  }
});

app.listen(3000, () => {
  console.log("🔥 TRO AI rodando em http://localhost:3000");
});
