"use client";

import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Video,
  Image as ImageIcon,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  Upload
} from "lucide-react";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Upload",
    href: "/admin/upload",
    icon: Upload,
  },
  {
    title: "Content (Impact)",
    href: "/admin/content",
    icon: Video,
  },
  {
    title: "Photos (Tounesna)",
    href: "/admin/photos",
    icon: ImageIcon,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="relative hidden h-screen border-r pt-16 lg:block w-72 bg-muted/10">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight uppercase text-muted-foreground">
              Overview
            </h2>
            <div className="grid gap-1">
               {sidebarNavItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={index}
                      href={item.href}
                    >
                      <span className={cn(
                        "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        pathname === item.href ? "bg-accent text-accent-foreground" : "transparent"
                      )}>
                        <Icon className="me-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </span>
                    </Link>
                  )
               })}
            </div>
          </div>
        </div>
      </div>
      
    </nav>
  );
}
