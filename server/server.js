const express = require("express");
const cors = require("cors");
const app = express();
const { GoogleGenerativeAI } = require("@google/generative-ai");

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI('AIzaSyCBj-CPcBjANEmV5xA-IvLuN-SPnGd8_10');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const chat = model.startChat({
  history: [],
})

app.post("/generate", async (req, res) => {
  console.log("Request for /generate");

  const { prompt } = req.body;

  if (prompt) { // Check if there is a prompt
    console.log("Prompt:", prompt);

    try {
      const result = await model.generateContentStream([prompt]);

      let text = "";

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        text += chunkText;
        res.write(chunkText || "");
      }
      if (text) { // Check if text contains something before logging
        console.log(text);
      }
      res.end();
    } catch (error) {
      res.write("");
      res.end();
      console.error("Error generating content:", error);
    }
  } else {
    res.status(400).send("No prompt provided");
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});



