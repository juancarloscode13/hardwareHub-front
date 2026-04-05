import { MessageSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useComentariosByPublicacion } from '@/features/comentario/hooks/useComentario';
import CommentItem from './CommentItem';
import CommentInput from './CommentInput';

interface CommentsDialogProps {
  publicacionId: number;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export default function CommentsDialog({ publicacionId, open, onOpenChange }: CommentsDialogProps) {
  const { data, isLoading } = useComentariosByPublicacion(open ? publicacionId : 0);
  const comentarios = data?.content ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="w-[min(36rem,calc(100vw-2rem))]"
        style={{ padding: 0, display: 'flex', flexDirection: 'column', maxHeight: '80vh' }}
      >
        {/* Header */}
        <DialogHeader style={{ padding: '20px 24px 0' }}>
          <DialogTitle style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MessageSquare className="h-5 w-5 text-hw-accent" />
            Comentarios{!isLoading && ` (${comentarios.length})`}
          </DialogTitle>
        </DialogHeader>

        {/* List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            maxHeight: '50vh',
          }}
        >
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: 12 }}>
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                  <Skeleton className="h-3 w-24 rounded" />
                  <Skeleton className="h-3 w-full rounded" />
                </div>
              </div>
            ))}

          {!isLoading && comentarios.length === 0 && (
            <p className="text-hw-subtitle" style={{ textAlign: 'center', padding: '32px 0', fontSize: '0.85rem' }}>
              Sé el primero en comentar.
            </p>
          )}

          {!isLoading &&
            comentarios.map((c) => <CommentItem key={c.id} comentario={c} />)}
        </div>

        {/* Input */}
        <div style={{ padding: '0 24px 20px' }}>
          <CommentInput publicacionId={publicacionId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

