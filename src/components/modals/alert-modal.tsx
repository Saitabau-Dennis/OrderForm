"use client";

import { Loader2, Trash2, AlertTriangle, CheckCircle } from "lucide-react";
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
  const isSuccess = variant === "success";

  return (
    <AlertDialog open={isOpen} onOpenChange={onChange}>
      <AlertDialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden sm:max-w-[400px]">
        {/* Header Section */}
        <div
            className={cn(
                "p-8 text-center text-white relative overflow-hidden",
                isDestructive ? "bg-red-600" : isSuccess ? "bg-[#00311F]" : "bg-primary"
            )}
        >
            {/* Background Pattern */}
             <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-32 h-32 rounded-full bg-white blur-2xl" />
                <div className="absolute bottom-[-20%] left-[-10%] w-32 h-32 rounded-full bg-white blur-2xl" />
             </div>

            {isDestructive ? (
                 <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-inner">
                    <Trash2 className="h-7 w-7 text-white" />
                 </div>
            ) : isSuccess ? (
                 <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-inner">
                    <CheckCircle className="h-7 w-7 text-white" />
                 </div>
            ) : (
                 <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-inner">
                    <AlertTriangle className="h-7 w-7 text-white" />
                 </div>
            )}

            <AlertDialogTitle className="text-2xl font-bold font-sora tracking-tight leading-tight">
                {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/80 mt-2 font-instrument-sans text-sm leading-relaxed max-w-[280px] mx-auto">
                {description}
            </AlertDialogDescription>
        </div>

        {/* Action Section */}
        <div className="p-6 bg-white space-y-3">
          <AlertDialogFooter className="grid grid-cols-2 gap-3 sm:space-x-0">
             <AlertDialogCancel
                disabled={loading}
                className="rounded-xl h-12 border-none bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold mt-0 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
                    "rounded-xl h-12 font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]",
                    isDestructive
                        ? "bg-red-600 hover:bg-red-700 text-white shadow-red-200"
                        : isSuccess
                        ? "bg-[#00311F] hover:bg-[#004D31] text-white shadow-green-200"
                        : "bg-primary hover:bg-primary/90 text-white"
                )}
            >
              {loading ? (
                  <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     Processing...
                  </>
               ) : confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
