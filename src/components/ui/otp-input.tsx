"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export function OTPInput({ length = 6, value, onChange, className, disabled }: OTPInputProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = e.target.value;
    if (isNaN(Number(newValue))) return;

    const newOtp = value.split("");
    // Handle pasting or single char input
    if (newValue.length > 1) {
       const pastedValue = newValue.slice(0, length);
       onChange(pastedValue);
       const nextIndex = Math.min(pastedValue.length, length - 1);
       inputRefs.current[nextIndex]?.focus();
       return;
    }

    newOtp[index] = newValue;
    const finalValue = newOtp.join("").slice(0, length);
    onChange(finalValue);

    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newOtp = value.split("");
        newOtp[index - 1] = "";
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
    <div className={cn("flex items-center gap-2", className)}>
      {Array.from({ length }).map((_, index) => (
        <React.Fragment key={index}>
          <input
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ""}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            disabled={disabled}
            className={cn(
              "w-11 h-12 text-center text-xl font-semibold rounded-3xl transition-all duration-150 outline-none",
              "bg-muted/40 border border-border/60",
              "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-background",
              "hover:border-primary/40 hover:bg-muted/60",
              "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-muted/40",
              value[index]
                ? "border-primary/60 bg-primary/5 text-primary shadow-sm"
                : "text-foreground"
            )}
          />
          {/* Separator dash after the 3rd digit */}
          {index === 2 && (
            <span className="text-muted-foreground/40 font-medium text-lg px-0.5">–</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
OTPInput.displayName = "OTPInput"
