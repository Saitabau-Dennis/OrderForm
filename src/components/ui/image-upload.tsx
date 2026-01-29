"use client"

import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, X, Loader2 } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  endpoint?: "imageUploader" | "productImage";
  className?: string;
}

export function ImageUpload({ value, onChange, disabled, endpoint = "imageUploader", className }: ImageUploadProps) {
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
    <div className={cn("w-full h-full", className)}>
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
        <div className="relative w-full h-full overflow-hidden border border-primary group rounded-none">
          <img
            src={preview}
            alt="Preview"
            className={`w-full h-full object-cover transition-transform group-hover:scale-105 ${isUploading ? 'opacity-50' : ''}`}
          />
          {isUploading && (
             <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
          )}
          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {!isUploading && (
             <button
              onClick={handleRemoveImage}
              className="bg-red-500 text-white p-2 hover:bg-red-600 transition-colors rounded-none"
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={cn(
            "flex flex-col items-center justify-center w-full h-full border border-dashed cursor-pointer transition-all duration-200 rounded-none bg-secondary/10",
            (disabled || isUploading)
              ? "opacity-50 cursor-not-allowed border-primary/20"
              : "border-primary/40 hover:border-primary hover:bg-primary/5"
          )}
        >
          {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
          ) : (
            <div className="flex flex-col items-center gap-2 p-4 text-center">
              <div className="p-3 bg-white border border-primary/10 shadow-sm group-hover:scale-110 transition-transform rounded-none">
                <UploadCloud className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  Upload Logo
                </p>
                <p className="text-[10px] text-muted-foreground hidden sm:block">
                  Drag & drop or click
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
ImageUpload.displayName = "ImageUpload";