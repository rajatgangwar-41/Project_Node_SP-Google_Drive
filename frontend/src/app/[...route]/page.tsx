import Sections from "@/components/Sections";
import { BACKEND_URL } from "@/constants/data";
import { DirectoryItem } from "@/constants/types";

interface Props {
  params: Promise<{ route: string[] }>;
  searchParams: Promise<{ action: string }>;
}

export default async function UserPage({ params, searchParams }: Props) {
  const { route } = await params;
  const queryParams = await searchParams;
  const pathParams = new URLSearchParams(queryParams).toString();

  const path =
    route.splice(1).reduce((result, item) => {
      return result + "/" + item;
    }, "") || "/";

  let directoryItems: DirectoryItem[] = [];
  let errorReason = null;

  try {
    const response = await fetch(BACKEND_URL + path + "?" + pathParams);
    if (response.status === 200) directoryItems = await response.json();
  } catch (error) {
    if ((error as { message: string }).message == "fetch failed")
      errorReason = "Server Fetching Failed";
  }

  const isRoot = path === "/";

  // Add parent directory option
  if (!isRoot) {
    directoryItems.unshift({ name: "..", isDirectory: true });
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <Sections
        directoryItems={directoryItems}
        isRoot={isRoot}
        path={path}
        errorReason={errorReason}
      />
    </div>
  );
}
