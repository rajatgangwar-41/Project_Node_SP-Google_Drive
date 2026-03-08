import http from "http";
import { open } from "fs/promises";
import { dirPath, serveDirectory } from "./lib/utils.js";

const server = http.createServer(async (req, res) => {
  if (req.url == "/") {
    await serveDirectory(req, res);
  } else {
    try {
      const fileHandle = await open(
        dirPath + "/public" + decodeURIComponent(req.url),
      );
      const stats = await fileHandle.stat();
      if (stats.isDirectory()) {
        await serveDirectory(req, res);
      } else {
        const readStream = fileHandle.createReadStream();
        readStream.pipe(res);
      }
      res.on("error", () => {
        console.log("Some error came");
      });

      res.on("close", () => {
        fileHandle.close();
      });
    } catch (error) {
      console.log(error.message);
      res.end("File Not Found");
    }
  }
});

server.listen(4000, "0.0.0.0", () => {
  console.log("Server Listening at port 4000");
});
