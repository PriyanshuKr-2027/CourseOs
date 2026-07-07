"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  SquaresFour,
  CalendarBlank,
  CodeBlock,
  Note,
  Gear,
  SignOut,
  MagnifyingGlass,
  Bell,
  CaretDown,
  List,
  Table,
  Users,
  Shield,
  Database,
  Trophy
} from "@phosphor-icons/react";

import { useSupabase } from "@/components/providers/SupabaseProvider";
import { SetupModal } from "@/components/layout/SetupModal";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: SquaresFour },
  { label: "Day Plan", href: "/plan", icon: CalendarBlank },
  { label: "Pattern Sheet", href: "/problems", icon: Table },
  { label: "Social", href: "/social", icon: Users },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { label: "Notes", href: "/notes", icon: Note },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { profile, signOut } = useSupabase();

  const handleLogout = async () => {
    await signOut();
  };

  // Compute initials from name
  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "JD";
  };

  const navItems = profile.role === "admin"
    ? [
        { label: "Admin Overview", href: "/admin", icon: Shield },
        { label: "Admin Content", href: "/admin/days", icon: Database }
      ]
    : NAV_ITEMS;

  return (
    <div className="flex min-h-screen bg-paper w-full">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r border-border text-[#1B1917] transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className={cn(
          "flex h-16 items-center border-b border-border transition-all duration-300",
          isCollapsed ? "justify-center px-0" : "justify-between px-6"
        )}>
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-signal"></div>
              <span className="font-semibold text-lg tracking-tight">DSA Tracker</span>
            </div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className="p-1.5 hover:bg-black/5 rounded-lg transition-colors text-[#6B655B] hover:text-[#1B1917]"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
        
        <nav className={cn("flex-1 py-6 space-y-1 overflow-visible transition-all duration-300", isCollapsed ? "px-2" : "px-4")}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg text-sm transition-all duration-300 group relative",
                  isCollapsed ? "justify-center p-3" : "gap-3 px-3 py-2",
                  isActive
                    ? "bg-focus text-white font-medium shadow-sm"
                    : "text-[#6B655B] hover:text-[#1B1917] hover:bg-black/5"
                )}
              >
                <item.icon weight={isActive ? "fill" : "regular"} className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
                
                {/* Tooltip for collapsed mode */}
                {isCollapsed && (
                  <span className="absolute left-full ml-4 px-2.5 py-1.5 bg-[#1B1917] text-white text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity duration-250 whitespace-nowrap z-50 pointer-events-none shadow-xl">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className={cn("p-4 border-t border-border space-y-1 transition-all duration-300", isCollapsed ? "px-2" : "p-4")}>
          <Link
            href="/settings"
            className={cn(
              "flex items-center rounded-lg text-sm text-[#6B655B] hover:text-[#1B1917] hover:bg-black/5 transition-all duration-300 group relative",
              isCollapsed ? "justify-center p-3" : "gap-3 px-3 py-2",
              pathname === "/settings" && "bg-focus text-white font-medium shadow-sm"
            )}
          >
            <Gear weight={pathname === "/settings" ? "fill" : "regular"} className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>Settings</span>}
            {isCollapsed && (
              <span className="absolute left-full ml-4 px-2.5 py-1.5 bg-[#1B1917] text-white text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity duration-250 whitespace-nowrap z-50 pointer-events-none shadow-xl">
                Settings
              </span>
            )}
          </Link>
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center rounded-lg text-sm text-[#6B655B] hover:text-[#1B1917] hover:bg-black/5 transition-all duration-300 group relative",
              isCollapsed ? "justify-center p-3" : "gap-3 px-3 py-2"
            )}
          >
            <SignOut weight="regular" className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>Logout</span>}
            {isCollapsed && (
              <span className="absolute left-full ml-4 px-2.5 py-1.5 bg-[#1B1917] text-white text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity duration-250 whitespace-nowrap z-50 pointer-events-none shadow-xl">
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div 
        className={cn(
          "flex-grow flex flex-col min-h-screen transition-all duration-300 ease-in-out",
          isCollapsed ? "pl-20" : "pl-64"
        )}
      >
        {/* Topbar */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between px-8 bg-paper border-b border-border">
          <div className="flex items-center max-w-md w-full relative">
            <MagnifyingGlass className="absolute left-3 w-5 h-5 text-text-secondary" />
            <input
              type="text"
              placeholder="Search problems or notes..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-surface border border-border focus:outline-none focus:ring-2 focus:ring-focus/20 transition-all text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-text-secondary hover:text-text-primary transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-alert rounded-full border-2 border-paper"></span>
            </button>
            <div className="w-px h-6 bg-border"></div>
            <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-600">{getInitials(profile.name)}</span>
              </div>
              <span className="text-sm font-medium">{profile.name}</span>
              <CaretDown className="w-4 h-4 text-text-secondary" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
        <SetupModal />
      </div>
    </div>
  );
}
