import express from "express";
import cors from "cors";
import { readdir, rename, rm, stat } from "node:fs/promises";
import { publicPath, dirPath } from "./constants/data.js";
import { createWriteStream } from "node:fs";

const app = express();
const PORT = 4000;

app.use(cors());

// Setting the body
app.use(express.json());

// Setting CORS
app.use((req, res, next) => {
  res.set({
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "*",
    "access-control-allow-headers": "*",
  });
  next();
});

// Read File
app.get("/files/:filename", (req, res) => {
  const { filename } = req.params;

  if (req.query.action === "download")
    res.set("content-disposition", "attachment");

  res.sendFile(publicPath + "/" + filename);
});

// Delete File
app.delete("/files/:filename", async (req, res) => {
  const { filename } = req.params;
  try {
    await rm(publicPath + "/" + filename);
    res.json({ message: "File deleted successfully" });
  } catch {
    res.status(404).json({ message: "File not found" });
  }
});

// Update File
app.patch("/files/:filename", async (req, res) => {
  const { filename } = req.params;
  const { newName } = req.body;
  try {
    await rename(publicPath + "/" + filename, publicPath + "/" + newName);
    res.json({ message: "File renamed successfully" });
  } catch {
    res.status(404).json({ message: "File not found" });
  }
});

// Create File
app.post("/files/:filename", (req, res) => {
  const { filename } = req.params;
  try {
    const writeStream = createWriteStream(publicPath + "/" + filename);
    req.pipe(writeStream);
    req.on("end", () => {
      res.json({ message: "File uploaded successfully" });
    });
  } catch {
    res.status(500).json({ message: "Something wrong! Upload again." });
  }
});

// Read Home Route
app.get("/", async (req, res) => {
  const fileList = await readdir(dirPath + "/public");
  const result = [];
  for (const item of fileList) {
    const stats = await stat(publicPath + req.path + `/${item}`);
    result.push({ name: item, isDirectory: stats.isDirectory() });
  }
  res.json(result);
});

// Read Images Route
app.get("/images", async (req, res) => {
  console.log(req.path);
  const fileList = await readdir(dirPath + "/public/images");
  const result = [];
  for (const item of fileList) {
    const stats = await stat(publicPath + req.path + `/${item}`);
    result.push({ name: item, isDirectory: stats.isDirectory() });
  }
  res.json(result);
});

app.listen(PORT, () => {
  console.log("Server Listening at port:", PORT);
});
