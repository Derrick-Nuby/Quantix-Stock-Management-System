'use client';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from "./theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";

function providers({ children }: { children: React.ReactNode; }) {
  const client = new QueryClient();

  return (
    <SidebarProvider>
      <QueryClientProvider client={client}>
        <Toaster />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </SidebarProvider>
  );
};

export default providers;