"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/dashboard/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LifeBuoy, SendHorizonal } from "lucide-react";

interface SupportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SupportModal({ open, onOpenChange }: SupportModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-card border-4 border-dotted border-primary/40 shadow-2xl rounded-3xl p-0 overflow-hidden">
        <div className="bg-primary/5 p-8 pb-6 border-b-2 border-dotted border-border">
            <div className="mx-auto w-12 h-12 bg-card rounded-3xl border-2 border-dotted border-primary/20 flex items-center justify-center mb-4 shadow-sm">
                <LifeBuoy className="h-6 w-6 text-primary" />
            </div>
            <DialogHeader>
            <DialogTitle className="text-2xl font-medium text-center font-poppins text-primary uppercase tracking-tight">Contact Support</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground font-poppins text-base mt-2">
                We&apos;re here to help. Send us a message and we&apos;ll get back to you shortly.
            </DialogDescription>
            </DialogHeader>
        </div>

        <div className="p-8 pt-6 grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="subject" className="font-medium text-primary uppercase text-[10px] tracking-widest">Subject</Label>
            <Input id="subject" placeholder="e.g. Issue with payment" className="bg-secondary border-2 border-dotted border-border focus:bg-card focus:border-primary/30 transition-all h-11 rounded-3xl px-4" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message" className="font-medium text-primary uppercase text-[10px] tracking-widest">Message</Label>
            <Textarea id="message" placeholder="Describe your issue..." className="min-h-[120px] bg-secondary border-2 border-dotted border-border focus:bg-card focus:border-primary/30 transition-all rounded-3xl resize-none p-4" />
          </div>
          
          <Button className="w-full h-12 rounded-3xl text-base font-medium shadow-lg shadow-primary/10 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all bg-primary text-primary-foreground border-2 border-white/10">
            <SendHorizonal className="mr-2 h-5 w-5" />
            Send Message
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
