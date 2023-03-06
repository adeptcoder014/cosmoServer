const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
require("./database")
//====================================================

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
//====================================================
const app = express();
app.use(cors());
app.use(express.json());
//====================================================
app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from Cosmos!",
  });
});
//===========================================
let conversationHistory = "";
app.post("/", async (req, res) => {
  // Define a variable to store the conversation history

  try {
    // Get the user input from the request body
    const userInput = req.body.prompt;

    // Append the user input to the conversation history
    conversationHistory += userInput + "\n";

    // Call the OpenAI API with the conversation history as the prompt
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: conversationHistory,
      temperature: 1,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    // Extract the bot's response from the API response
    const botResponse = response.data.choices[0].text;

    // Append the bot's response to the conversation history
    conversationHistory += botResponse + "\n";

    // Send the bot's response back to the client
    res.status(200).send({
      bot: botResponse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error || "Something went wrong");
  }
});
//====================================================
app.post("/generate-image", async (req, res) => {
  try {
    const response = await openai.createImage({
      prompt: req.body.prompt,
      n: 2,
      size: "512x512",
    });
    console.log(
      " response==============================>",
      response.data.data[0].url
    );
    res.status(201).send(response.data.data[0].url);
  } catch (error) {
    res.status(500).send(error);
  }
});

//======================================
app.listen(process.env.PORT, () =>
  console.log(`AI server started on ${process.env.PORT}`)
);
//====================================================
