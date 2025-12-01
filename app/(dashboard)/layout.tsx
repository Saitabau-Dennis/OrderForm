"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Home, Package, Settings, ShoppingBag, LogOut, Menu, ExternalLink, User, ChevronRight, LifeBuoy, Sparkles, Plus, BarChart3 } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { UpgradeModal } from "@/components/dashboard/upgrade-modal";
import { SupportModal } from "@/components/dashboard/support-modal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  const routes = [
    {
      label: "Overview",
      icon: Home,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Products",
      icon: Package,
      href: "/products",
      active: pathname === "/products",
    },
    {
      label: "Orders",
      icon: ShoppingBag,
      href: "/orders",
      active: pathname === "/orders",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: "/analytics",
      active: pathname === "/analytics",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      active: pathname === "/settings",
    },
  ];

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex flex-col h-full p-6 pb-8">
        <div className="mb-8">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/50 border border-sidebar-border p-3 hover:bg-sidebar-accent transition-colors cursor-pointer w-full group">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-white text-xs">S</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden text-left">
                  <p className="truncate text-sm font-medium text-white group-hover:text-white/90 transition-colors font-raleway">Saitabau</p>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-500 rotate-90" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-60 bg-sidebar border-sidebar-border text-sidebar-foreground">
               <DropdownMenuSeparator className="bg-sidebar-border" />
               <DropdownMenuItem className="focus:bg-sidebar-accent focus:text-sidebar-foreground cursor-pointer gap-2">
                  <div className="h-6 w-6 rounded-full border border-sidebar-border flex items-center justify-center bg-sidebar-accent">
                    <Plus className="h-4 w-4" />
                  </div>
                  <span className="font-raleway">Add store</span>
               </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-1">
             <nav className="space-y-1">
                {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
                    route.active
                        ? "bg-sidebar-accent text-sidebar-foreground shadow-sm"
                        : "hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <route.icon className={cn("h-4 w-4", route.active ? "text-sidebar-foreground" : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground")} />
                    <span className="font-instrument-sans">{route.label}</span>
                </Link>
                ))}
            </nav>
        </div>

        <div className="mt-auto space-y-4 px-6 pb-6">


            {/* Profile Dropdown */}
            <div className="border-t border-sidebar-border pt-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 p-3 hover:bg-sidebar-accent transition-colors cursor-pointer w-full">
                            <Avatar className="h-9 w-9 border border-sidebar-border">
                                <AvatarImage src="" />
                                <AvatarFallback className="bg-sidebar-accent text-sidebar-foreground text-lg">🧑‍💼</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 overflow-hidden text-left">
                                <p className="truncate text-sm font-medium text-sidebar-foreground">Store Owner</p>
                                <p className="truncate text-xs text-sidebar-foreground/70">owner@example.com</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-sidebar-foreground/50" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-sidebar border-sidebar-border text-sidebar-foreground">
                        <DropdownMenuLabel className="text-sidebar-foreground/70">My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-sidebar-border" />
                        <DropdownMenuItem className="focus:bg-sidebar-accent focus:text-sidebar-foreground cursor-pointer" onSelect={() => setShowUpgradeModal(true)}>
                            <Sparkles className="mr-2 h-4 w-4" />
                            <span>Upgrade</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-sidebar-accent focus:text-sidebar-foreground cursor-pointer" onSelect={() => setShowSupportModal(true)}>
                            <LifeBuoy className="mr-2 h-4 w-4" />
                            <span>Support</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-sidebar-border" />
                        <DropdownMenuItem className="text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
      </div>
    </div>
  );

  const getBreadcrumb = () => {
    const path = pathname.split("/").filter(Boolean);
    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
                Account
            </Link>
            {path.map((segment, index) => {
                const isLast = index === path.length - 1;
                const href = `/${path.slice(0, index + 1).join("/")}`;

                return (
                    <div key={segment} className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                        {isLast ? (
                            <span className="font-medium text-foreground capitalize">
                                {segment}
                            </span>
                        ) : (
                            <Link
                                href={href}
                                className="hover:text-foreground transition-colors capitalize"
                            >
                                {segment}
                            </Link>
                        )}
                    </div>
                );
            })}
        </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-background font-raleway">
      {/* Desktop Sidebar */}
      <aside className="hidden w-72 border-r border-sidebar-border bg-sidebar md:block fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex w-full flex-col md:pl-72">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 border-r-sidebar-border bg-sidebar">
                <SidebarContent />
              </SheetContent>
            </Sheet>

            <div className="flex items-center text-sm">
              {getBreadcrumb()}
            </div>
          </div>

          <Button variant="outline" size="sm" className="gap-2" asChild>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              View Live Store
            </a>
          </Button>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 py-6 w-full">
          {children}
        </main>
      </div>

      <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
      <SupportModal open={showSupportModal} onOpenChange={setShowSupportModal} />
    </div>
  );
}
