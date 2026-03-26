import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Loader2, X } from 'lucide-react';

import { useRegister } from '@/features/auth/hooks/useRegister.ts';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { AvatarUploadDialog } from '@/components/ui/avatar-upload-dialog.tsx';

// ── Validaciones ─────────────────────────────────────────────────────────
interface FormErrors {
  nombre?: string;
  email?: string;
  contrasena?: string;
  terms?: string;
}

function validate(
  nombre: string,
  email: string,
  contrasena: string,
  termsAccepted: boolean,
): FormErrors {
  const errors: FormErrors = {};
  if (!nombre.trim()) errors.nombre = 'El nombre es obligatorio.';
  if (!email.trim()) {
    errors.email = 'El email es obligatorio.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Formato de email no válido.';
  }
  if (!contrasena) {
    errors.contrasena = 'La contraseña es obligatoria.';
  } else if (contrasena.length < 6) {
    errors.contrasena = 'Mínimo 6 caracteres.';
  }
  if (!termsAccepted) errors.terms = 'Debes aceptar los términos y condiciones.';
  return errors;
}

// ── Componente ───────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const register = useRegister();
  const navigate = useNavigate();

  // Redirigir tras registro exitoso → login
  useEffect(() => {
    if (register.isSuccess) {
      navigate('/login', { replace: true });
    }
  }, [register.isSuccess, navigate]);

  // Validación reactiva: solo se muestra tras primer submit
  const currentErrors = submitted ? validate(nombre, email, contrasena, termsAccepted) : {};

  const isFormValid =
    nombre.trim() !== '' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    contrasena.length >= 6 &&
    termsAccepted;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errors = validate(nombre, email, contrasena, termsAccepted);
    if (Object.keys(errors).length > 0) return;

    register.mutate({
      nombre,
      email,
      contrasena,
      avatar: avatarFile,
    });
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleAvatarSelected = (file: File, preview: string) => {
    setAvatarFile(file);
    setAvatarPreview(preview);
  };

  const handleAvatarRemoved = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-hw-page p-[1rem] relative overflow-hidden transition-colors duration-300">
      {/* Glow */}
      <div className="absolute w-[420px] h-[420px] rounded-full bg-hw-glow blur-[80px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300" />

      {/* Wrapper */}
      <div className="relative z-10 w-full max-w-[420px] flex flex-col items-center">
        {/* Card */}
        <div className="w-full bg-hw-card border border-hw-card-border rounded-[16px] p-[2rem] [box-shadow:var(--hw-card-shadow)] transition-all duration-300">
          {/* Header */}
          <div className="text-center mb-[1.75rem]">
            <div className="inline-flex items-center justify-center w-[48px] h-[48px] rounded-[12px] border border-hw-icon-border bg-hw-icon-bg mb-[0.75rem] transition-colors duration-300">
              <UserPlus className="w-[24px] h-[24px] text-hw-accent transition-colors duration-300" />
            </div>
            <h2 className="font-heading text-[1.5rem] font-bold tracking-[-0.02em] text-hw-title m-0 mb-[0.25rem] transition-colors duration-300">
              Crear cuenta
            </h2>
            <p className="text-[0.875rem] text-hw-subtitle transition-colors duration-300">
              Regístrate para empezar a explorar
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-[1.25rem]" noValidate>
            {/* Avatar */}
            <div className="flex justify-center">
              <AvatarUploadDialog
                file={avatarFile}
                preview={avatarPreview}
                onFileSelected={handleAvatarSelected}
                onFileRemoved={handleAvatarRemoved}
              />
            </div>

            {/* Nombre */}
            <div className="flex flex-col gap-[0.5rem]">
              <Label htmlFor="nombre" className="text-[0.875rem] text-hw-label gap-[0.4rem] transition-colors duration-300">
                <User className="w-[16px] h-[16px] text-hw-accent transition-colors duration-300" />
                Nombre
              </Label>
              <Input
                id="nombre"
                type="text"
                placeholder="Tu nombre de usuario"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                autoComplete="username"
                aria-invalid={!!currentErrors.nombre}
                className="h-[42px] bg-hw-input border-hw-input-border rounded-[8px] text-hw-input-text text-[0.875rem] px-[0.75rem] placeholder:text-hw-placeholder focus-visible:border-hw-accent focus-visible:ring-hw-accent/25 transition-colors duration-300"
              />
              {currentErrors.nombre && (
                <span className="text-hw-error text-[0.75rem]">{currentErrors.nombre}</span>
              )}
            </div>

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
                aria-invalid={!!currentErrors.email}
                className="h-[42px] bg-hw-input border-hw-input-border rounded-[8px] text-hw-input-text text-[0.875rem] px-[0.75rem] placeholder:text-hw-placeholder focus-visible:border-hw-accent focus-visible:ring-hw-accent/25 transition-colors duration-300"
              />
              {currentErrors.email && (
                <span className="text-hw-error text-[0.75rem]">{currentErrors.email}</span>
              )}
            </div>

            {/* Contraseña */}
            <div className="flex flex-col gap-[0.5rem]">
              <Label htmlFor="contrasena" className="text-[0.875rem] text-hw-label gap-[0.4rem] transition-colors duration-300">
                <Lock className="w-[16px] h-[16px] text-hw-accent transition-colors duration-300" />
                Contraseña
              </Label>
              <Input
                id="contrasena"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
                autoComplete="new-password"
                aria-invalid={!!currentErrors.contrasena}
                className="h-[42px] bg-hw-input border-hw-input-border rounded-[8px] text-hw-input-text text-[0.875rem] px-[0.75rem] placeholder:text-hw-placeholder focus-visible:border-hw-accent focus-visible:ring-hw-accent/25 transition-colors duration-300"
              />
              {currentErrors.contrasena && (
                <span className="text-hw-error text-[0.75rem]">{currentErrors.contrasena}</span>
              )}
            </div>

            {/* Error del servidor */}
            {register.isError && (
              <div className="px-[0.75rem] py-[0.5rem] rounded-[8px] border border-hw-error-border bg-hw-error-bg text-hw-error text-[0.875rem]">
                Error al crear la cuenta. Inténtalo de nuevo.
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-hw-divider my-[0.25rem] transition-colors duration-300" />

            {/* Términos y condiciones */}
            <div className="flex flex-col gap-[0.375rem]">
              <label className="flex items-start gap-[0.625rem] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-[0.2rem] w-[16px] h-[16px] shrink-0 rounded-[4px] accent-hw-accent cursor-pointer"
                />
                <span className="text-[0.8125rem] text-hw-label leading-relaxed transition-colors duration-300">
                  Acepto los{' '}
                  <Link
                    to="/terminos"
                    className="text-hw-accent font-semibold underline-offset-2 hover:underline transition-colors duration-300"
                  >
                    términos y condiciones del servicio
                  </Link>
                </span>
              </label>
              {currentErrors.terms && (
                <span className="text-hw-error text-[0.75rem] pl-[1.625rem]">
                  {currentErrors.terms}
                </span>
              )}
            </div>

            {/* Botón Registrarse */}
            <Button
              type="submit"
              disabled={register.isPending || (submitted && !isFormValid)}
              className="h-[42px] w-full bg-hw-accent text-hw-accent-fg font-semibold rounded-[8px] cursor-pointer border-transparent gap-[0.5rem] transition-colors duration-300 hover:opacity-80"
            >
              {register.isPending ? (
                <>
                  <Loader2 className="w-[16px] h-[16px] animate-spin" />
                  Creando cuenta…
                </>
              ) : (
                <>
                  <UserPlus className="w-[16px] h-[16px]" />
                  Registrarse
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

        {/* Login */}
        <p className="mt-[1rem] text-[0.875rem] text-hw-subtitle text-center transition-colors duration-300">
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className="text-hw-accent font-semibold no-underline hover:underline transition-colors duration-300"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}







