"use client";

import { Trash2, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { BACKEND_URL } from "@/constants/data";

export default function FileOperations({
  path,
  name,
}: {
  path: string;
  name: string;
}) {
  const deleteItem = async () => {
    const confirmed = confirm("Delete this item?");
    if (!confirmed) return;

    try {
      await fetch(`${BACKEND_URL + path + name}?action=delete`, {
        method: "DELETE",
      });

      toast.success("Deleted successfully");
      window.location.reload();
    } catch {
      toast.error("Delete failed");
    }
  };

  const renameItem = async () => {
    const newName = prompt("Enter new name", name);
    if (!newName) return;

    try {
      await fetch(`${BACKEND_URL + path + name}?action=rename`, {
        method: "POST",
        body: JSON.stringify({ newName }),
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Renamed successfully");
      window.location.reload();
    } catch {
      toast.error("Rename failed");
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={renameItem}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
      >
        <Pencil size={16} />
      </button>

      <button
        onClick={deleteItem}
        className="p-2 rounded-lg bg-red-100 hover:bg-red-200"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
