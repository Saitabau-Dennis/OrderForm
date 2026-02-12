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
  ChevronRight,
  ChevronDown,
  ChevronUp,
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
import BoringAvatar from "boring-avatars";

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
    <div className="flex h-full flex-col text-foreground p-4 pb-5">
      {/* Store Header */}
      <div className="mb-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full rounded-lg border p-2.5 hover:bg-foreground/[0.03] transition-all duration-150 cursor-pointer group focus:outline-none">
              <div className="shrink-0">
                <BoringAvatar
                  size={28}
                  name={store?.name || "My Store"}
                  variant="marble"
                  colors={["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"]}
                />
              </div>
              <span className="truncate text-sm font-normal text-foreground flex-1 text-left">
                {store?.name || "My Store"}
              </span>
              <div className="flex flex-col shrink-0 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors">
                <ChevronUp className="h-3 w-3 -mb-0.5" />
                <ChevronDown className="h-3 w-3 -mt-0.5" />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" sideOffset={4} className="w-[240px] bg-white rounded-lg border shadow-md p-1.5 font-poppins">
             <div className="px-2 py-1.5">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Stores</p>
             </div>
             <DropdownMenuItem className="focus:bg-muted/50 cursor-pointer gap-2.5 px-2.5 py-2.5 rounded-md">
                <div className="shrink-0">
                  <BoringAvatar
                    size={22}
                    name={store?.name || "My Store"}
                    variant="marble"
                    colors={["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"]}
                  />
                </div>
                <span className="text-sm font-normal text-foreground truncate flex-1">{store?.name || "My Store"}</span>
                <Check className="h-3.5 w-3.5 text-primary shrink-0" />
             </DropdownMenuItem>
             <DropdownMenuSeparator className="bg-border/60 my-1" />
             <DropdownMenuItem className="focus:bg-muted/50 cursor-pointer gap-2.5 px-2.5 py-2.5 rounded-md text-muted-foreground hover:text-foreground">
                <div className="h-[22px] w-[22px] rounded-full border border-dashed border-muted-foreground/30 flex items-center justify-center">
                  <Plus className="h-3 w-3" />
                </div>
                <span className="text-sm font-normal">New store</span>
             </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <nav className="space-y-1.5 flex-1">
        {routes.map((route) => (
          <Link
            key={route.label}
            href={route.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-normal transition-all duration-200 group relative",
              route.active
                ? "bg-primary text-primary-foreground shadow-sm font-medium"
                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
              route.comingSoon && "opacity-70 cursor-not-allowed"
            )}
            onClick={(e) => {
              if (route.comingSoon) e.preventDefault();
              else setIsMobileMenuOpen(false);
            }}
          >
            <route.icon className={cn("h-[22px] w-[22px]", route.active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
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
            <button className="flex items-center gap-3 rounded-md p-2.5 hover:bg-foreground/[0.04] transition-all duration-150 cursor-pointer w-full group focus:outline-none">
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
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-light">
            <Link href="/dashboard" className="hover:text-primary transition-colors font-normal">
                Home
            </Link>
            {path.map((segment, index) => {
                const isLast = index === path.length - 1;
                const href = `/${path.slice(0, index + 1).join("/")}`;

                return (
                    <div key={segment} className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
                        {isLast ? (
                            <span className="font-normal text-foreground capitalize">
                                {segment}
                            </span>
                        ) : (
                            <Link
                                href={href}
                                className="hover:text-primary transition-colors capitalize font-normal"
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
      <aside className="hidden w-72 border-r border-sidebar-border bg-white md:block fixed inset-y-0 left-0 z-30">
        <SidebarContent user={user} store={store} setIsMobileMenuOpen={setIsMobileMenuOpen} setShowSupportModal={setShowSupportModal} />
      </aside>

      <div className="flex w-full flex-col md:pl-72 transition-all duration-300">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between bg-white px-6 md:px-8">
          {/* Left — Breadcrumb + mobile menu */}
          <div className="flex items-center gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-foreground hover:bg-foreground/10 rounded-md">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 border-r-0 bg-background text-foreground">
                <SidebarContent user={user} store={store} setIsMobileMenuOpen={setIsMobileMenuOpen} setShowSupportModal={setShowSupportModal} />
              </SheetContent>
            </Sheet>

            <div className="flex items-center">
              {getBreadcrumb()}
            </div>
          </div>

          {/* Right — Search + View Store */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                className="w-[260px] h-9 pl-9 pr-3 text-sm font-normal border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:text-muted-foreground/40"
              />
            </div>

            <a
              href={`/${store?.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-9 px-4 text-sm font-normal border rounded-md hover:bg-muted/50 transition-colors text-foreground"
            >
              View Store
              <Store className="h-4 w-4 text-muted-foreground" />
            </a>
          </div>
        </header>

        <main className="flex-1 w-full p-4 md:px-10 md:py-3 mx-auto animate-appear">
          {children}
        </main>
      </div>

      <SupportModal open={showSupportModal} onOpenChange={setShowSupportModal} />
    </div>
  );
}