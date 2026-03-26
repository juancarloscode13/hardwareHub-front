import { useNavigate } from 'react-router-dom';
import { LogOut, Construction } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { useLogout } from '@/features/auth/hooks/useAuth';

export default function DashboardPage() {
  const navigate = useNavigate();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => navigate('/login', { replace: true }),
    });
  };

  return (
    <div className="min-h-screen bg-hw-page transition-colors duration-300">
      {/* Glow decorativo */}
      <div className="fixed w-[600px] h-[600px] rounded-full bg-hw-glow blur-[120px] top-0 right-0 pointer-events-none transition-colors duration-300" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-[2rem] py-[1.25rem] border-b border-hw-divider transition-colors duration-300">
        <span className="font-heading text-[1.125rem] font-bold tracking-[-0.02em] text-hw-title transition-colors duration-300">
          HardwareHub
        </span>

        <Button
          variant="outline"
          onClick={handleLogout}
          disabled={logout.isPending}
          className="bg-transparent border-hw-muted-border text-hw-muted rounded-[8px] gap-[0.5rem] hover:border-hw-error/40 hover:bg-hw-error-bg hover:text-hw-error transition-colors duration-300 disabled:opacity-50"
        >
          <LogOut className="w-[15px] h-[15px]" />
          {logout.isPending ? 'Cerrando sesión…' : 'Cerrar sesión'}
        </Button>
      </header>

      {/* Contenido */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-68px)] gap-[1rem]">
        <div className="inline-flex items-center justify-center w-[56px] h-[56px] rounded-[14px] border border-hw-icon-border bg-hw-icon-bg transition-colors duration-300">
          <Construction className="w-[28px] h-[28px] text-hw-accent" />
        </div>
        <h1 className="font-heading text-[1.5rem] font-bold tracking-[-0.02em] text-hw-title transition-colors duration-300">
          Dashboard
        </h1>
        <p className="text-[0.9375rem] text-hw-subtitle transition-colors duration-300">
          En construcción — próximamente aquí estará todo.
        </p>
      </main>
    </div>
  );
}

