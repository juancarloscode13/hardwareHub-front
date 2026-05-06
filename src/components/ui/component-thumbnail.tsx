// Componente component-thumbnail: encapsula logica y presentacion de UI reutilizable.
// Nota: este archivo se documenta con comentarios cortos centrados en decisiones no obvias.
import { ImageIcon } from 'lucide-react';

interface ComponentThumbnailProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const THUMBNAIL_SIZE_PX: Record<NonNullable<ComponentThumbnailProps['size']>, number> = {
  sm: 24,
  default: 32,
  lg: 40,
};

export function ComponentThumbnail({
  src,
  alt,
  size = 'default',
  className,
}: ComponentThumbnailProps) {
  const pixelSize = THUMBNAIL_SIZE_PX[size];
  const fallbackIconSize = size === 'sm' ? 12 : size === 'lg' ? 16 : 14;

  return (
    <div
      className={`rounded-md overflow-hidden border border-hw-card-border bg-muted/40 shrink-0 flex items-center justify-center ${className ?? ''}`.trim()}
      style={{ width: pixelSize, height: pixelSize, minWidth: pixelSize, minHeight: pixelSize }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <ImageIcon className="text-muted-foreground" style={{ width: fallbackIconSize, height: fallbackIconSize }} />
      )}
    </div>
  );
}




