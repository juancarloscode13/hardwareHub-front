import { Newspaper, AlertCircle } from 'lucide-react';
import { useNoticias } from '@/features/noticias/hooks/useNoticias';
import NewsGrid, { NewsGridSkeleton } from '@/components/NewsGrid';

export default function NoticiasPage() {
  const { data: noticias, isLoading, isError } = useNoticias();
  const noticiasList = Array.isArray(noticias) ? noticias : [];
  const hasNews = noticiasList.length > 0;
  const showEmpty = !isLoading && !isError && !hasNews;

  return (
    <section
      className="flex flex-col gap-10"
      style={{ paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 8 }}
    >
      {/* ── Cabecera ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 pr-2">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-hw-icon-border bg-hw-icon-bg">
          <Newspaper className="w-5 h-5 text-hw-accent" />
        </div>
        <div>
          <h1 className="font-heading text-xl font-bold tracking-tight text-hw-title sm:text-2xl">
            Noticias
          </h1>
          <p className="mt-1 text-sm text-hw-subtitle sm:text-base">
            Lo último del mundo tech, actualizado en tiempo real.
          </p>
        </div>
      </div>

      {/* ── Estado: cargando ──────────────────────────────────────────── */}
      {isLoading && <NewsGridSkeleton count={8} />}

      {/* ── Estado: error ─────────────────────────────────────────────── */}
      {isError && (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <AlertCircle className="h-10 w-10 text-hw-error" />
          <p className="text-hw-subtitle">
            No se pudieron cargar las noticias. Inténtalo de nuevo más tarde.
          </p>
        </div>
      )}

      {/* ── Estado: datos ─────────────────────────────────────────────── */}
      {hasNews && <NewsGrid newsList={noticiasList} />}

      {/* ── Estado: vacío ─────────────────────────────────────────────── */}
      {showEmpty && (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <Newspaper className="h-10 w-10 text-hw-subtitle" />
          <p className="text-hw-subtitle">
            No hay noticias disponibles en este momento.
          </p>
        </div>
      )}
    </section>
  );
}
