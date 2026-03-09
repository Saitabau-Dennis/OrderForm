"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  inputClassName?: string;
  separatorClassName?: string;
  disabled?: boolean;
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  className,
  inputClassName,
  separatorClassName,
  disabled,
}: OTPInputProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = React.useState<number | null>(null);

  const focus = (i: number) => inputRefs.current[i]?.focus();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const raw = e.target.value;
    if (!/^\d*$/.test(raw)) return;

    if (raw.length > 1) {
      const pasted = raw.slice(0, length);
      onChange(pasted);
      focus(Math.min(pasted.length, length - 1));
      return;
    }

    const chars = value.split("");
    chars[index] = raw;
    onChange(chars.join("").slice(0, length));
    if (raw && index < length - 1) focus(index + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        focus(index - 1);
        const chars = value.split("");
        chars[index - 1] = "";
        onChange(chars.join(""));
      } else {
        const chars = value.split("");
        chars[index] = "";
        onChange(chars.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      focus(index - 1);
    } else if (e.key === "ArrowRight" && index < length - 1) {
      focus(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(pasted)) return;
    onChange(pasted);
    focus(Math.min(pasted.length, length - 1));
  };

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {Array.from({ length }).map((_, index) => {
        const filled = Boolean(value[index]);
        const focused = focusedIndex === index;

        return (
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
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              disabled={disabled}
              className={cn(
                // size & shape
                "w-10 h-11 text-center text-base font-semibold rounded-lg",
                // transitions
                "transition-all duration-150 outline-none",
                // base - always visible border
                "border bg-background",
                // idle
                !filled && !focused && "border-border text-foreground",
                // focused (empty or filled)
                focused && "border-primary ring-2 ring-primary/20 text-foreground",
                // filled & not focused
                filled && !focused && "border-primary/50 bg-primary/5 text-primary",
                // disabled
                disabled && "opacity-40 cursor-not-allowed",
                inputClassName
              )}
            />

            {/* dash separator between positions 3 and 4 */}
            {index === 2 && (
              <span className={cn("text-border select-none text-sm font-medium px-0.5", separatorClassName)}>—</span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

OTPInput.displayName = "OTPInput";
