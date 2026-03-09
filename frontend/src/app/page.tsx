import Link from "next/link";
import { FolderOpen } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-linear-to-r from-gray-800 to-gray-900 px-6 py-8 text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <FolderOpen className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white">File Explorer</h1>

          <p className="text-gray-300 mt-2 text-sm">
            Browse folders, open files, and download resources
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-10 text-center">
          <p className="text-gray-600 mb-6">
            Start exploring your directory structure using the folder viewer.
          </p>

          <Link
            href="/folder"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition"
          >
            <FolderOpen size={18} />
            Open Folder Listing
          </Link>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 text-center text-sm text-gray-500">
          Simple File Explorer Interface
        </div>
      </div>
    </div>
  );
}
