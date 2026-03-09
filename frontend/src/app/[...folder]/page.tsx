import Sections from "@/components/Sections";
import { BACKEND_URL } from "@/constants/data";

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

  let directoryItems: string[] = [];
  let reason = null;
  try {
    const response = await fetch(BACKEND_URL + currentPath + action);
    if (response.status === 200) directoryItems = await response.json();
  } catch (error) {
    if ((error as { message: string }).message == "fetch failed")
      reason = "Server Fetching Failed";
  }

  const isRoot = currentPath === "";

  // Add parent directory option
  if (!isRoot) {
    directoryItems.unshift("..");
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <Sections
        directoryItems={directoryItems}
        isRoot={isRoot}
        currentPath={currentPath}
        reason={reason}
      />
    </div>
  );
}
