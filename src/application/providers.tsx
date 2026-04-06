// app/providers.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';
import { ThemeProvider } from '@/context/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>
                    {children}
                    <Toaster richColors position="top-right" />
                </TooltipProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
};