"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function OTPInput({ length = 6, value, onChange, className }: OTPInputProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = e.target.value;
    if (isNaN(Number(newValue))) return;

    const newOtp = value.split("");
    // Handle pasting or single char input
    if (newValue.length > 1) {
       const pastedValue = newValue.slice(0, length);
       onChange(pastedValue);
       // Focus last filled input or the next empty one
       const nextIndex = Math.min(pastedValue.length, length - 1);
       inputRefs.current[nextIndex]?.focus();
       return;
    }

    newOtp[index] = newValue;
    const finalValue = newOtp.join("").slice(0, length);
    onChange(finalValue);

    // Move to next input if value is entered
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
        const newOtp = value.split("");
        newOtp[index - 1] = ""; // Clear previous value too? Usually yes for backspace navigation
        onChange(newOtp.join(""));
      } else {
         const newOtp = value.split("");
         newOtp[index] = "";
         onChange(newOtp.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(pastedData)) return;
    onChange(pastedData);
    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className={cn("flex gap-2 justify-center", className)}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1} // Allow more for paste handling in handleChange but visually 1
          value={value[index] || ""}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="w-12 h-14 text-center text-2xl font-bold border rounded-xl bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
        />
      ))}
    </div>
  );
}
