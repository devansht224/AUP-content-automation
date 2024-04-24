// openaiService.js

const { OpenAI } = require('openai');
const fs = require('fs');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
 
});

// Function to generate chat completions
async function generateChatCompletion(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 8000, // Adjust as needed
      n: 1, // Number of completions to generate
    });

    // Log the response for debugging
    console.log('API Response:', response);

    // Check if response has choices array and choices are not empty
    if (
      response &&
      response.choices &&
      response.choices.length > 0 &&
      response.choices[0].message &&
      response.choices[0].message.content
    ) {
      // Get the completion text from the first choice
      const completion = response.choices[0].message.content.trim();
      return completion;
    } else {
      console.error('Invalid API response format:', response);
      throw new Error('Invalid response format or no completion text in response');
    }
  } catch (error) {
    console.error('API Request Error:', error);
    throw new Error(`Error generating chat completion: ${error.message}`);
  }
}

// Function to export data to a file
function exportDataToFile(data, filePath) {
  try {
    fs.writeFileSync(filePath, data);
    console.log(`Data exported to ${filePath}`);
  } catch (error) {
    throw new Error(`Error exporting data to file: ${error.message}`);
  }
}

module.exports = { generateChatCompletion, exportDataToFile };
