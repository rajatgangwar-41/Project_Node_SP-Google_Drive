import http from "http";
import { baseURL } from "./constants/data.js";
import {
  handleGETRequest,
  handlePOSTRequest,
  handleOPTIONSRequest,
} from "./lib/serverFunctions.js";

const server = http.createServer(async (req, res) => {
  let { pathname: url, searchParams: params } = new URL(req.url, baseURL);
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-headers", "*");

  switch (req.method) {
    case "OPTIONS": {
      handleOPTIONSRequest(res);
      break;
    }
    case "GET": {
      handleGETRequest(req, res, url, params);
      break;
    }
    case "POST": {
      handlePOSTRequest(req, res, url);
      break;
    }
    default:
      res.end("OK");
  }
});

server.listen(4000, "0.0.0.0", () => {
  console.log("Server Listening at port 4000");
});
