import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpgradeModal({ open, onOpenChange }: UpgradeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center font-heading">Upgrade to Pro</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Unlock all features and remove limits.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center p-6 bg-primary/5 rounded-xl border border-primary/10">
            <div className="text-center">
              <span className="text-3xl font-bold text-primary">KES 499</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </div>
          <div className="space-y-2">
            {[
              "Unlimited Products",
              "Analytics (See how many people viewed your store)",
              "Priority WhatsApp Support",
              "Multiple Delivery Zones (Auto-calculate delivery fees)"
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
            <Button className="w-full font-bold" size="lg">Upgrade Now</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
