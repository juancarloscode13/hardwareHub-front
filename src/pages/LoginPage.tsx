import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, X, Loader2 } from 'lucide-react';

import { useLogin } from '@/features/auth/hooks/useAuth.ts';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { ThemeToggle } from '@/components/ui/theme-toggle.tsx';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const login = useLogin();
  const navigate = useNavigate();

  // Validación reactiva: solo se muestra tras primer submit
  const emailError = submitted && !email.trim() ? 'El email es obligatorio.' : null;
  const passwordError = submitted && !password ? 'La contraseña es obligatoria.' : null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!email.trim() || !password) return;

    // La navegación va en el onSuccess del mutate (call-site), NO en un useEffect.
    // Motivo: tras login exitoso, invalidateQueries hace que PublicOnlyRoute
    // desmonte LoginPage (isLoading→true→null) antes de que cualquier
    // useEffect pueda ejecutarse. El callback onSuccess sí se ejecuta
    // sincrónicamente con la resolución de la mutación, antes del re-render.
    login.mutate({ email, password }, {
      onSuccess: (data) => {
        if (data.role === 'ROL_ADMIN') navigate('/admin', { replace: true });
        else navigate('/dashboard', { replace: true });
      },
    });
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-hw-page p-[1rem] relative overflow-hidden transition-colors duration-300">
      <ThemeToggle />
      {/* Glow */}
      <div className="absolute w-[420px] h-[420px] rounded-full bg-hw-glow blur-[80px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300" />

      {/* Wrapper */}
      <div className="relative z-10 w-full max-w-[420px] flex flex-col items-center">
        {/* Card */}
        <div className="w-full bg-hw-card border border-hw-card-border rounded-[16px] p-[2rem] [box-shadow:var(--hw-card-shadow)] transition-all duration-300">
          {/* Header */}
          <div className="text-center mb-[1.75rem]">
            <div className="inline-flex items-center justify-center w-[48px] h-[48px] rounded-[12px] border border-hw-icon-border bg-hw-icon-bg mb-[0.75rem] transition-colors duration-300">
              <LogIn className="w-[24px] h-[24px] text-hw-accent transition-colors duration-300" />
            </div>
            <h2 className="font-heading text-[1.5rem] font-bold tracking-[-0.02em] text-hw-title m-0 mb-[0.25rem] transition-colors duration-300">
              Iniciar sesión
            </h2>
            <p className="text-[0.875rem] text-hw-subtitle transition-colors duration-300">
              Introduce tus credenciales para acceder
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-[1.25rem]" noValidate>
            {/* Email */}
            <div className="flex flex-col gap-[0.5rem]">
              <Label htmlFor="email" className="text-[0.875rem] text-hw-label gap-[0.4rem] transition-colors duration-300">
                <Mail className="w-[16px] h-[16px] text-hw-accent transition-colors duration-300" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                aria-invalid={!!emailError}
                className={`h-[42px] bg-hw-input rounded-[8px] text-hw-input-text text-[0.875rem] px-[0.75rem] placeholder:text-hw-placeholder focus-visible:border-hw-accent focus-visible:ring-hw-accent/25 transition-colors duration-300 ${emailError ? 'border-hw-error' : 'border-hw-input-border'}`}
              />
              {emailError && (
                <span className="text-hw-error text-[0.75rem]">{emailError}</span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-[0.5rem]">
              <Label htmlFor="password" className="text-[0.875rem] text-hw-label gap-[0.4rem] transition-colors duration-300">
                <Lock className="w-[16px] h-[16px] text-hw-accent transition-colors duration-300" />
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                aria-invalid={!!passwordError}
                className={`h-[42px] bg-hw-input rounded-[8px] text-hw-input-text text-[0.875rem] px-[0.75rem] placeholder:text-hw-placeholder focus-visible:border-hw-accent focus-visible:ring-hw-accent/25 transition-colors duration-300 ${passwordError ? 'border-hw-error' : 'border-hw-input-border'}`}
              />
              {passwordError && (
                <span className="text-hw-error text-[0.75rem]">{passwordError}</span>
              )}
            </div>

            {/* Mensaje de error del servidor */}
            {login.isError && (
              <div className="px-[0.75rem] py-[0.5rem] rounded-[8px] border border-hw-error-border bg-hw-error-bg text-hw-error text-[0.875rem]">
                Credenciales incorrectas. Inténtalo de nuevo.
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-hw-divider my-[0.25rem] transition-colors duration-300" />

            {/* Botón Entrar */}
            <Button
              type="submit"
              disabled={login.isPending}
              className="h-[42px] w-full bg-hw-accent text-hw-accent-fg font-semibold rounded-[8px] cursor-pointer border-transparent gap-[0.5rem] transition-colors duration-300 hover:opacity-80"
            >
              {login.isPending ? (
                <>
                  <Loader2 className="w-[16px] h-[16px] animate-spin" />
                  Entrando…
                </>
              ) : (
                <>
                  <LogIn className="w-[16px] h-[16px]" />
                  Entrar
                </>
              )}
            </Button>

            {/* Botón Cancelar */}
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="h-[42px] w-full bg-transparent text-hw-muted border-hw-muted-border rounded-[8px] cursor-pointer gap-[0.5rem] transition-colors duration-300 hover:border-hw-accent/40 hover:bg-hw-accent/5 hover:text-hw-title"
            >
              <X className="w-[16px] h-[16px]" />
              Cancelar
            </Button>
          </form>
        </div>

        {/* Registro */}
        <p className="mt-[1rem] text-[0.875rem] text-hw-subtitle text-center transition-colors duration-300">
          ¿Aún no tienes cuenta?{' '}
          <Link
            to="/registro"
            className="text-hw-accent font-semibold no-underline hover:underline transition-colors duration-300"
          >
            Registrarse
          </Link>
        </p>
      </div>
    </div>
  );
}
