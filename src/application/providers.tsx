// Envuelve la aplicación con todos los providers globales necesarios
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';
import { ThemeProvider } from '@/context/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        // ThemeProvider: gestiona el modo oscuro/claro
        <ThemeProvider>
            {/* QueryClientProvider: habilita React Query en toda la app */}
            <QueryClientProvider client={queryClient}>
                {/* TooltipProvider: necesario para los tooltips globales */}
                <TooltipProvider>
                    {children}
                    {/* Toaster: muestra notificaciones toast en la esquina superior derecha */}
                    <Toaster richColors position="top-right" />
                </TooltipProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
};