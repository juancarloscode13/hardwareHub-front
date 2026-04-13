import { useState } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Loader2, KeyRound, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useResetPassword } from '@/features/auth/hooks/useResetPassword';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ui/theme-toggle';
export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const resetPassword = useResetPassword();
  const passwordError =
    submitted && !password ? 'La contraseña es obligatoria.' :
    submitted && password.length < 6 ? 'Mínimo 6 caracteres.' : null;
  const confirmError =
    submitted && !confirmPassword ? 'Debes confirmar la contraseña.' :
    submitted && password !== confirmPassword ? 'Las contraseñas no coinciden.' : null;
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!password || password.length < 6 || password !== confirmPassword || !token) return;
    resetPassword.mutate(
      { token, nuevaContrasena: password },
      {
        onSuccess: () => {
          toast.success('Contraseña restablecida correctamente.');
          navigate('/login', { replace: true });
        },
      },
    );
  };
  // Sin token en la URL
  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-hw-page p-[1rem] relative overflow-hidden transition-colors duration-300">
        <ThemeToggle />
        <div className="absolute w-[420px] h-[420px] rounded-full bg-hw-glow blur-[80px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300" />
        <div className="relative z-10 w-full max-w-[420px] flex flex-col items-center">
          <div className="w-full bg-hw-card border border-hw-card-border rounded-[16px] p-[2rem] [box-shadow:var(--hw-card-shadow)] transition-all duration-300">
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertTriangle className="h-10 w-10 text-hw-error" />
              <h2 className="font-heading text-[1.25rem] font-bold text-hw-title">
                Enlace inválido
              </h2>
              <p className="text-[0.875rem] text-hw-subtitle">
                El enlace de recuperación no contiene un token válido. Solicita uno nuevo desde la página de inicio de sesión.
              </p>
              <Button
                onClick={() => navigate('/login')}
                className="mt-2 h-[42px] bg-hw-accent text-hw-accent-fg font-semibold rounded-[8px] cursor-pointer border-transparent gap-[0.5rem] transition-colors duration-300 hover:opacity-80"
              >
                Ir a Iniciar sesión
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-hw-page p-[1rem] relative overflow-hidden transition-colors duration-300">
      <ThemeToggle />
      <div className="absolute w-[420px] h-[420px] rounded-full bg-hw-glow blur-[80px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300" />
      <div className="relative z-10 w-full max-w-[420px] flex flex-col items-center">
        <div className="w-full bg-hw-card border border-hw-card-border rounded-[16px] p-[2rem] [box-shadow:var(--hw-card-shadow)] transition-all duration-300">
          {/* Header */}
          <div className="text-center mb-[1.75rem]">
            <div className="inline-flex items-center justify-center w-[48px] h-[48px] rounded-[12px] border border-hw-icon-border bg-hw-icon-bg mb-[0.75rem] transition-colors duration-300">
              <KeyRound className="w-[24px] h-[24px] text-hw-accent transition-colors duration-300" />
            </div>
            <h2 className="font-heading text-[1.5rem] font-bold tracking-[-0.02em] text-hw-title m-0 mb-[0.25rem] transition-colors duration-300">
              Restablecer contraseña
            </h2>
            <p className="text-[0.875rem] text-hw-subtitle transition-colors duration-300">
              Introduce tu nueva contraseña
            </p>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-[1.25rem]" noValidate>
            {/* Nueva contraseña */}
            <div className="flex flex-col gap-[0.5rem]">
              <Label htmlFor="new-password" className="text-[0.875rem] text-hw-label gap-[0.4rem] transition-colors duration-300">
                <Lock className="w-[16px] h-[16px] text-hw-accent transition-colors duration-300" />
                Nueva contraseña
              </Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                aria-invalid={!!passwordError}
                className="h-[42px] bg-hw-input rounded-[8px] text-hw-input-text text-[0.875rem] px-[0.75rem] placeholder:text-hw-placeholder focus-visible:border-hw-accent focus-visible:ring-hw-accent/25 transition-colors duration-300"
              />
              {passwordError && (
                <span className="text-hw-error text-[0.75rem]">{passwordError}</span>
              )}
            </div>
            {/* Confirmar contraseña */}
            <div className="flex flex-col gap-[0.5rem]">
              <Label htmlFor="confirm-password" className="text-[0.875rem] text-hw-label gap-[0.4rem] transition-colors duration-300">
                <Lock className="w-[16px] h-[16px] text-hw-accent transition-colors duration-300" />
                Confirmar contraseña
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Repite la contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                aria-invalid={!!confirmError}
                className="h-[42px] bg-hw-input rounded-[8px] text-hw-input-text text-[0.875rem] px-[0.75rem] placeholder:text-hw-placeholder focus-visible:border-hw-accent focus-visible:ring-hw-accent/25 transition-colors duration-300"
              />
              {confirmError && (
                <span className="text-hw-error text-[0.75rem]">{confirmError}</span>
              )}
            </div>
            {/* Error del servidor */}
            {resetPassword.isError && (
              <div className="px-[0.75rem] py-[0.5rem] rounded-[8px] border border-hw-error-border bg-hw-error-bg text-hw-error text-[0.875rem]">
                El token es inválido o ha expirado. Solicita un nuevo enlace.
              </div>
            )}
            {/* Divider */}
            <div className="border-t border-hw-divider my-[0.25rem] transition-colors duration-300" />
            {/* Botón */}
            <Button
              type="submit"
              disabled={resetPassword.isPending}
              className="h-[42px] w-full bg-hw-accent text-hw-accent-fg font-semibold rounded-[8px] cursor-pointer border-transparent gap-[0.5rem] transition-colors duration-300 hover:opacity-80"
            >
              {resetPassword.isPending ? (
                <>
                  <Loader2 className="w-[16px] h-[16px] animate-spin" />
                  Restableciendo...
                </>
              ) : (
                <>
                  <KeyRound className="w-[16px] h-[16px]" />
                  Restablecer contraseña
                </>
              )}
            </Button>
          </form>
        </div>
        <p className="mt-[1rem] text-[0.875rem] text-hw-subtitle text-center transition-colors duration-300">
          ¿Recuerdas tu contraseña?{' '}
          <a
            href="/login"
            className="text-hw-accent font-semibold no-underline hover:underline transition-colors duration-300"
          >
            Iniciar sesión
          </a>
        </p>
      </div>
    </div>
  );
}