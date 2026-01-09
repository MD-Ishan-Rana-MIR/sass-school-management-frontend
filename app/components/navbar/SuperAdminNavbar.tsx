"use client";

import { Menu, Bell, Settings, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { toast } from "sonner";

import { useLogoutMutation, useProfileQuery } from "@/app/api/super-admin/superAdminAuth";
import { logoutAlert } from "@/app/utility/alert/logoutAlert";
import { getCookie } from "@/app/utility/cookies/cookies";
import { useUnreadNotificationQuery } from "@/app/api/super-admin/superAdminNotification";
import { NotificationType } from "@/app/utility/type/super-admin/notificationType";

interface NavbarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onMobileOpen?: () => void;
}

export default function SuperAdminNavbar({
  collapsed,
  onToggleCollapse,
  onMobileOpen,
}: NavbarProps) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { data: userData } = useProfileQuery({});
  const [logoutApi] = useLogoutMutation();

  // 🔔 Notification
  const { data } = useUnreadNotificationQuery({});
  const unreadNotification: NotificationType[] = data?.data || [];

  console.log("notification data is",unreadNotification)

  // Avoid hydration issue
  useLayoutEffect(() => setMounted(true), []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto logout if token missing
  useEffect(() => {
    const interval = setInterval(() => {
      const token = getCookie("token");
      const superAdminToken = getCookie("superAdminToken");
      if (!token && !superAdminToken) router.push("/login");
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  // Logout handler
  const handleLogout = async () => {
    const res = await logoutAlert();
    if (!res.isConfirmed) return;

    try {
      await logoutApi({}).unwrap();
      document.cookie =
        "superAdminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      router.push("/login");
      toast.success("Logged out successfully ✅");
    } catch (err) {
      const error = err as { data?: { message?: string } };
      toast.error(error.data?.message || "Logout failed ❌");
    }
  };

  if (!mounted) return null;

  return (
    <header className="flex items-center justify-between h-16 px-4 lg:px-6 border-b bg-background relative">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button onClick={onToggleCollapse}>
          <Menu className="w-6 h-6" />
        </button>
        {!collapsed && <h1 className="font-semibold text-lg">Admin Dashboard</h1>}
      </div>

      {/* Right */}
      <div className="flex items-center gap-5 relative">
        {/* 🔔 Notification Bell with Pill */}
        <Link
          href="/super-admin/notification"
          className="relative inline-flex items-center justify-center"
        >
          <Bell className="w-5 h-5" />

          {unreadNotification.length > 0 && (
            <span
              className="
                absolute -top-2 -right-2
                min-w-[18px] h-[18px]
                px-1
                text-[10px] font-semibold
                flex items-center justify-center
                rounded-full
                bg-red-500 text-white
              "
            >
              {unreadNotification.length > 99
                ? "99+"
                : unreadNotification.length}
            </span>
          )}
        </Link>

        {/* User Dropdown */}
        <div ref={dropdownRef} className="relative">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <span className="hidden lg:block font-medium">
              {userData?.data?.data?.name || "Super Admin"}
            </span>

            <Image
              loader={({ src }) => src}
              src={`http://localhost:5500/uploads/profiles/profile-1767673486835.jpg`}
              alt="Profile"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full border"
            />
          </div>

          {/* Dropdown Menu */}
          <div
            className={`
              absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg
              flex flex-col py-2 z-50 transition-all duration-200
              ${dropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
            `}
          >
            <Link
              href="/super-admin/setting"
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
              onClick={() => setDropdownOpen(false)}
            >
              <Settings className="w-4 h-4" /> Settings
            </Link>

            <button
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <button className="lg:hidden absolute left-4" onClick={onMobileOpen}>
        <Menu className="w-6 h-6" />
      </button>
    </header>
  );
}
