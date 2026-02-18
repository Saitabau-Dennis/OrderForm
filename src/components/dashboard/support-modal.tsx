"use client";

import { useState } from "react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/dashboard/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface SupportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SUPPORT_EMAIL = "support@orderform.store";

export function SupportModal({ open, onOpenChange }: SupportModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSubject("");
      setMessage("");
    }
    onOpenChange(nextOpen);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();

    if (!cleanSubject || !cleanMessage) {
      toast.error("Please add a subject and message.");
      return;
    }

    const body = `${cleanMessage}\n\n---\nSent from OrderForm dashboard support modal.`;
    const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      cleanSubject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;
    toast.success("Opening your email app...");
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[520px] rounded-2xl border border-border bg-card p-0 shadow-xl">
        <DialogHeader className="border-b border-border/70 px-6 pb-4 pt-6 text-left">
          <DialogTitle className="text-xl font-semibold tracking-tight text-foreground">
            Contact Support
          </DialogTitle>
          <DialogDescription className="pt-1 text-sm leading-relaxed text-muted-foreground">
            Send us details about your issue and we&apos;ll get back to you as quickly as possible.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <div className="rounded-lg border border-border/70 bg-muted/[0.03] px-3.5 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Support Email
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="mt-1 inline-block text-sm font-medium text-foreground hover:text-primary"
            >
              {SUPPORT_EMAIL}
            </a>
          </div>

          <div className="space-y-2">
            <Label htmlFor="support-subject" className="text-sm font-normal text-muted-foreground">
              Subject
            </Label>
            <Input
              id="support-subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="e.g. Issue with payment confirmation"
              className="h-11 rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="support-message" className="text-sm font-normal text-muted-foreground">
              Message
            </Label>
            <Textarea
              id="support-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Describe your issue in detail..."
              className="min-h-[130px] resize-none rounded-lg"
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border/70 pt-4">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-lg px-4"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="h-10 rounded-lg px-5">
              Send Message
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
