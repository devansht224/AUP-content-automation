const { OpenAI } = require("openai");
const fs = require("fs");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateChatCompletion(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 3600,
      n: 2,
    });

    console.log("API Response:", response);

    if (
      response &&
      response.choices &&
      response.choices.length > 0 &&
      response.choices[0].message &&
      response.choices[0].message.content
    ) {
      const completion = response.choices[0].message.content;
      return completion;
    } else {
      console.error("Invalid API response format:", response);
      throw new Error(
        "Invalid response format or no completion text in response"
      );
    }
  } catch (error) {
    console.error("API Request Error:", error);
    throw new Error(`Error generating chat completion: ${error.message}`);
  }
}

function exportDataToFile(data, filePath) {
  try {
    fs.appendFileSync(filePath, data);
    console.log(`Data exported to ${filePath}`);
  } catch (error) {
    throw new Error(`Error exporting data to file: ${error.message}`);
  }
}

module.exports = { generateChatCompletion, exportDataToFile };
