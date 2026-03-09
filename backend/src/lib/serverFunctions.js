import { open, rm } from "fs/promises";
import { createWriteStream } from "fs";
import { getHeaders, serveDirectory } from "./utils.js";
import { dirPath } from "../constants/data.js";

export const handleOPTIONSRequest = async (res) => {
  res.end("OK");
};

export const handleGETRequest = async (req, res, url, params) => {
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
};

export const handlePOSTRequest = async (req, res, url) => {
  url = url.at(-1) == "/" ? url.slice(0, -1) : url;
  try {
    const writeStream = createWriteStream(
      dirPath +
        "/public" +
        decodeURIComponent(url) +
        "/" +
        req.headers.filename,
    );

    req.on("data", (chunk) => {
      writeStream.write(chunk);
    });

    req.on("end", () => {
      res.end("File Uploaded Successfully");
      writeStream.end();
    });

    req.on("error", () => {
      throw new Error("File Upload Failed");
    });
  } catch (error) {
    console.log(error.message);
    console.log(JSON.stringify("File Upload Failed"));
    res.writeHead(404, "File Upload Failed");
    res.end(JSON.stringify("File Upload Failed"));
  }
};

export const handleDELETERequest = async (req, res, url) => {
  url = url.at(-1) == "/" ? url.slice(0, -1) : url;
  try {
    await rm(dirPath + "/public" + decodeURIComponent(url));
    res.end("File Deleted Successfully");
  } catch (error) {
    console.log(error.message);
    console.log(JSON.stringify("File Couldn't be Deleted"));
    res.writeHead(404, "File Couldn't be Deleted");
    res.end(JSON.stringify("File Couldn't be Deleted"));
  }
};
