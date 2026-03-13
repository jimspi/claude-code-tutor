"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAccess } from "@/contexts/AccessContext";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { hasAccess, loading } = useAccess();
  const pathname = usePathname();

  // Show full chrome (sidebar + topbar) only for users with access
  // On the homepage for guests, render children alone (landing page handles its own layout)
  const isHome = pathname === "/";
  const showChrome = !loading && hasAccess;
  const isGuestHome = !loading && !hasAccess && isHome;

  if (isGuestHome) {
    return <div className="min-h-screen bg-stone-50">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-stone-50">
      {showChrome && (
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
      <div className="flex-1 flex flex-col min-w-0">
        {showChrome && (
          <TopBar onMenuClick={() => setSidebarOpen(true)} />
        )}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
