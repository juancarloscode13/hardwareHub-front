import { useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ── Props ───────────────────────────────────────────────────────────────────

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

// ── Componente ──────────────────────────────────────────────────────────────

export default function MessageInput({ onSend, disabled = false }: MessageInputProps) {
  const [value, setValue] = useState('');
  const hasText = value.trim().length > 0;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  };

  return (
    <div className="shrink-0 border-t border-hw-card-border bg-hw-card px-7 py-4">
      <form onSubmit={handleSubmit} className="flex w-full items-center gap-4">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 h-11 rounded-full pl-4 pr-4 text-sm"
          style={{ paddingLeft: '14px', textIndent: '2px' }}
          disabled={disabled}
        />
        <Button
          type="submit"
          size="icon"
          disabled={disabled}
          className={cn(
            'h-10 w-10 shrink-0 rounded-full bg-hw-accent text-hw-accent-fg shadow-sm transition-all duration-200 ease-out hover:scale-105 hover:bg-hw-accent/90 active:scale-95',
            !hasText && 'opacity-75'
          )}
          style={{ marginLeft: '12px' }}
          aria-label="Enviar mensaje"
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
