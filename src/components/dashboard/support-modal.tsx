import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare } from "lucide-react";

interface SupportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SupportModal({ open, onOpenChange }: SupportModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-heading">Contact Support</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Need help? Send us a message or join our community.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="What can we help you with?" className="bg-background" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Describe your issue..." className="min-h-[100px] bg-background" />
          </div>
          <Button className="w-full font-bold">
            <Mail className="mr-2 h-4 w-4" />
            Send Message
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or join community</span>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            <MessageSquare className="mr-2 h-4 w-4" />
            Join Discord Server
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
