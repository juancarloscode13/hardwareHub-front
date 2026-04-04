import { ArrowRight } from 'lucide-react';
import type { NoticiaResponseDto } from '@/dto';
import { timeAgo } from '@/lib/date-helpers';

// ── Placeholder si la imagen es null / falla ─────────────────────────────
const PLACEHOLDER_IMG =
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=60&auto=format&fit=crop';

interface NewsCardProps {
  news: NoticiaResponseDto;
}

export default function NewsCard({ news }: NewsCardProps) {
  const imgSrc = news.image || PLACEHOLDER_IMG;

  return (
    <a
      href={news.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Leer noticia: ${news.title}`}
      className="group block min-w-0 overflow-hidden rounded-2xl ring-1 ring-hw-card-border bg-hw-card cursor-pointer
                 transition-all duration-300 ease-out hover:shadow-[0_8px_40px_rgba(0,255,255,0.12)] hover:scale-[1.02]
                 hover:ring-hw-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hw-accent"
    >
      <div className="relative overflow-hidden" style={{ height: 220 }}>
        <img
          src={imgSrc}
          alt={news.title}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMG;
          }}
          className="transition-transform duration-500 ease-out group-hover:scale-[1.08]"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit: 'cover',
          }}
        />

        {/* Overlay degradado */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

      </div>

      <div className="flex flex-col gap-3.5 px-6 pb-6 pt-5">
        <h3 className="line-clamp-2 font-heading text-[0.9rem] font-semibold leading-snug text-hw-title">
          {news.title}
        </h3>

        <span className="text-[0.75rem] font-medium text-hw-subtitle/90">{news.sourceName}</span>

        <div className="flex items-center justify-between gap-4 pt-1">
          <time dateTime={news.publishedAt} className="text-[0.7rem] text-hw-subtitle">
            {timeAgo(news.publishedAt)}
          </time>

          <span className="flex items-center gap-2 text-[0.75rem] font-medium text-hw-accent">
            Leer
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </a>
  );
}
