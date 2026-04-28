import { useNavigate } from 'react-router-dom';
import { PcCase, Plus, AlertCircle, PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion } from '@/components/ui/accordion';
import MontajeCard from '@/components/montaje/MontajeCard';
import { useMontajesByUsuario } from '@/features/montaje/hooks/useMontaje';
import { useEnrichedMontajes } from '@/features/montaje/hooks/useEnrichedMontajes';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import type { MontajeEnrichedDto } from '@/dto';



function MontajeSkeletons() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-[72px] w-full rounded-2xl" />
      ))}
    </>
  );
}



export default function MontajesPage() {
  const navigate = useNavigate();
  const { user } = useCurrentUser();

  const {
    data: montajesData,
    isLoading: montajesLoading,
    isError: montajesError,
  } = useMontajesByUsuario(user?.id ?? 0);

  const montajes = montajesData?.content ?? [];
  const { enriched, isLoading: enrichLoading } = useEnrichedMontajes(montajes);

  const isLoading = montajesLoading || enrichLoading;

  const handleEdit = (montaje: MontajeEnrichedDto) => {
    navigate('/dashboard/montajes/crear', { state: { montaje } });
  };

  return (
    <div className="hw-page-flow">
      <div className="hw-montajes-header">
        <div className="hw-montajes-header-brand">
          <PcCase className="h-7 w-7 text-hw-accent shrink-0" />
          <div className="hw-montajes-header-copy">
            <h1 className="hw-montajes-header-title text-hw-title font-heading">
              Mis Montajes
            </h1>
            <p className="hw-montajes-header-subtitle text-hw-subtitle">
              Gestiona y comparte tus configuraciones de PC.
            </p>
          </div>
        </div>

        <Button
          onClick={() => navigate('/dashboard/montajes/crear')}
          className="hw-montajes-action-btn"
        >
          <Plus className="h-4 w-4" />
          Crear nuevo
        </Button>
      </div>

      <div className="hw-montajes-list-wrap">
        {isLoading && <MontajeSkeletons />}

        {montajesError && (
          <div className="hw-error-state text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p className="hw-montajes-state-text">
              Error al cargar los montajes.
            </p>
          </div>
        )}

        {!isLoading && !montajesError && enriched.length === 0 && (
          <div className="hw-empty-state text-hw-subtitle">
            <PackageOpen className="h-10 w-10 opacity-40" />
            <p className="hw-montajes-state-text">
              Aún no tienes montajes. ¡Crea tu primer PC!
            </p>
            <Button
              onClick={() => navigate('/dashboard/montajes/crear')}
              className="hw-montajes-action-btn mt-2"
            >
              <Plus className="h-4 w-4" />
              Crear montaje
            </Button>
          </div>
        )}

        {!isLoading && !montajesError && enriched.length > 0 && (
          <Accordion type="single" collapsible className="flex flex-col gap-3">
            {enriched.map((m) => (
              <MontajeCard key={m.id} montaje={m} onEdit={handleEdit} />
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}

