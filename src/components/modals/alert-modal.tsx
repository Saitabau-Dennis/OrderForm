"use client";

import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/dashboard/button";
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

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onChange}>
      <AlertDialogContent className="rounded-2xl border-2 border-zinc-200 shadow-xl sm:max-w-[420px] p-6 gap-0 bg-card">
        <AlertDialogHeader className="space-y-2 pb-4">
          <AlertDialogTitle className="text-lg font-normal tracking-tight text-foreground">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm font-normal text-muted-foreground leading-relaxed">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-row justify-end gap-3 pt-2 sm:space-x-0">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={onClose}
            className="rounded-lg h-9 px-4 border-2 border-zinc-300 bg-background hover:bg-zinc-100 text-foreground text-sm font-medium transition-colors"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            disabled={loading}
            onClick={handleConfirm}
            className={cn(
              "rounded-lg h-9 px-4 text-sm font-medium shadow-none transition-colors border-2",
              isDestructive
                ? "bg-red-600 hover:bg-red-700 text-white border-red-600"
                : "bg-primary hover:bg-primary/90 text-primary-foreground border-primary"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                Processing...
              </>
            ) : confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
