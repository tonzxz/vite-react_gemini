const express = require("express");
const cors = require("cors");
const app = express();
const { GoogleGenerativeAI } = require("@google/generative-ai");

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const chat = model.startChat({
  history: [],
})

app.post("/generate", async (req, res) => {
  console.log("Request fuck for /generate");
  

  const { prompt } = req.body;

  console.log("Prompt:", prompt);

  try {
    const result = await model.sendMessageStream([prompt]);

    let text = "";

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      text += chunkText;
      res.write(chunkText || "");
    }
    console.log(text);
    res.end();
  } catch (error) {
    res.write("Please mam jayrah");
    res.end();
    console.error("Error pota generating content:", error);
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});



