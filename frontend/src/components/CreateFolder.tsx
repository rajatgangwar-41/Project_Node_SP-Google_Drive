"use client";

import toast from "react-hot-toast";
import { startTransition, useState } from "react";
import { FolderPlus } from "lucide-react";
import { BACKEND_URL } from "@/constants/data";
import { useRouter } from "next/navigation";

export default function CreateFolder({ path }: { path: string }) {
  const [showForm, setShowForm] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const createFolder = async () => {
    if (!folderName.trim()) {
      toast.error("Folder name required");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${BACKEND_URL}/directory${path}/${folderName}?action=create-folder`,
        { method: "POST" },
      );

      setFolderName("");
      setShowForm(false);

      if (response.status === 200) {
        toast.success("Folder created");
        // window.location.reload();
        startTransition(() => {
          router.refresh();
        });
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Failed to create folder");
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
      >
        <FolderPlus size={16} />
        New Folder
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        autoFocus
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
        placeholder="Folder name"
        className="px-3 py-2 text-sm rounded-lg bg-white text-gray-900 border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <button
        onClick={createFolder}
        onKeyDown={(e) => {
          if (e.key === "Enter") createFolder();
        }}
        disabled={loading}
        className="px-3 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        Create
      </button>

      <button
        onClick={() => {
          setShowForm(false);
          setFolderName("");
        }}
        className="px-3 py-2 text-sm rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
      >
        Cancel
      </button>
    </div>
  );
}
