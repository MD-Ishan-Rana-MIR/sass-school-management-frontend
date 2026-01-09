"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  LayoutDashboard,
  Users,
  Settings,
  X,
  School,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function SuperAdminSidebar({
  mobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const pathname = usePathname();

  const menuItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
      link: "/super-admin",
    },
    {
      label: "Admin",
      icon: <Users className="w-4 h-4" />,
      submenu: [{ label: "All Admin", link: "/super-admin/admin" }],
    },
    {
      label: "School",
      icon: <School className="w-4 h-4" />,
      submenu: [{ label: "All School", link: "/super-admin/school" }],
    },
    {
      label: "Settings",
      icon: <Settings className="w-4 h-4" />,
      link: "/super-admin/settings",
    },
  ];

  return (
    <>
      {/* ✅ Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* ✅ Sidebar */}
      <aside
        className={`
          z-50 bg-background border-r flex flex-col
          w-[300px] h-full
          transition-transform duration-300

          fixed inset-y-0 left-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}

          lg:static lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b font-semibold">
          <span>Super Admin</span>

          {/* Mobile close */}
          <Button
            size="icon"
            variant="ghost"
            className="lg:hidden"
            onClick={onCloseMobile}
          >
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
                onOpenChange={(v) =>
                  setOpenMenu(v ? item.label : null)
                }
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between"
                  >
                    <span className="flex items-center gap-2">
                      {item.icon}
                      {item.label}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${openMenu === item.label ? "rotate-180" : ""
                        }`}
                    />
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="ml-6 mt-2 space-y-1">
                    {item.submenu.map((sub) => (
                      <Link key={sub.label} href={sub.link}>
                        <Button
                          variant="ghost"
                          className="w-full cursor-pointer justify-start"
                        >
                          {sub.label}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <Link key={item.label} href={item.link!}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-2 cursor-pointer  ${pathname === item.link
                    ? "bg-muted font-medium cursor-pointer "
                    : ""
                    }`}
                >
                  {item.icon}
                  {item.label}
                </Button>
              </Link>
            )
          )}
        </nav>
      </aside>
    </>
  );
}
