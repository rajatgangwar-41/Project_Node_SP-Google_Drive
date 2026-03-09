"use client";

import toast from "react-hot-toast";
import { useRef } from "react";
import { Upload } from "lucide-react";
import { BACKEND_URL } from "@/constants/data";

interface Props {
  path: string;
  setProgress: (value: number | null) => void;
}

export default function UploadButton({ path, setProgress }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    inputRef.current?.click();
  };

  const uploadFile = (file: File) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append("file", file);

    xhr.open("POST", BACKEND_URL + path + "?action=upload");
    xhr.setRequestHeader("filename", file.name);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      setProgress(null);
      toast.success("Upload completed");
      window.location.reload();
    };

    xhr.onerror = () => {
      setProgress(null);
      toast.error("Upload failed");
    };

    xhr.send(formData);
    console.log("Fronted Request Hit");
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleUpload}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
      >
        <Upload size={16} />
        Upload
      </button>

      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadFile(file);
        }}
      />
    </div>
  );
}
