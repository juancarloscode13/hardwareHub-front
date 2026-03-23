// app/providers.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';
import { ThemeProvider } from '@/context/theme-provider';

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </ThemeProvider>
    );
};