
require('dotenv').config();
const { generateChatCompletion, exportDataToFile } = require('./openaiService');

// Example usage
async function main() {
  try {
    // Generate chat completion
    const prompt = '';
    const completion = await generateChatCompletion(prompt);
    console.log('Generated completion:', completion);

    
    const filePath = 'chat_completion.txt';
    exportDataToFile(completion, filePath);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
