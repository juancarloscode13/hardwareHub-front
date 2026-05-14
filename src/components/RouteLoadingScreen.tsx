import { Loader2 } from 'lucide-react';

interface RouteLoadingScreenProps {
  title?: string;
  description?: string;
}

export function RouteLoadingScreen({
  title = 'Cargando acceso',
  description = 'Estamos comprobando tu sesión y preparando la interfaz.',
}: RouteLoadingScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-hw-page px-4 transition-colors duration-300">
      <div className="flex max-w-md flex-col items-center gap-4 rounded-2xl border border-hw-card-border bg-hw-card px-8 py-10 text-center [box-shadow:var(--hw-card-shadow)]">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-hw-icon-border bg-hw-icon-bg">
          <Loader2 className="h-7 w-7 animate-spin text-hw-accent" />
        </div>
        <div className="space-y-1">
          <p className="font-heading text-lg font-semibold text-hw-title">{title}</p>
          <p className="text-sm text-hw-subtitle">{description}</p>
        </div>
      </div>
    </div>
  );
}
