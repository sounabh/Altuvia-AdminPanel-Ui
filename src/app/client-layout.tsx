'use client';

import { Toaster } from '@/components/ui/sonner';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AdminLayout from '@/components/AdminLayout';

const queryClient = new QueryClient();

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AdminLayout>{children}</AdminLayout>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
