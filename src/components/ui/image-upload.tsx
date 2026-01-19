"use client"

import React, { useState, useRef } from 'react';
import { UploadCloud, X } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange?: (file: File | null) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onChange?.(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;

    const file = event.dataTransfer.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onChange?.(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    setPreview(null);
    onChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />

      {preview ? (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <button
              onClick={handleRemoveImage}
              className="bg-destructive text-destructive-foreground rounded-full p-2 hover:bg-destructive/90 transition-colors"
              title="Remove image"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !disabled && fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`
            flex flex-col items-center justify-center w-full h-48
            border-2 border-dashed rounded-lg cursor-pointer
            transition-all duration-200
            ${disabled
              ? 'opacity-50 cursor-not-allowed border-muted-foreground/20 bg-muted/10'
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5'
            }
          `}
        >
          <div className="p-4 rounded-full bg-background shadow-sm mb-3 group-hover:scale-110 transition-transform">
            <UploadCloud className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            SVG, PNG, JPG or GIF (max. 2MB)
          </p>
        </div>
      )}
    </div>
  );
}
ImageUpload.displayName = "ImageUpload"
