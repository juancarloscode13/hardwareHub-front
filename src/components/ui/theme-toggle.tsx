import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { useTheme } from '@/features/use-theme.ts';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label="Alternar tema"
      className="bg-hw-card border-hw-card-border text-hw-accent cursor-pointer [box-shadow:var(--hw-card-shadow)] transition-all duration-300 hover:bg-hw-icon-bg hover:text-hw-accent"
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 50,
        width: '40px',
        height: '40px',
        borderRadius: '10px',
      }}
    >
      {theme === 'dark' ? (
        <Sun className="w-[18px] h-[18px]" />
      ) : (
        <Moon className="w-[18px] h-[18px]" />
      )}
    </Button>
  );
}
