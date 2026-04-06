import { useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// ── Props ───────────────────────────────────────────────────────────────────

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

// ── Componente ──────────────────────────────────────────────────────────────

export default function MessageInput({ onSend, disabled = false }: MessageInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  };

  return (
    <div className="shrink-0 border-t border-hw-card-border bg-hw-card px-7 py-4">
      <form onSubmit={handleSubmit} className="relative w-full">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="h-11 rounded-full pl-7 pr-18 text-sm"
          disabled={disabled}
        />
        <Button
          type="submit"
          size="icon"
          disabled={disabled || !value.trim()}
          className="absolute right-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-hw-accent text-hw-accent-fg transition-all duration-200 ease-out hover:scale-105 hover:bg-hw-accent/90 active:scale-95"
          aria-label="Enviar mensaje"
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
