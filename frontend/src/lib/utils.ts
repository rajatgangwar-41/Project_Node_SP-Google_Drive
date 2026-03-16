import mime from "mime-types";
import {
  File,
  FileArchive,
  FileAudio,
  FileCode,
  FileSpreadsheet,
  FileText,
  FileType,
  FileVideo,
  Image,
} from "lucide-react";
import { DirectoryItem, LucideType } from "@/constants/types";

export const FileIcon: { [key: string]: LucideType } = {
  video: FileVideo,
  audio: FileAudio,
  text: FileText,
  image: Image,
  pdf: FileText,
  archive: FileArchive,
  code: FileCode,
  spreadsheet: FileSpreadsheet,
  document: FileType,
  default: File,
};

export const getMimeType = (item: DirectoryItem) => {
  const content = mime.contentType(item.name);
  let Icon: LucideType;
  if (typeof content !== "boolean") {
    const type = content.split("/").at(0) || "default";
    Icon = FileIcon[type] || File;
  } else Icon = FileText;

  return Icon;
};
