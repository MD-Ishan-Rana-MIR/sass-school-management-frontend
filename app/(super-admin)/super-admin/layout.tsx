"use client";

import SuperAdminNavbar from "@/app/components/navbar/SuperAdminNavbar";
import SuperAdminSidebar from "@/app/components/sidebar/SuperAdminSidebar";
import { useState } from "react";


export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false); // controls sidebar + navbar
    const [mobileOpen, setMobileOpen] = useState(false); // mobile drawer

    const toggleCollapse = () => setCollapsed(!collapsed);

    return (
        <div className="flex min-h-screen flex-col">
            {/* Navbar */}
            <SuperAdminNavbar
                collapsed={collapsed}
                onToggleCollapse={toggleCollapse}
                onMobileOpen={() => setMobileOpen(true)}
            />

            <div className="flex flex-1">
                {/* Sidebar */}
                <SuperAdminSidebar
                    collapsed={collapsed}
                    mobileOpen={mobileOpen}
                    onCloseMobile={() => setMobileOpen(false)}
                />

                {/* Main Content */}
                <main
                    className={`flex-1 transition-all duration-300 bg-muted p-6 ${collapsed ? "lg:ml-20" : "lg:ml-64"
                        }`}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}
