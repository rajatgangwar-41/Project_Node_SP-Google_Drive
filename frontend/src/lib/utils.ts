import { ForwardRefExoticComponent, RefAttributes } from "react";
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
  LucideProps,
} from "lucide-react";

export type LucideType = ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

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
