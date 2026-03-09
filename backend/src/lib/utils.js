import mime from "mime-types";
import { readdir } from "fs/promises";
import { baseURL, dirPath } from "../constants/data.js";

export const serveDirectory = async (req, res) => {
  const { pathname: url } = new URL(req.url, baseURL);
  const itemList = await readdir(dirPath + "/public" + decodeURIComponent(url));
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify(itemList));
};

export const getHeaders = (type, fileName, size) => {
  let value;
  if (type == "download") value = `attachment; filename=${fileName}`;
  else value = "inline";

  const headers = new Headers({
    "content-disposition": value,
    "content-length": size,
    "content-type": mime.contentType(fileName),
  });

  return headers;
};
