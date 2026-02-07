"use client";

import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  title: string;
  description: string;
  variant?: "destructive" | "default" | "success";
  confirmText?: string;
  cancelText?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title,
  description,
  variant = "destructive",
  confirmText = "Confirm",
  cancelText = "Cancel"
}) => {
  const onChange = (open: boolean) => {
    if (!open) onClose();
  };

  const isDestructive = variant === "destructive";

  return (
    <AlertDialog open={isOpen} onOpenChange={onChange}>
      <AlertDialogContent className="rounded-2xl border border-border shadow-xl sm:max-w-[420px] p-6 gap-0 bg-card">
        <AlertDialogHeader className="space-y-2 pb-4">
          <AlertDialogTitle className="text-lg font-semibold tracking-tight text-foreground font-poppins">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground font-poppins leading-relaxed">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-row justify-end gap-3 pt-2 sm:space-x-0">
          <AlertDialogCancel
            disabled={loading}
            className="rounded-lg h-9 px-4 border border-border bg-background hover:bg-accent text-foreground text-sm font-medium mt-0 transition-colors"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={loading}
            className={cn(
              "rounded-lg h-9 px-4 text-sm font-medium shadow-none transition-colors",
              isDestructive
                ? "bg-pink-500 hover:bg-pink-600 text-white border-none"
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                Processing...
              </>
            ) : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
