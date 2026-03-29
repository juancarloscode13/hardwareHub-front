import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { useTheme } from '@/features/use-theme.ts';

interface ThemeToggleProps {
  /** Cuando es false, el botón NO usa position:fixed y se comporta como inline */
  fixed?: boolean;
}

export function ThemeToggle({ fixed = true }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label="Alternar tema"
      className="bg-hw-card border-hw-card-border text-hw-accent cursor-pointer [box-shadow:var(--hw-card-shadow)] transition-all duration-300 hover:bg-hw-icon-bg hover:text-hw-accent shrink-0"
      style={
        fixed
          ? { position: 'fixed', top: '1rem', right: '1rem', zIndex: 50, width: '40px', height: '40px', borderRadius: '10px' }
          : { width: '40px', height: '40px', borderRadius: '10px' }
      }
    >
      {theme === 'dark' ? (
        <Sun className="w-[18px] h-[18px]" />
      ) : (
        <Moon className="w-[18px] h-[18px]" />
      )}
    </Button>
  );
}
