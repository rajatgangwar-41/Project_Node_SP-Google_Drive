"use client";

import { useState } from "react";
import { File, Folder, FolderOpen } from "lucide-react";
import FileActions from "./FileActions";
import { BACKEND_URL, FRONTEND_URL, user_id } from "@/constants/data";
import FileOperations from "./FileOperations";
import UploadButton from "./UploadButton";
import { getMimeType } from "@/lib/utils";
import { DirectoryItem } from "@/constants/types";

interface Props {
  directoryItems: DirectoryItem[];
  isRoot: boolean;
  path: string;
  errorReason: string | null;
}

export default function Sections({
  directoryItems,
  isRoot,
  path,
  errorReason,
}: Props) {
  const [progress, setProgress] = useState<number | null>(null);

  const isParent = (item: DirectoryItem) => item.name === "..";
  const isFolder = (item: DirectoryItem) => !!item.isDirectory;

  const getParentPath = () => {
    if (!path) return "";

    const parts = path.split("/").filter(Boolean);
    parts.pop();

    return "/" + parts.join("/");
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-linear-to-r from-gray-800 to-gray-900 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <FolderOpen className="w-6 h-6 text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">Folder Listing</h1>

            <p className="text-gray-300 text-sm mt-1">
              {directoryItems.length - (isRoot ? 0 : 1)} item
              {directoryItems.length - (isRoot ? 0 : 1) !== 1 ? "s" : ""} found
            </p>
          </div>
          <div className="flex flex-1 justify-end">
            <UploadButton path={path} setProgress={setProgress} />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {progress !== null && (
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-green-500 rounded transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Directory List */}
      <div className="px-1 py-2">
        <ul className="divide-y divide-gray-100">
          {directoryItems.map((item) => {
            const Icon = getMimeType(item);
            return (
              <li
                key={item.name}
                className="px-6 py-4 hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  {/* Left Section */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {isParent(item) ? (
                      <FolderOpen className="w-7 h-7 text-gray-500" />
                    ) : isFolder(item) ? (
                      <Folder className="w-7 h-7 text-yellow-600" />
                    ) : (
                      <Icon className="w-7 h-7 text-blue-600" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 font-medium truncate">
                          {item.name === ".."
                            ? "← Parent Directory"
                            : item.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                          {isParent(item)
                            ? "Parent"
                            : isFolder(item)
                              ? "Folder"
                              : item.name?.split(".").pop()!.toUpperCase()}
                        </span>

                        <span className="text-xs text-gray-500">
                          {isFolder(item) ? "—" : "File"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <FileActions
                      isFolder={isFolder(item)}
                      openUrl={
                        isParent(item)
                          ? `${FRONTEND_URL + `/${user_id}` + getParentPath()}?action=open`
                          : `${
                              (isFolder(item)
                                ? FRONTEND_URL + `/${user_id}`
                                : BACKEND_URL + "/files") +
                              (path == "/" ? "" : path) +
                              `/${item.name}`
                            }?action=open`
                      }
                      downloadUrl={`${BACKEND_URL + "/files" + (path == "/" ? "" : path) + `/${item.name}`}?action=download`}
                    />

                    {!isParent(item) && (
                      <FileOperations path={path} name={item.name} />
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Empty Folder */}
        {directoryItems.length === (isRoot ? 0 : 1) && (
          <div className="py-16 px-6 text-center">
            <div className="max-w-sm mx-auto">
              <File className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {errorReason ?? "No files or folders found"}
              </h3>
              <p className="text-gray-500">
                {errorReason
                  ? "Try again later"
                  : "This directory is currently empty."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Folder className="w-4 h-4 text-yellow-500" />
            <span>
              Folders:{" "}
              {
                directoryItems.filter(
                  (item) => !isParent(item) && isFolder(item),
                ).length
              }
            </span>
          </div>

          <div className="flex items-center gap-1">
            <File className="w-4 h-4 text-blue-500" />
            <span>
              Files:{" "}
              {
                directoryItems.filter(
                  (item) => !isParent(item) && !isFolder(item),
                ).length
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
