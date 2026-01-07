"use client";

import SuperAdminNavbar from "@/app/components/navbar/SuperAdminNavbar";
import SuperAdminSidebar from "@/app/components/sidebar/SuperAdminSidebar";
import { useState } from "react";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar – fixed width, full height */}
      <div className=" h-screen">
        <SuperAdminSidebar
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />
      </div>

      {/* Right side: Navbar + Content */}
      <div className="flex flex-col flex-1">
        {/* Navbar (takes remaining width) */}
        <SuperAdminNavbar
          onMobileOpen={() => setMobileOpen(true)}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-muted p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
