import express from "express";
import { readdir } from "node:fs/promises";
import { absPath, dirPath } from "./constants/data.js";

const app = express();
const PORT = 4000;

app.use((req, res, next) => {
  res.set("access-control-allow-origin", "*");
  next();
});

app.use((req, res, next) => {
  if (req.query.action === "download")
    res.set("content-disposition", "attachment");
  express.static(absPath + "/public", { index: false })(req, res, next);
});

app.get("/", async (req, res) => {
  const fileList = await readdir(dirPath + "/public");
  res.json(fileList);
});

app.get("/images", async (req, res) => {
  const fileList = await readdir(dirPath + "/public/images");
  res.json(fileList);
});

app.listen(PORT, () => {
  console.log("Server Listening at port:", PORT);
});
