export const dirPath = ".";

export const baseURL = "http://localhost";
// export const baseURL = "http://192.168.1.15";
// export const baseURL = "http://[2401:4900:8857:d5f9:a696:3461:b893:67ec]";

export const publicPath =
  import.meta.dirname.split("/").slice(0, -2).join("/") + "/public";
