"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Package, ShoppingCart, TrendingUp, BarChart2, Settings, Table2Icon } from 'lucide-react';

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/products', icon: Package, label: 'Products' },
  // { href: '/categories', icon: Tags, label: 'Categories' },
  { href: '/sales', icon: ShoppingCart, label: 'Sales' },
  { href: '/purchases', icon: TrendingUp, label: 'Purchases' },
  { href: '/analytics', icon: BarChart2, label: 'Analytics' },
  // { href: '/inventory', icon: ClipboardList, label: 'Inventory' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Quantix Inventory
        </h2>
        <div className="space-y-1">
          <Button asChild variant="secondary" className="w-full justify-start">
            <Link href="/store-table">
              <Table2Icon className="mr-2 h-4 w-4" />
              Home Table
            </Link>
          </Button>
          <Button asChild variant="secondary" className="w-full justify-start">
            <Link href="/create-sale">
              <ShoppingCart className="mr-2 h-4 w-4" />
              New Sale
            </Link>
          </Button>
          <Button asChild variant="secondary" className="w-full justify-start">
            <Link href="/create-purchase">
              <TrendingUp className="mr-2 h-4 w-4" />
              New Purchase
            </Link>
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

