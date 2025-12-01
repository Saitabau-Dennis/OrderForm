"use client"

import React, { useState, useRef } from 'react';
import { UploadCloud, X } from "lucide-react";

export function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the file input
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <input
        id="image"
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      {previewUrl ? (
        <div className="relative w-32 h-32 rounded-md overflow-hidden border border-gray-200">
          <img src={previewUrl} alt="Product Preview" className="w-full h-full object-cover" />
          <button
            onClick={handleRemoveImage}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400 transition-colors bg-gray-50"
        >
          <UploadCloud className="h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-500 mt-2">Drag & drop an image here, or click to select</p>
          <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
        </div>
      )}
    </div>
  );
}
