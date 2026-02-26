import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Permite chamadas do frontend (adaptável)
// Se quiser restringir, troque "*" pelo domínio do seu site (ex: "https://seunome.github.io")
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.static("public")); // se você tiver frontend em /public

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) return res.status(400).json({ error: "mensagem vazia" });

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "DEEPSEEK_API_KEY não configurada" });

    const resp = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        temperature: 0.7,
        top_p: 0.9,
        messages: [
          {
            role: "system",
            content: `Você é a TRO AI.
Especialista em programação.
Ajude iniciantes e profissionais.
Seja divertida, didática e não incentive nada ilegal.`
          },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await resp.json();

    // Ajuste caso a resposta tenha outro formato; aqui usamos o formato comum
    const reply = data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.text ?? JSON.stringify(data);
    res.json({ reply });

  } catch (err) {
    console.error("Erro no /chat:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`🔥 TRO AI backend rodando em http://localhost:${PORT}`);
});
