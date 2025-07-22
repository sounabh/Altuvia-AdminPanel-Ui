/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  FileText,
  GraduationCap,
  DollarSign,
  Settings,
  Building2,
  Award,
  BarChart3,
  FileTextIcon,
} from 'lucide-react';

const navigationItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Universities', url: '/universities', icon: Building2 },
  { title: 'Programs', url: '/programs', icon: GraduationCap },
  { title: 'Students', url: '/students', icon: Users },
  { title: 'Applications', url: '/applications', icon: FileText },
  { title: 'Financial', url: '/financial', icon: DollarSign },
  {title: 'Essays', url: '/essays', icon: FileTextIcon },
 // { title: 'Analytics', url: '/analytics', icon: BarChart3 },
 // { title: 'Settings', url: '/settings', icon: Settings },
 //{ title: 'Scholarships', url: '/scholarships', icon: Award },
 
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="w-64 border-r bg-white">
      <SidebarContent>
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">EduAdmin</h1>
          <p className="text-sm text-gray-500">College Platform Admin</p>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <SidebarTrigger className="text-gray-500 hover:text-gray-700" />
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@eduplatform.com</p>
              </div>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
