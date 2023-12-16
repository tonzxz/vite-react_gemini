const express = require("express");
const cors = require("cors");
const app = express();
const { GoogleGenerativeAI } = require("@google/generative-ai");

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.post("/generate", async (req, res) => {
  console.log("Request received for /generate");
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const { prompt } = req.body;

  console.log("Prompt:", prompt);

  try {
    const result = await model.generateContentStream([prompt]);

    let text = "";

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      text += chunkText;
    }

    res.json({ generatedText: text });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});



