"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useTransition } from "react";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { logout, switchRole } from "@/lib/actions/auth";
import { Menu, X, User, Settings, Wallet, LayoutDashboard, LogOut, ChevronDown, Briefcase, BookOpen, ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Avvvatars from "avvvatars-react";
import { toast } from "sonner";

export function Navbar({ session }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isSwitching, startTransition] = useTransition();
  const dropdownRef = useRef(null);

  const isAuthenticated = !!session;
  const role = session?.role;
  const roles = session?.roles || (role ? [role] : []);
  const hasMultipleRoles = roles.length > 1;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setShowLogoutConfirm(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
    setShowLogoutConfirm(false);
  }, [pathname]);

  const navLinks = () => {
    const links = [{ href: "/projects", label: "Browse Projects" }];
    links.push({ href: "/find-talent", label: "Find Talent" });
    if (isAuthenticated) {
      links.push({
        href: role === "student" ? "/student/dashboard" : "/client/dashboard",
        label: "Dashboard",
      });
    }
    return links;
  };

  const userMenuItems = role === "student" ? [
    { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/student/profile", label: "My Profile", icon: User },
    { href: "/student/wallet", label: "Wallet", icon: Wallet },
    { href: "/student/invitations", label: "Invitations", icon: BookOpen },
  ] : [
    { href: "/client/dashboard", label: "My Jobs", icon: Briefcase },
    { href: "/client/profile", label: "My Profile", icon: User },
    { href: "/client/wallet", label: "Wallet", icon: Wallet },
    { href: "/projects/new", label: "Post a Project", icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
  };

  const handleSwitchRole = () => {
    const otherRole = role === 'student' ? 'client' : 'student';
    startTransition(async () => {
      const result = await switchRole(otherRole);
      if (result?.message) {
        toast.error(result.message);
      }
    });
  };

  const UserDropdown = () => (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setDropdownOpen(!dropdownOpen);
          setShowLogoutConfirm(false);
        }}
        className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border border-[#eeebea] hover:border-[#d6d3d1] bg-white hover:bg-[#f9f7f6] transition-all cursor-pointer"
      >
        <Avvvatars value={session?.userId || "user"} size={28} />
        <span className="text-[13px] font-medium text-[#181717] hidden sm:block max-w-[80px] truncate">
          {role === "client" ? "Client" : "Student"}
        </span>
        <ChevronDown className={cn(
          "h-3.5 w-3.5 text-[#666666] transition-transform duration-200",
          dropdownOpen && "rotate-180"
        )} />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-[280px] bg-white rounded-2xl border border-border/10 shadow-xl shadow-[#2e2d2d]/10 z-50 overflow-hidden animate-fade-in-up">
          {/* User info header */}
          <div className="px-5 py-4 border-b border-border/10 bg-[#f9f7f6]">
            <div className="flex items-center gap-3">
              <Avvvatars value={session?.userId || "user"} size={36} />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-medium text-[#181717] truncate">
                  My Account
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide bg-white text-[#666666] border border-border/10">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: role === 'client' ? '#5a82de' : '#22c55e' }} />
                    {role === "client" ? "Client" : "Student"}
                  </span>
                  {hasMultipleRoles && (
                    <span className="text-[11px] text-[#666666]">
                      · {roles.length} roles
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Role switch */}
          {hasMultipleRoles && (
            <div className="px-2 py-2 border-b border-border/10">
              <button
                onClick={handleSwitchRole}
                disabled={isSwitching}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[14px] font-medium text-[#5a82de] hover:bg-[#cedefd]/20 transition-colors cursor-pointer disabled:opacity-50"
              >
                <ArrowRightLeft className="h-4 w-4" />
                {isSwitching ? 'Switching...' : `Switch to ${role === 'student' ? 'Client' : 'Student'}`}
              </button>
            </div>
          )}

          {/* Menu items */}
          <div className="py-2 px-2">
            {userMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-colors",
                  pathname === item.href
                    ? "bg-[#eeebea] text-[#181717]"
                    : "text-[#666666] hover:bg-[#f9f7f6] hover:text-[#181717]"
                )}
                onClick={() => setDropdownOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Sign out */}
          <div className="border-t border-border/10 px-2 py-2">
            {showLogoutConfirm ? (
              <div className="px-3 py-3 rounded-xl bg-[#ffd3cf]/30 space-y-2.5">
                <p className="text-[13px] font-medium text-[#d04841] flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Are you sure you want to sign out?
                </p>
                <div className="flex gap-2">
                  <form action={handleLogout} className="flex-1">
                    <button
                      type="submit"
                      className="w-full h-8 text-[13px] font-medium rounded-lg bg-[#d04841] text-white hover:bg-[#b83b34] transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </form>
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 h-8 text-[13px] font-medium rounded-lg bg-[#eeebea] text-[#666666] hover:bg-[#d6d3d1] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[14px] font-medium text-[#d04841] hover:bg-[#ffd3cf]/20 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const bottomNavItems = [];
  if (!isAuthenticated) {
    bottomNavItems.push({ href: "/", label: "Home", icon: LayoutDashboard });
    bottomNavItems.push({ href: "/projects", label: "Browse", icon: Briefcase });
    bottomNavItems.push({ href: "/login", label: "Sign In", icon: User });
  } else if (role === "student") {
    bottomNavItems.push({ href: "/student/dashboard", label: "Home", icon: LayoutDashboard });
    bottomNavItems.push({ href: "/projects", label: "Browse", icon: Briefcase });
    bottomNavItems.push({ href: "/student/invitations", label: "Invites", icon: BookOpen });
    bottomNavItems.push({ href: "/student/profile", label: "Profile", icon: User });
  } else {
    bottomNavItems.push({ href: "/client/dashboard", label: "Jobs", icon: Briefcase });
    bottomNavItems.push({ href: "/find-talent", label: "Talent", icon: User });
    bottomNavItems.push({ href: "/projects", label: "Browse", icon: LayoutDashboard });
  }

  return (
    <>
      <header className="bg-background w-full flex justify-center py-5 md:py-6 border-b border-border/10 relative z-40">
        <div className="flex items-center justify-between w-full max-w-7xl px-4 md:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/logo.svg"
              alt="PostLance Logo"
              width={140}
              height={40}
              className="h-9 md:h-10 w-auto"
            />
          </Link>

          {isMobile ? (
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <UserDropdown />
              ) : (
                <Link href="/register" className="btn-pill text-[13px] py-1.5 px-3">
                  Sign Up
                </Link>
              )}
            </div>
          ) : (
            <>
              <nav className="flex items-center gap-6">
                {navLinks().map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-[15px] font-medium transition-colors",
                      pathname === link.href
                        ? "text-primary"
                        : "text-[#181717] hover:text-primary",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-4">
                {isAuthenticated ? (
                  <UserDropdown />
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-[15px] font-medium text-[#181717] hover:text-primary px-2"
                    >
                      Sign In
                    </Link>
                    <Link href="/register" className="btn-pill">
                      Try for free
                    </Link>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border/10 flex justify-around items-center h-16 px-2 pb-safe">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                  isActive ? "text-[#d04841]" : "text-[#666666] hover:text-[#181717]"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
                <span className={cn("text-[10px] font-medium", isActive && "font-semibold")}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      )}
    </>
  );
}
