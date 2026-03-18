import { useLogin } from '@/features/auth/hooks/useAuth.ts';
import { useState } from 'react';
import type { FormEvent } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <h1 className="text-2xl font-bold">Iniciar sesión</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        {login.isError && (
          <p className="text-red-500 text-sm">Credenciales incorrectas</p>
        )}
        <button
          type="submit"
          disabled={login.isPending}
          className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
        >
          {login.isPending ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

