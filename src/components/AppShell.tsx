"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // Show full chrome (sidebar + topbar) only for signed-in users
  // On the homepage for guests, render children alone (landing page handles its own layout)
  const isHome = pathname === "/";
  const showChrome = !loading && user;
  const isGuestHome = !loading && !user && isHome;

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
