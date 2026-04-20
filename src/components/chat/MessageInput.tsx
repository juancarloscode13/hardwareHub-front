import { useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';



interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}



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
    <div className="hw-chat-input-shell shrink-0 border-t border-hw-card-border bg-hw-card">
      <form onSubmit={handleSubmit} className="hw-chat-input-row">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="hw-chat-input-field text-sm"
          disabled={disabled}
        />
        <Button
          type="submit"
          size="icon"
          disabled={disabled}
          className={cn(
            'hw-chat-send-btn h-10 w-10 rounded-full bg-hw-accent text-hw-accent-fg shadow-sm transition-all duration-200 ease-out hover:scale-105 hover:bg-hw-accent/90 active:scale-95',
            !hasText && 'opacity-75'
          )}
          aria-label="Enviar mensaje"
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
