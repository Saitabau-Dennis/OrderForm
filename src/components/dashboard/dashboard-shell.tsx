"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Package,
  Settings,
  ShoppingCart,
  Menu,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,

  Users,
  Store,
  Home,
  MoreHorizontal,
  Check,
  CircleAlert
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/dashboard/dashboard-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import BoringAvatar from "boring-avatars";

const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "")
  .replace(/^https?:\/\//i, "")
  .replace(/\/.*$/, "")
  .toLowerCase();

const CAN_USE_SUBDOMAIN_URLS =
  Boolean(ROOT_DOMAIN) && !ROOT_DOMAIN.endsWith(".vercel.app");

const getDashboardBaseUrl = () => {
  if (CAN_USE_SUBDOMAIN_URLS) return `https://app.${ROOT_DOMAIN}`;
  return "";
};

const getStoreUrl = (slug: string, rootDomain: string) => {
  if (CAN_USE_SUBDOMAIN_URLS && rootDomain) return `https://${slug}.${rootDomain}`;
  return `/${slug}`;
};

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
    hasFirstProduct: boolean;
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
    hasFirstProduct: boolean;
  } | null;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const SidebarContent = ({ user, store, setIsMobileMenuOpen }: SidebarContentProps) => {
  const pathname = usePathname();

  const routes = [
    { label: "Overview", icon: Home, href: "/dashboard", active: pathname === "/dashboard" },
    { label: "Products", icon: Package, href: "/products", active: pathname === "/products" },
    { label: "Orders", icon: ShoppingCart, href: "/orders", active: pathname === "/orders" },
    { label: "Customers", icon: Users, href: "/customers", active: pathname === "/customers" },

    { label: "Settings", icon: Settings, href: "/settings", active: pathname === "/settings" },
  ];

  return (
    <div className="flex h-full flex-col text-foreground p-4 pb-5">
      {/* Store Header */}
      <div className="mb-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-auto w-full cursor-pointer items-center gap-3 rounded-xl border border-border bg-card p-2.5 text-foreground transition-all duration-200 hover:bg-muted focus:outline-none"
            >
              <div className="shrink-0">
                <BoringAvatar
                  size={28}
                  name={store?.name || "My Store"}
                  variant="marble"
                  colors={["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"]}
                />
              </div>
              <span className="flex-1 truncate text-left text-sm font-normal text-foreground">
                {store?.name || "My Store"}
              </span>
              <div className="flex shrink-0 flex-col text-muted-foreground transition-colors group-hover:text-foreground">
                <ChevronUp className="h-3 w-3 -mb-0.5" />
                <ChevronDown className="h-3 w-3 -mt-0.5" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" sideOffset={4} className="w-[240px] font-poppins">
             <div className="px-3 py-2">
                <p className="text-[11px] font-normal uppercase tracking-[0.16em] text-muted-foreground">Stores</p>
             </div>
             <DropdownMenuItem className="gap-2.5">
                <div className="shrink-0">
                  <BoringAvatar
                    size={22}
                    name={store?.name || "My Store"}
                    variant="marble"
                    colors={["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"]}
                  />
                </div>
                <span className="flex-1 truncate text-sm font-normal text-foreground">{store?.name || "My Store"}</span>
                <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
             </DropdownMenuItem>
             <DropdownMenuSeparator />
             <DropdownMenuItem className="gap-2.5 text-muted-foreground">
                <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full border border-dashed border-border">
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
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-normal transition-all duration-200 group relative",
              route.active
                ? "bg-primary text-primary-foreground font-normal shadow-none"
                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
            )}
            onClick={() => {
              setIsMobileMenuOpen(false);
            }}
          >
            <route.icon className={cn("h-[22px] w-[22px]", route.active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
            <span className="font-poppins tracking-wide">{route.label}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom Profile Section */}
      <div className="mt-auto border-t border-border/60 pt-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="group flex h-auto w-full cursor-pointer items-center gap-3  bg-card p-2.5 text-left text-foreground transition-colors hover:bg-muted focus:outline-none"
            >
              <Avatar className="h-10 w-10 rounded-none bg-muted/50">
                <AvatarImage
                  src={`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${user.name || "User"}&backgroundColor=e9c46a,2a9d8f,264653`}
                  className="rounded-none object-cover"
                />
                <AvatarFallback className="rounded-none bg-muted text-xs font-normal text-foreground">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden text-left">
                <p className="truncate text-sm font-normal leading-tight text-foreground">{user.name || "User"}</p>
                <p className="mt-0.5 truncate text-xs leading-tight text-muted-foreground">{user.email}</p>
              </div>
              <MoreHorizontal className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            side="top"
            sideOffset={6}
            className="w-[236px] font-poppins"
          >
            <div className="rounded-xl px-3 py-2.5">
              <p className="truncate text-base font-normal leading-tight text-foreground">{user.name || "User"}</p>
              <p className="mt-0.5 truncate text-xs font-normal text-muted-foreground">{user.email}</p>
            </div>
            <DropdownMenuItem
              className="text-red-500 focus:bg-red-50 focus:text-red-500"
              onSelect={() => signOut({ callbackUrl: `${getDashboardBaseUrl()}/login` })}
            >
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export function DashboardShell({ children, user, store }: DashboardShellProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const publicStoreUrl = store?.slug ? getStoreUrl(store.slug, ROOT_DOMAIN) : null;
  const onboardingComplete = Boolean(store?.configured && store?.hasFirstProduct);
  const showSetupReminder =
    !onboardingComplete &&
    pathname !== "/dashboard" &&
    pathname !== "/settings" &&
    pathname !== "/products/new";
  const nextSetupStep = store?.configured
    ? { href: "/products/new", label: "Add First Product" }
    : { href: "/settings", label: "Configure Store" };

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
      <aside className="hidden w-72 border-r border-border bg-white md:block fixed inset-y-0 left-0 z-30">
        <SidebarContent
          user={user}
          store={store}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      </aside>

      <div className="flex w-full flex-col md:pl-72 transition-all duration-300">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between bg-white px-6 md:px-8">
          {/* Left — Breadcrumb + mobile menu */}
          <div className="flex items-center gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-foreground hover:bg-foreground/10 rounded-xl">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 border-r-0 bg-background text-foreground">
                <SidebarContent
                  user={user}
                  store={store}
                  setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
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

            {publicStoreUrl ? (
              <Link
                href={publicStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-9 px-4 text-sm font-normal border rounded-md hover:bg-muted/50 transition-colors text-foreground"
              >
                View Store
                <Store className="h-4 w-4 text-muted-foreground" />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-2 h-9 px-4 text-sm font-normal border rounded-xl text-muted-foreground/60 cursor-not-allowed">
                View Store
                <Store className="h-4 w-4" />
              </span>
            )}
          </div>
        </header>

        <main className="flex-1 w-full p-4 md:px-10 md:py-3 mx-auto animate-appear">
          {showSetupReminder ? (
            <div className="mb-4 py-1">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-2.5">
                  <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-normal text-foreground">
                      Finish setup to unlock the full dashboard.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Complete your store details, then add your first product.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard"
                    className="inline-flex h-8 items-center rounded-xl border border-border bg-background px-3 text-xs font-normal text-foreground hover:bg-muted/40"
                  >
                    View Checklist
                  </Link>
                  <Link
                    href={nextSetupStep.href}
                    className="inline-flex h-8 items-center rounded-xl bg-primary px-3 text-xs font-normal text-primary-foreground hover:bg-primary/90"
                  >
                    {nextSetupStep.label}
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
          {children}
        </main>
      </div>
    </div>
  );
}
