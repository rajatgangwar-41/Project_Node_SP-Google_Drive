import express from "express";
import { readdir, rename, rm } from "node:fs/promises";
import { publicPath, dirPath } from "./constants/data.js";

const app = express();
const PORT = 4000;

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
app.get("/:filename", (req, res, next) => {
  const { filename } = req.params;

  if (req.query.action === "download")
    res.set("content-disposition", "attachment");

  res.sendFile(publicPath + "/" + filename);
});

// Delete File
app.delete("/:filename", async (req, res, next) => {
  const { filename } = req.params;
  try {
    await rm(publicPath + "/" + filename);
    res.json({ message: "File deleted successfully" });
  } catch {
    res.status(404).json({ message: "File not found" });
  }
});

// Update File
app.patch("/:filename", async (req, res, next) => {
  const { filename } = req.params;
  const { newName } = req.body;
  try {
    await rename(publicPath + "/" + filename, publicPath + "/" + newName);
    res.json({ message: "File renamed successfully" });
  } catch {
    res.status(404).json({ message: "File not found" });
  }
});

// Read Home Route
app.get("/", async (req, res) => {
  const fileList = await readdir(dirPath + "/public");
  res.json(fileList);
});

// Read Images Route
app.get("/images", async (req, res) => {
  const fileList = await readdir(dirPath + "/public/images");
  res.json(fileList);
});

app.listen(PORT, () => {
  console.log("Server Listening at port:", PORT);
});
