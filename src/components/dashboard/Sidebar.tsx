
import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Box,
  FileText,
  Home,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Bell,
  HelpCircle,
  LogOut
} from "lucide-react";

const sidebarLinks = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: ShoppingCart, label: "Procurement", path: "/procurement" },
  { icon: Package, label: "Inventory", path: "/inventory" },
  { icon: Users, label: "Suppliers", path: "/suppliers" },
  { icon: FileText, label: "Documents", path: "/documents" },
  { icon: BarChart3, label: "Reports", path: "/reports" },
  { icon: Box, label: "Products", path: "/products" },
];

const bottomLinks = [
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: HelpCircle, label: "Help Center", path: "/help" },
];

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);

  const toggleCollapse = () => setCollapsed(!collapsed);

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center h-16 px-4 border-b border-gray-200">
        <div className={cn("flex items-center", collapsed ? "justify-center w-full" : "")}>
          {collapsed ? (
            <div className="bg-procurpal-primary text-white font-bold h-8 w-8 rounded flex items-center justify-center">P</div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="bg-procurpal-primary text-white font-bold h-8 w-8 rounded flex items-center justify-center">P</div>
              <span className="text-xl font-semibold text-gray-800">ProcurPal</span>
            </div>
          )}
        </div>
        <button
          onClick={toggleCollapse}
          className={cn(
            "ml-auto text-gray-500 hover:text-gray-800",
            collapsed ? "mx-auto" : ""
          )}
        >
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "sidebar-link",
                location.pathname === link.path && "active",
                collapsed && "justify-center px-2"
              )}
            >
              <link.icon size={20} />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-gray-200 py-4 px-3">
        <nav className="space-y-1">
          {bottomLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "sidebar-link",
                location.pathname === link.path && "active",
                collapsed && "justify-center px-2"
              )}
            >
              <link.icon size={20} />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          ))}
          <button
            className={cn(
              "sidebar-link w-full text-left",
              collapsed && "justify-center px-2"
            )}
          >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </nav>
      </div>
    </div>
  );
}
