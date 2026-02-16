"use client";

import { useEffect } from "react";

const DASHBOARD_FONT_CLASS = "theme-dashboard";

interface DashboardFontScopeProps {
  children: React.ReactNode;
}

export function DashboardFontScope({ children }: DashboardFontScopeProps) {
  useEffect(() => {
    document.documentElement.classList.add(DASHBOARD_FONT_CLASS);
    document.body.classList.add(DASHBOARD_FONT_CLASS);

    return () => {
      document.documentElement.classList.remove(DASHBOARD_FONT_CLASS);
      document.body.classList.remove(DASHBOARD_FONT_CLASS);
    };
  }, []);

  return <>{children}</>;
}
