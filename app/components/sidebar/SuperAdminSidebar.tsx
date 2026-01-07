"use client";

import { useState } from "react";
import Link from "next/link";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, LayoutDashboard, Users, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

interface SidebarProps {
    collapsed?: boolean;
    mobileOpen?: boolean;
    onCloseMobile?: () => void;
}

export default function SuperAdminSidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const pathName = usePathname();

    console.log(pathName)

    const menuItems = [
        { label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" />, link: "/super-admin", submenu: null },
        {
            label: "Admin",
            icon: <Users className="w-4 h-4" />,
            link: null,
            submenu: [
                { label: "All Admin", link: "/super-admin/admin" },
                // { label: "Add User", link: "/super-admin/users/add" },
            ],
        },
        { label: "Settings", icon: <Settings className="w-4 h-4" />, link: "/super-admin/settings", submenu: null },
    ];

    return (
        <>
            {/* Mobile overlay */}
            <div
                className={`fixed inset-0 bg-black/40 z-40 transition-opacity lg:hidden ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onCloseMobile}
            />

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 z-50 h-full flex flex-col bg-background border-r transition-all duration-300
          w-64
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
            >
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b font-semibold">
                    <span>Super Admin</span>

                    {/* Mobile Close */}
                    <Button size="icon" variant="ghost" className="lg:hidden" onClick={onCloseMobile}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Menu */}
                <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                    {menuItems.map((item) =>
                        item.submenu ? (
                            <Collapsible
                                key={item.label}
                                open={openMenu === item.label}
                                onOpenChange={(isOpen) => setOpenMenu(isOpen ? item.label : null)}
                            >
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost" className="w-full justify-between">
                                        <div className="flex items-center justify-between w-full">
                                            <span className="flex items-center gap-2">
                                                {item.icon}
                                                {item.label}
                                            </span>
                                            <ChevronDown
                                                className={`w-4 h-4 transition-transform duration-300 ${openMenu === item.label ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </div>
                                    </Button>
                                </CollapsibleTrigger>

                                <CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                                    <div className="ml-6 mt-2 space-y-1">
                                        {item.submenu.map((sub) => (
                                            <Link key={sub.label} href={sub.link || "#"} passHref>
                                                <Button asChild variant="ghost" className="w-full justify-start">
                                                    <span>{sub.label}</span>
                                                </Button>
                                            </Link>
                                        ))}
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        ) : (
                            <Link key={item.label} href={item.link || "#"} passHref>
                                <Button asChild variant="ghost" className="w-full justify-start gap-2">
                                    <div className="flex items-center gap-2">
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </div>
                                </Button>
                            </Link>
                        )
                    )}
                </nav>
            </aside>
        </>
    );
}
