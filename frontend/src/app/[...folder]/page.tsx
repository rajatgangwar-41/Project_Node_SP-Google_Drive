import { Folder, File, FileText, FolderOpen } from "lucide-react";
import { BACKEND_URL, FRONTEND_URL } from "@/constants/data";
import FileActions from "@/components/FileActions";

interface props {
  params: Promise<{ folder: [string] }>;
  searchParams: Promise<{ action: string }>;
}

export default async function FolderPage({ params, searchParams }: props) {
  const directoryParams = await params;
  const queryParams = (await searchParams).action;

  const currentPath =
    directoryParams.folder?.reduce((path, item) => {
      if (item == "folder") return path;
      return path + item + "/";
    }, "") || "";

  const action = queryParams ? "?action=" + queryParams : "";

  const response = await fetch(BACKEND_URL + currentPath + action);

  let directoryItems: string[] = [];
  if (response.status === 200) directoryItems = await response.json();

  const isRoot = currentPath === "";

  // Add parent directory option
  if (!isRoot) {
    directoryItems.unshift("..");
  }

  const isParent = (item: string) => item === "..";
  const isFolder = (item: string) => item === ".." || !item.includes(".");

  const getParentPath = () => {
    if (!currentPath) return "";

    const parts = currentPath.split("/").filter(Boolean);
    parts.pop();

    return parts.length ? parts.join("/") + "/" : "";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-8">
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
                {directoryItems.length - (isRoot ? 0 : 1) !== 1 ? "s" : ""}{" "}
                found
              </p>
            </div>
          </div>
        </div>

        {/* Directory List */}
        <div className="px-1 py-2">
          <ul className="divide-y divide-gray-100">
            {directoryItems.map((item: string) => (
              <li
                key={item}
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
                      <FileText className="w-7 h-7 text-blue-600" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 font-medium truncate">
                          {item === ".." ? "← Parent Directory" : item}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                          {isParent(item)
                            ? "Parent"
                            : isFolder(item)
                              ? "Folder"
                              : item.split(".").pop()!.toUpperCase()}
                        </span>

                        <span className="text-xs text-gray-500">
                          {isFolder(item) ? "—" : "File"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <FileActions
                    isFolder={isFolder(item)}
                    openUrl={
                      isParent(item)
                        ? `${FRONTEND_URL + "/folder/" + getParentPath()}?action=open`
                        : `${
                            (isFolder(item)
                              ? FRONTEND_URL + "/folder/"
                              : BACKEND_URL) +
                            currentPath +
                            item
                          }?action=open`
                    }
                    downloadUrl={`${BACKEND_URL + currentPath + item}?action=download`}
                  />
                </div>
              </li>
            ))}
          </ul>

          {/* Empty Folder */}
          {directoryItems.length === (isRoot ? 0 : 1) && (
            <div className="py-16 px-6 text-center">
              <div className="max-w-sm mx-auto">
                <File className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No files or folders found
                </h3>
                <p className="text-gray-500">
                  This directory is currently empty.
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
                    (item: string) => !isParent(item) && isFolder(item),
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
                    (item: string) => !isParent(item) && !isFolder(item),
                  ).length
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
