import http from "http";
import { open } from "fs/promises";
import { dirPath, getHeaders, serveDirectory, baseURL } from "./lib/utils.js";

const server = http.createServer(async (req, res) => {
  let { pathname: url, searchParams: params } = new URL(req.url, baseURL);
  res.setHeader("access-control-allow-origin", "*");

  if (url == "/") {
    await serveDirectory(req, res);
  } else {
    url = url.at(-1) == "/" ? url.slice(0, -1) : url;
    try {
      const fileHandle = await open(
        dirPath + "/public" + decodeURIComponent(url),
      );
      const stats = await fileHandle.stat();
      if (stats.isDirectory()) {
        await serveDirectory(req, res);
      } else {
        const readStream = fileHandle.createReadStream();
        const headers = getHeaders(
          params.get("action"),
          url.split("/").at(-1),
          stats.size,
        );
        res.setHeaders(headers);
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
      console.log(JSON.stringify("File Not Found"));
      res.writeHead(404, "File Not Found");
      res.end(JSON.stringify("File Not Found"));
    }
  }
});

server.listen(4000, "0.0.0.0", () => {
  console.log("Server Listening at port 4000");
});
