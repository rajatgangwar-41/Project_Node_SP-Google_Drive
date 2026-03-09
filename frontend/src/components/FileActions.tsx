"use client";

import Link from "next/link";
import { Eye, Download } from "lucide-react";

type Props = {
  isFolder: boolean;
  openUrl: string;
  downloadUrl: string;
};

export default function FileActions({ isFolder, openUrl, downloadUrl }: Props) {
  const handleDownload = () => {
    if (isFolder) return;
    window.location.href = downloadUrl;
  };

  return (
    <div className="flex items-center gap-2 ml-4">
      <Link
        href={openUrl}
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-black hover:text-white transition-colors duration-300 shadow-sm"
      >
        <Eye size={16} />
        <span>Open</span>
      </Link>

      <button
        onClick={handleDownload}
        disabled={isFolder}
        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-300 shadow-sm
        ${
          isFolder
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-rose-700 cursor-pointer"
        }`}
      >
        <Download size={16} />
        <span>Download</span>
      </button>
    </div>
  );
}
