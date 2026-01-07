"use client";

import { Menu, Bell } from "lucide-react";
import { usePathname } from "next/navigation";

interface NavbarProps {
    collapsed?: boolean;
    onToggleCollapse?: () => void;
    onMobileOpen?: () => void;
}

export default function SuperAdminNavbar({ collapsed, onToggleCollapse, onMobileOpen }: NavbarProps) {

    const pathName = usePathname();

    console.log(pathName)


    return (
        <header className="flex items-center justify-between h-16 px-4 lg:px-6 border-b bg-background transition-all duration-300">
            <div className="flex items-center gap-3">
                {/* Collapse button (sidebar + navbar) */}
                <button onClick={onToggleCollapse}>
                    <Menu className="w-6 h-6" />
                </button>

                {!collapsed && <h1 className="font-semibold text-lg">Admin Dashboard</h1>}
            </div>

            <div className="flex items-center gap-3">
                <button >
                    <Bell className="w-5 h-5" />
                </button>
            </div>

            {/* Mobile Hamburger */}
            <button

                className="lg:hidden absolute left-4"
                onClick={onMobileOpen}
            >
                <Menu className="w-6 h-6" />
            </button>
        </header>
    );
}
