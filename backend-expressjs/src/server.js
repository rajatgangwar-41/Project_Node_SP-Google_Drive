import express from "express";
import cors from "cors";
import { createWriteStream } from "node:fs";
import { readdir, rename, rm, stat } from "node:fs/promises";
import { absPublicPath, relPublicPath } from "./constants/data.js";

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

// Read Directory
app.get("/directory{/*path}", async (req, res) => {
  const { path = [] } = req.params;
  const dirname = path.join("/");
  const result = [];

  const fileList = await readdir(relPublicPath + `/${dirname}`);
  for (const item of fileList) {
    const stats = await stat(relPublicPath + `/${dirname}` + `/${item}`);
    result.push({ name: item, isDirectory: stats.isDirectory() });
  }

  res.json(result);
});

// Read File
app.get("/files/*path", (req, res) => {
  const { path } = req.params;
  const filename = path.join("/");

  if (req.query.action === "download")
    res.set("content-disposition", "attachment");

  try {
    res.sendFile(absPublicPath + `/${filename}`);
  } catch {
    res.status(404).json({ message: "File not found" });
  }
});

// Delete File
app.delete("/files/*path", async (req, res) => {
  const { path } = req.params;
  const filename = path.join("/");

  try {
    await rm(relPublicPath + `/${filename}`);
    res.json({ message: "File deleted successfully" });
  } catch {
    res.status(404).json({ message: "File not found" });
  }
});

// Update File
app.patch("/files/*path", async (req, res) => {
  const { path } = req.params;
  const { newName, path: dirPath } = req.body;
  const filename = path.join("/");

  try {
    await rename(
      relPublicPath + `/${filename}`,
      relPublicPath + dirPath + `/${newName}`,
    );
    res.json({ message: "File renamed successfully" });
  } catch {
    res.status(404).json({ message: "File not found" });
  }
});

// Create File
app.post("/files/*path", (req, res) => {
  const { path } = req.params;
  const filename = path.join("/");

  try {
    const writeStream = createWriteStream(relPublicPath + `/${filename}`);
    req.pipe(writeStream);
    req.on("end", () => {
      res.json({ message: "File uploaded successfully" });
    });
  } catch {
    res.status(500).json({ message: "Something wrong! Upload again." });
  }
});

app.listen(PORT, () => {
  console.log("Server Listening at port:", PORT);
});
