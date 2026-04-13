import { useState } from 'react';
import type { FormEvent } from 'react';
import { Mail, Loader2, Send, CheckCircle2 } from 'lucide-react';
import { useForgotPassword } from '@/features/auth/hooks/useForgotPassword';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export default function ForgotPasswordDialog({
  open,
  onOpenChange,
}: ForgotPasswordDialogProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const forgotPassword = useForgotPassword();
  const emailError =
    submitted && !email.trim() ? 'El email es obligatorio.' : null;
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!email.trim()) return;
    forgotPassword.mutate(
      { email: email.trim() },
      { onSuccess: () => setSuccess(true) },
    );
  };
  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setEmail('');
      setSubmitted(false);
      setSuccess(false);
      forgotPassword.reset();
    }
    onOpenChange(next);
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <span className="inline-flex items-center gap-3" style={{ gap: '0.75rem' }}>
              <Mail className="h-5 w-5 text-hw-accent" />
              Recuperar contraseña
            </span>
          </DialogTitle>
          <DialogDescription>
            Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.
          </DialogDescription>
        </DialogHeader>
        {success ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
            <p className="text-[0.925rem] font-medium text-hw-title">
              ¡Revisa tu bandeja de entrada!
            </p>
            <p className="text-[0.825rem] text-hw-subtitle">
              Si el email existe en nuestro sistema, recibirás un enlace para
              restablecer tu contraseña.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-[0.5rem]">
              <Label
                htmlFor="forgot-email"
                className="text-[0.875rem] text-hw-label gap-[0.4rem] transition-colors duration-300"
              >
                <Mail className="w-[16px] h-[16px] text-hw-accent transition-colors duration-300" />
                Email
              </Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
                aria-invalid={!!emailError}
                className="h-[42px] bg-hw-input rounded-[8px] text-hw-input-text text-[0.875rem] pl-[1rem] pr-[0.75rem] placeholder:text-hw-placeholder focus-visible:border-hw-accent focus-visible:ring-hw-accent/25 transition-colors duration-300"
                style={{ paddingLeft: '1rem', paddingRight: '0.75rem' }}
              />
              {emailError && (
                <span className="text-hw-error text-[0.75rem]">{emailError}</span>
              )}
            </div>
            {forgotPassword.isError && (
              <div className="px-[0.75rem] py-[0.5rem] rounded-[8px] border border-hw-error-border bg-hw-error-bg text-hw-error text-[0.875rem]">
                No se pudo enviar el enlace. Inténtalo de nuevo.
              </div>
            )}
            <Button
              type="submit"
              disabled={forgotPassword.isPending}
              className="h-[42px] w-full bg-hw-accent text-hw-accent-fg font-semibold rounded-[8px] cursor-pointer border-transparent gap-[0.75rem] px-[0.75rem] transition-colors duration-300 hover:opacity-80"
              style={{ marginTop: '0.75rem', paddingLeft: '0.75rem', paddingRight: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}
            >
              {forgotPassword.isPending ? (
                <>
                  <Loader2 className="w-[16px] h-[16px] animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-[16px] h-[16px]" />
                  Enviar
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}