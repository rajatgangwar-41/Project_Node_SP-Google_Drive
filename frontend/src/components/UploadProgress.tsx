"use client";

import { useState } from "react";
import UploadButton from "./UploadButton";

export default function UploadProgress({ path }: { path: string }) {
  const [progress, setProgress] = useState<number | null>(null);

  return (
    <>
      {/* Upload Button */}
      <UploadButton path={path} setProgress={setProgress} />

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
    </>
  );
}
