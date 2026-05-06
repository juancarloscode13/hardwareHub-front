// Instancia global de React Query configurada para toda la aplicación
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,                   // Solo reintenta una vez en caso de error
            refetchOnWindowFocus: false, // No actualiza datos al cambiar de pestaña
        },
    },
});