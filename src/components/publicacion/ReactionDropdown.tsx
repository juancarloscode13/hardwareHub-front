import { SmilePlus, ThumbsUp, ThumbsDown, Heart, Laugh, Lightbulb } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useAddReaccion } from '@/features/publicacion/hooks/useCreatePublicacion';
import type { TipoReaccion } from '@/dto';

// ── Reaction config ───────────────────────────────────────────────────────

interface ReactionDef {
  tipo: TipoReaccion;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const REACTIONS: ReactionDef[] = [
  { tipo: 'LIKE',        icon: ThumbsUp,   label: 'Me gusta' },
  { tipo: 'DISLIKE',     icon: ThumbsDown,  label: 'No me gusta' },
  { tipo: 'LOVE',        icon: Heart,       label: 'Me encanta' },
  { tipo: 'FUNNY',       icon: Laugh,       label: 'Divertido' },
  { tipo: 'INTERESTING', icon: Lightbulb,   label: 'Interesante' },
];

// ── Props ─────────────────────────────────────────────────────────────────

interface ReactionDropdownProps {
  publicacionId: number;
  likesCount: number;
  dislikesCount: number;
  loveCount: number;
  funnyCount: number;
  interestingCount: number;
}

function countForTipo(tipo: TipoReaccion, props: ReactionDropdownProps): number {
  switch (tipo) {
    case 'LIKE':        return props.likesCount;
    case 'DISLIKE':     return props.dislikesCount;
    case 'LOVE':        return props.loveCount;
    case 'FUNNY':       return props.funnyCount;
    case 'INTERESTING': return props.interestingCount;
  }
}

// ── Component ─────────────────────────────────────────────────────────────

export default function ReactionDropdown(props: ReactionDropdownProps) {
  const { user } = useCurrentUser();
  const addReaccion = useAddReaccion();

  const total =
    props.likesCount + props.dislikesCount + props.loveCount + props.funnyCount + props.interestingCount;

  const handleReact = (tipo: TipoReaccion) => {
    if (!user) return;
    addReaccion.mutate({
      id: props.publicacionId,
      data: { usuarioId: user.id, tipo },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-hw-subtitle hover:text-hw-title hover:bg-hw-accent/10 cursor-pointer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.78rem',
            padding: '6px 12px',
            borderRadius: 10,
            border: '1px solid var(--hw-card-border)',
          }}
        >
          <SmilePlus className="h-4 w-4" />
          Reaccionar
          {total > 0 && (
            <span className="text-hw-accent" style={{ fontWeight: 600, marginLeft: 2 }}>
              {total}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={6}
        style={{ display: 'flex', gap: 0, padding: '6px 4px', minWidth: 'auto' }}
      >
        {REACTIONS.map(({ tipo, icon: Icon }) => {
          const count = countForTipo(tipo, props);
          return (
            <DropdownMenuItem
              key={tipo}
              onClick={() => handleReact(tipo)}
              className="cursor-pointer hover:bg-hw-accent/10"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                padding: '8px 10px',
                borderRadius: 8,
                minWidth: 48,
              }}
            >
              <Icon className="h-5 w-5" />
              {count > 0 && (
                <span className="text-hw-subtitle" style={{ fontSize: '0.65rem' }}>
                  {count}
                </span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


