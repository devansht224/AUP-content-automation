const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/x", (req, res) => {
  console.log("Received data:", req.body);
  main(" " + req.body.data);

  res.send("Data received successfully!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

require("dotenv").config();
const { generateChatCompletion, exportDataToFile } = require("./openaiService");

function main(x) {
  try {
    const X = x;
    const directoryPath = "./prompts";
    fs.writeFileSync("chat_completion.txt", "");

    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.error("Error reading directory:", err);
        return;
      }

      files.forEach((file) => {
        const filePath = path.join(directoryPath, file);

        fs.stat(filePath, async (statErr, stats) => {
          if (statErr) {
            console.error("Error getting file stats:", statErr);
            return;
          }
          if (stats.isFile()) {
            console.log("File found:", filePath);

            let prompt = "";
            const readData = fs.readFileSync(filePath, "utf8");
            prompt = readData + X;

            const completion = await generateChatCompletionWithDelay(prompt);
            let response = filePath + "\n\n\n" + completion + "\n\n\n";

            const finalFile = "chat_completion.txt";
            exportDataToFile(response, finalFile);
          } else if (stats.isDirectory()) {
            console.log("Directory found:", filePath);
          }
        });
      });
      console.log("DONE");
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateChatCompletionWithDelay(prompt) {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const completion = await generateChatCompletion(prompt);
      resolve(completion);
    }, 0); // 60000 milliseconds = 1 minute
  });
}
