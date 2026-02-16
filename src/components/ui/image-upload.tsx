"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
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
  label?: string;
  helperText?: string;
}

export function ImageUpload({
  value,
  onChange,
  disabled,
  endpoint = "imageUploader",
  className,
  label = "Upload image",
  helperText = "Drag and drop or click to choose a file",
}: ImageUploadProps) {
  const [optimisticPreview, setOptimisticPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const preview = optimisticPreview || value || null;

  const { startUpload } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      const url = res[0].ufsUrl;
      setOptimisticPreview(url);
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      onChange?.(url);
      setIsUploading(false);
      toast.success("Image uploaded");
    },
    onUploadError: (error: Error) => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      setOptimisticPreview(null);
      toast.error(`Error uploading: ${error.message}`);
      setIsUploading(false);
    },
  });

  // Cleanup object URL on unmount.
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const processFile = async (file: File) => {
    if (!file) return;
    setIsUploading(true);

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    // Optimistic preview
    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setOptimisticPreview(objectUrl);

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

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setOptimisticPreview(null);
    onChange?.("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
        <div className="relative w-full h-full overflow-hidden rounded-md border border-border group">
          <Image
            src={preview}
            alt="Preview"
            fill
            unoptimized
            className={`object-cover transition-transform group-hover:scale-[1.02] ${isUploading ? "opacity-50" : ""}`}
          />
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-card/60 backdrop-blur-[1px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {!isUploading && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card/90 text-muted-foreground hover:text-foreground"
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={cn(
            "flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed transition-all duration-200 bg-muted/20",
            (disabled || isUploading)
              ? "cursor-not-allowed opacity-50 border-border"
              : "border-border hover:border-primary/30 hover:bg-primary/5",
          )}
        >
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          ) : (
            <div className="flex flex-col items-center gap-2 p-4 text-center">
              <div className="rounded-md border border-border bg-card p-2.5 shadow-sm">
                <UploadCloud className="h-4.5 w-4.5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{helperText}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
ImageUpload.displayName = "ImageUpload";
