import { readdir, readFile } from "fs/promises";
import mime from "mime-types";

export const dirPath = ".";

export const baseURL = "http://192.168.1.15";
const fileRegex = new RegExp(/\.[^.]+$/);

export const serveDirectory = async (req, res) => {
  const { pathname: url } = new URL(req.url, baseURL);
  const itemList = await readdir(dirPath + "/public" + decodeURIComponent(url));

  let dynamicHTML = "";
  itemList.forEach((item) => {
    dynamicHTML += `<li>
    ${
      !fileRegex.test(item)
        ? `<a href="${url + (url == "/" ? "" : "/") + item}" alt=${item}>${item}</a>`
        : `${item} <a href="${url + (url == "/" ? "" : "/") + item + "/?action=preview"}" alt=${item}>Preview</a>
    <a href="${url + (url == "/" ? "" : "/") + item + "/?action=download"}" alt=${item}>Download</a>`
    }
    </li>`;
  });

  const htmlBoilerPlate = await readFile(
    dirPath + "/src/boilerplate.html",
    "utf-8",
  );
  res.end(htmlBoilerPlate.replace("${dynamicHTML}", dynamicHTML));
};

export const getHeaders = (type, fileName, size) => {
  let value;
  if (type == "preview") value = "inline";
  else value = `attachment; filename=${fileName}`;

  const headers = new Headers({
    "content-disposition": value,
    "content-length": size,
    "content-type": mime.contentType(fileName),
  });

  return headers;
};
