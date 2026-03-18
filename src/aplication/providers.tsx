// app/providers.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};