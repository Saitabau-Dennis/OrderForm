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
  LifeBuoy, 
  Sparkles, 
  Plus, 
  BarChart3,
  Users 
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
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
    <div className="flex h-full flex-col text-white p-6 pb-8">
      {/* Store Switcher */}
      <div className="mb-8">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-4 rounded-xl bg-white/10 border border-white/10 p-4 hover:bg-white/20 transition-colors cursor-pointer w-full group">
              <Avatar className="h-10 w-10 border-2 border-white/20">
                <AvatarImage src={user.image || ""} />
                <AvatarFallback className="bg-primary-foreground text-primary font-bold">
                  {user.name?.charAt(0).toUpperCase() || "S"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden text-left">
                <p className="truncate text-base font-semibold text-white group-hover:text-white/90 transition-colors font-raleway">
                  {store?.name || user.name || "My Store"}
                </p>
                <p className="text-xs text-white/60 truncate">Store Management</p>
              </div>
              <ChevronRight className="h-5 w-5 text-white/60 rotate-90" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-72 bg-white border-none shadow-2xl rounded-xl p-2">
             <div className="px-3 py-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Switch Store</p>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium text-primary truncate flex-1">{store?.name || "My Store"}</span>
                  <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">Active</span>
                </div>
             </div>
             <DropdownMenuSeparator className="bg-gray-100 my-1" />
             <DropdownMenuItem className="focus:bg-primary/5 focus:text-primary cursor-pointer gap-3 p-3 rounded-lg mx-1">
                <div className="h-8 w-8 rounded-full border border-dashed border-primary/30 flex items-center justify-center bg-white text-primary">
                  <Plus className="h-4 w-4" />
                </div>
                <span className="font-medium">Create new store</span>
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
              "flex items-center gap-4 rounded-xl px-4 py-3.5 text-base font-medium transition-all duration-200 group relative",
              route.active
                ? "bg-white text-primary shadow-lg font-semibold"
                : "text-white/80 hover:bg-white/10 hover:text-white",
              route.comingSoon && "opacity-70 cursor-not-allowed"
            )}
            onClick={(e) => {
              if (route.comingSoon) e.preventDefault();
              else setIsMobileMenuOpen(false);
            }}
          >
            <route.icon className={cn("h-5 w-5", route.active ? "text-primary" : "text-white/80 group-hover:text-white")} />
            <span className="font-instrument-sans tracking-wide">{route.label}</span>
            {route.comingSoon && (
              <span className="ml-auto text-[10px] uppercase font-bold bg-white/20 px-2 py-0.5 rounded">Soon</span>
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom Profile Section */}
      <div className="mt-auto border-t border-white/10 pt-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 rounded-xl p-3 hover:bg-white/10 transition-colors cursor-pointer w-full group relative">
              <Avatar className="h-10 w-10 border border-white/20 shadow-md">
                <AvatarImage src={user.image || ""} />
                <AvatarFallback className="bg-white/10 text-white font-medium">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden text-left">
                <p className="truncate text-sm font-medium text-white group-hover:text-white/90">{user.name || "User"}</p>
                <p className="truncate text-xs text-white/50">{user.email}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-white/70" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 bg-white border-none shadow-2xl rounded-2xl p-2 mb-2">
            <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl mb-2">
              <Avatar className="h-10 w-10 border border-white shadow-sm">
                <AvatarImage src={user.image || ""} />
                <AvatarFallback className="bg-primary text-white">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <p className="font-semibold text-primary truncate text-sm">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator className="bg-gray-100 my-1" />
            <DropdownMenuItem className="focus:bg-primary/5 focus:text-primary cursor-pointer p-3 rounded-lg mx-1 my-0.5" onSelect={() => setShowSupportModal(true)}>
              <LifeBuoy className="h-4 w-4 mr-3 text-teal-600" />
              <div className="flex flex-col">
                <span className="font-medium text-sm">Help & Support</span>
                <span className="text-[10px] text-muted-foreground">Contact us</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-100 my-1" />
            <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer p-3 rounded-lg mx-1 my-0.5" onSelect={() => signOut({ callbackUrl: "/login" })}>
              <LogOut className="h-4 w-4 mr-3" />
              <span className="font-medium text-sm">Sign out</span>
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
    <div className="flex min-h-screen bg-primary/5 font-raleway">
      <aside className="hidden w-80 border-r border-primary/10 bg-primary md:block fixed inset-y-0 left-0 z-30 shadow-xl">
        <SidebarContent user={user} store={store} setIsMobileMenuOpen={setIsMobileMenuOpen} setShowSupportModal={setShowSupportModal} />
      </aside>

      <div className="flex w-full flex-col md:pl-80 transition-all duration-300">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-primary/10 bg-primary/5 px-8 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-primary hover:bg-primary/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80 border-r-0 bg-primary text-white">
                <SidebarContent user={user} store={store} setIsMobileMenuOpen={setIsMobileMenuOpen} setShowSupportModal={setShowSupportModal} />
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center">
              {getBreadcrumb()}
            </div>
          </div>

          {store?.slug && (
            <Button className="gap-2 rounded-xl bg-primary text-white hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 h-11 px-6" asChild>
              <a href={`/${store.slug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 text-white" />
                <span className="font-bold tracking-tight text-white">View Store</span>
              </a>
            </Button>
          )}
        </header>

        <main className="flex-1 w-full p-4 md:p-6 max-w-7xl mx-auto animate-appear">
          {children}
        </main>
      </div>

      <SupportModal open={showSupportModal} onOpenChange={setShowSupportModal} />
    </div>
  );
}