import { readdir, readFile } from "fs/promises";

export const dirPath = ".";

export const serveDirectory = async (req, res) => {
  const itemList = await readdir(
    dirPath + "/public" + decodeURIComponent(req.url),
  );
  let dynamicHTML = "";
  itemList.forEach((item) => {
    dynamicHTML += `<li><a href="${req.url + (req.url == "/" ? "" : "/") + item}" alt=${item}>${item}</a></li>`;
  });
  const htmlBoilerPlate = await readFile("./src/boilerplate.html", "utf-8");
  res.end(htmlBoilerPlate.replace("${dynamicHTML}", dynamicHTML));
};
