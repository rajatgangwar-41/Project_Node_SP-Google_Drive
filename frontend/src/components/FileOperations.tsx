"use client";

import toast from "react-hot-toast";
import { Trash2, Pencil } from "lucide-react";
import { BACKEND_URL } from "@/constants/data";
import { startTransition } from "react";
import { useRouter } from "next/navigation";

export default function FileOperations({
  path,
  name,
}: {
  path: string;
  name: string;
}) {
  const router = useRouter();

  const deleteItem = async () => {
    const confirmed = confirm("Delete this item?");
    if (!confirmed) return;
    console.log(`${BACKEND_URL + path + name}?action=delete`);

    try {
      const response = await fetch(
        `${BACKEND_URL + path + name}?action=delete`,
        {
          method: "DELETE",
        },
      );

      if (response.status === 200) {
        toast.success("Deleted successfully");
        // window.location.reload();
        startTransition(() => {
          router.refresh();
        });
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  const renameItem = async () => {
    const newName = prompt("Enter new name", name);
    if (!newName) return;

    try {
      const response = await fetch(
        `${BACKEND_URL + path + name}?action=rename`,
        {
          method: "PATCH",
          body: JSON.stringify({ newName }),
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.status === 200) {
        toast.success("Renamed successfully");
        // window.location.reload();
        startTransition(() => {
          router.refresh();
        });
      } else {
        throw new Error();
      }
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
