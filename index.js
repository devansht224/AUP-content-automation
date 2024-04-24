const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

let Done = false;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/check_done", function (req, res) {
  res.send({ done: Done });
});

app.get("/get", async function (req, res) {
  let data = fs.readFileSync("chat_completion.txt", "utf8");
  data = data.split("\n").join("<br/>");
  res.send({ data: data });
  Done = false;
});

app.post("/x", (req, res) => {
  console.log("Received data:", req.body);
  const data = req.body.data;
  const directoryPath = "./prompts";
  fs.writeFileSync("chat_completion.txt", "");

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      res.status(500).send("Error reading directory");
      return;
    }
    processFilesSequentially(files, directoryPath, " " + data, 0);

    res.send("Data received successfully!");
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

require("dotenv").config();
const { generateChatCompletion, exportDataToFile } = require("./openaiService");

function processFilesSequentially(files, directoryPath, X, currentIndex) {
  if (currentIndex >= files.length) {
    console.log("DONE");
    Done = true;
    return;
  }

  const file = files[currentIndex];
  const filePath = path.join(directoryPath, file);

  fs.stat(filePath, async (statErr, stats) => {
    if (statErr) {
      console.error("Error getting file stats:", statErr);
      processFilesSequentially(files, directoryPath, X, currentIndex + 1);
      return;
    }

    if (stats.isFile()) {
      console.log("File found:", filePath);

      let prompt = "";
      const readData = fs.readFileSync(filePath, "utf8");
      prompt = readData + X;

      const completion = await generateChatCompletion(prompt);
      let response = filePath + "\n\n\n" + completion + "\n\n\n";

      const finalFile = "chat_completion.txt";
      exportDataToFile(response, finalFile);

      processFilesSequentially(files, directoryPath, X, currentIndex + 1);
    } else if (stats.isDirectory()) {
      console.log("Directory found:", filePath);

      processFilesSequentially(files, directoryPath, X, currentIndex + 1);
    }
  });
}
