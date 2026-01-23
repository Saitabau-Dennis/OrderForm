"use client"

import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, X, Loader2 } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  endpoint?: "imageUploader" | "productImage";
}

export function ImageUpload({ value, onChange, disabled, endpoint = "imageUploader" }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      const url = res[0].ufsUrl;
      setPreview(url);
      onChange?.(url);
      setIsUploading(false);
      toast.success("Image uploaded");
    },
    onUploadError: (error: Error) => {
      toast.error(`Error uploading: ${error.message}`);
      setIsUploading(false);
    },
  });

  // Sync preview with value if it changes externally
  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const processFile = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    // Optimistic preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    
    await startUpload([file]);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        await processFile(file);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled || isUploading) return;

    const file = event.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || isUploading) return;

    setPreview(null);
    onChange?.("");
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
        disabled={disabled || isUploading}
        className="hidden"
      />

      {preview ? (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border group">
          <img
            src={preview}
            alt="Preview"
            className={`w-full h-full object-cover transition-transform group-hover:scale-105 ${isUploading ? 'opacity-50' : ''}`}
          />
          {isUploading && (
             <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {!isUploading && (
             <button
              onClick={handleRemoveImage}
              className="bg-destructive text-destructive-foreground rounded-full p-2 hover:bg-destructive/90 transition-colors"
              title="Remove image"
            >
              <X className="h-5 w-5" />
            </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`
            flex flex-col items-center justify-center w-full h-48
            border-2 border-dashed rounded-lg cursor-pointer
            transition-all duration-200
            ${(disabled || isUploading)
              ? 'opacity-50 cursor-not-allowed border-muted-foreground/20 bg-muted/10'
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5'
            }
          `}
        >
          {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <>
              <div className="p-4 rounded-full bg-background shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <UploadCloud className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                SVG, PNG, JPG or GIF (max. 2MB)
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
ImageUpload.displayName = "ImageUpload"