"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  Home, 
  Package, 
  Settings, 
  ShoppingBag, 
  LogOut, 
  Menu, 
  ExternalLink, 
  ChevronRight, 
  ChevronDown, 
  LifeBuoy, 
  Plus, 
  BarChart3,
  Users,
  Store,
  MoreHorizontal,
  Check 
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/dashboard/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { SupportModal } from "@/components/dashboard/support-modal";
import { signOut } from "next-auth/react";

interface DashboardShellProps {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  store: {
    name: string;
    slug: string;
    configured: boolean;
  } | null;
}

interface SidebarContentProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  store: {
    name: string;
    slug: string;
    configured: boolean;
  } | null;
  setIsMobileMenuOpen: (open: boolean) => void;
  setShowSupportModal: (open: boolean) => void;
}

const SidebarContent = ({ user, store, setIsMobileMenuOpen, setShowSupportModal }: SidebarContentProps) => {
  const pathname = usePathname();
  
  const routes = [
    { label: "Overview", icon: Home, href: "/dashboard", active: pathname === "/dashboard" },
    { label: "Products", icon: Package, href: "/products", active: pathname === "/products" },
    { label: "Orders", icon: ShoppingBag, href: "/orders", active: pathname === "/orders" },
    { label: "Customers", icon: Users, href: "/customers", active: pathname === "/customers" },
    { label: "Analytics", icon: BarChart3, href: "#", active: false, comingSoon: true },
    { label: "Settings", icon: Settings, href: "/settings", active: pathname === "/settings" },
  ];

  return (
    <div className="flex h-full flex-col text-foreground p-5 pb-6">
      {/* Store Header */}
      <div className="mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full rounded-xl p-3 hover:bg-foreground/[0.04] transition-all duration-150 cursor-pointer group focus:outline-none">
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <Store className="h-4.5 w-4.5 text-primary-foreground" />
              </div>
              <div className="flex-1 overflow-hidden text-left">
                <p className="truncate text-sm font-semibold text-foreground leading-tight">
                  {store?.name || "My Store"}
                </p>
                <p className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5">{store?.slug ? `orderform.co/${store.slug}` : "Free plan"}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" sideOffset={4} className="w-[260px] bg-white rounded-xl border border-black/[0.06] shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-1 font-poppins">
             <div className="px-2.5 py-2">
                <p className="text-[11px] font-semibold text-foreground/40 uppercase tracking-wider">Stores</p>
             </div>
             <DropdownMenuItem className="focus:bg-foreground/[0.03] cursor-pointer gap-2.5 px-2.5 py-2 rounded-lg">
                <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center shrink-0">
                  <Store className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <span className="text-sm font-semibold text-foreground truncate flex-1">{store?.name || "My Store"}</span>
                <Check className="h-3.5 w-3.5 text-foreground/40 shrink-0" />
             </DropdownMenuItem>
             <DropdownMenuSeparator className="bg-black/[0.04] my-1 mx-1" />
             <DropdownMenuItem className="focus:bg-foreground/[0.03] cursor-pointer gap-2.5 px-2.5 py-2 rounded-lg text-foreground/50 hover:text-foreground">
                <div className="h-7 w-7 rounded-md border border-dashed border-black/10 flex items-center justify-center">
                  <Plus className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm font-semibold">New store</span>
             </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {routes.map((route) => (
          <Link
            key={route.label}
            href={route.href}
            className={cn(
              "flex items-center gap-4 rounded-3xl px-4 py-3.5 text-base font-medium transition-all duration-200 group relative",
              route.active
                ? "bg-primary text-primary-foreground shadow-lg font-semibold"
                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
              route.comingSoon && "opacity-70 cursor-not-allowed"
            )}
            onClick={(e) => {
              if (route.comingSoon) e.preventDefault();
              else setIsMobileMenuOpen(false);
            }}
          >
            <route.icon className={cn("h-5 w-5", route.active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
            <span className="font-poppins tracking-wide">{route.label}</span>
            {route.comingSoon && (
              <span className="ml-auto text-[10px] uppercase font-bold bg-foreground/10 px-2 py-0.5 rounded">Soon</span>
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom Profile Section */}
      <div className="mt-auto border-t border-border/60 pt-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-foreground/[0.04] transition-all duration-150 cursor-pointer w-full group focus:outline-none">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.image || ""} className="rounded-lg" />
                <AvatarFallback className="bg-foreground/10 text-foreground text-xs font-semibold rounded-lg">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden text-left">
                <p className="truncate text-sm font-medium text-foreground leading-tight">{user.name || "User"}</p>
                <p className="truncate text-[11px] text-muted-foreground leading-tight mt-0.5">{user.email}</p>
              </div>
              <MoreHorizontal className="h-4 w-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" sideOffset={4} className="w-[240px] bg-white rounded-xl border border-black/[0.06] shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-1.5 font-poppins">
            <div className="px-2.5 pt-1 pb-2">
              <p className="text-sm font-bold text-foreground">{user.name}</p>
              <p className="text-xs font-medium text-foreground/50 mt-0.5">{user.email}</p>
            </div>
            <DropdownMenuSeparator className="bg-black/[0.05] my-1" />
            <DropdownMenuItem className="focus:bg-foreground/[0.04] cursor-pointer px-2.5 py-2 rounded-lg" onSelect={() => setShowSupportModal(true)}>
              <span className="text-sm font-semibold text-foreground/70">Help & Support</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-red-50 cursor-pointer px-2.5 py-2 rounded-lg" onSelect={() => signOut({ callbackUrl: "/login" })}>
              <span className="text-sm font-semibold text-red-500">Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export function DashboardShell({ children, user, store }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  useEffect(() => {
    // Redirect logic removed to prepare for onboarding flow
  }, [pathname, router, store]);

  const getBreadcrumb = () => {
    const path = pathname.split("/").filter(Boolean);
    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/dashboard" className="hover:text-primary transition-colors font-medium">
                Home
            </Link>
            {path.map((segment, index) => {
                const isLast = index === path.length - 1;
                const href = `/${path.slice(0, index + 1).join("/")}`;

                return (
                    <div key={segment} className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
                        {isLast ? (
                            <span className="font-semibold text-primary capitalize">
                                {segment}
                            </span>
                        ) : (
                            <Link
                                href={href}
                                className="hover:text-primary transition-colors capitalize font-medium"
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
    <div className="flex min-h-screen bg-background text-foreground font-poppins">
      <aside className="hidden w-80 border-r border-sidebar-border bg-sidebar md:block fixed inset-y-0 left-0 z-30">
        <SidebarContent user={user} store={store} setIsMobileMenuOpen={setIsMobileMenuOpen} setShowSupportModal={setShowSupportModal} />
      </aside>

      <div className="flex w-full flex-col md:pl-80 transition-all duration-300">
        <header className="sticky top-0 z-20 flex h-24 items-center justify-between bg-background/80 px-6 md:px-10 backdrop-blur-xl">
          <div className="flex items-center gap-6">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-foreground hover:bg-foreground/10 rounded-2xl">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80 border-r-0 bg-sidebar text-foreground">
                <SidebarContent user={user} store={store} setIsMobileMenuOpen={setIsMobileMenuOpen} setShowSupportModal={setShowSupportModal} />
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center">
              {getBreadcrumb()}
            </div>
          </div>

          {store?.slug && (
            <Button className="gap-2 rounded-3xl bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-none h-12 px-8" asChild>
              <a href={`/${store.slug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 text-primary-foreground" />
                <span className="font-bold tracking-tight text-primary-foreground">View Store</span>
              </a>
            </Button>
          )}
        </header>

        <main className="flex-1 w-full p-4 md:px-10 md:py-8 mx-auto animate-appear">
          {children}
        </main>
      </div>

      <SupportModal open={showSupportModal} onOpenChange={setShowSupportModal} />
    </div>
  );
}