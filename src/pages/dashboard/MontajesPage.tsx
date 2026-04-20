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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '24px 0' }}>
      {}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <PcCase className="h-7 w-7 text-hw-accent shrink-0" />
          <div>
            <h1
              className="text-hw-title font-heading"
              style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}
            >
              Mis Montajes
            </h1>
            <p
              className="text-hw-subtitle"
              style={{ fontSize: '0.85rem', margin: '4px 0 0' }}
            >
              Gestiona y comparte tus configuraciones de PC.
            </p>
          </div>
        </div>

        <Button
          onClick={() => navigate('/dashboard/montajes/crear')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <Plus className="h-4 w-4" />
          Crear nuevo
        </Button>
      </div>

      {}
      <div
        style={{
          maxWidth: 800,
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {}
        {isLoading && <MontajeSkeletons />}

        {}
        {montajesError && (
          <div
            className="text-destructive"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '48px 16px',
            }}
          >
            <AlertCircle className="h-5 w-5" />
            <p style={{ fontSize: '0.9rem', margin: 0 }}>
              Error al cargar los montajes.
            </p>
          </div>
        )}

        {}
        {!isLoading && !montajesError && enriched.length === 0 && (
          <div
            className="text-hw-subtitle"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              padding: '48px 16px',
              textAlign: 'center',
            }}
          >
            <PackageOpen className="h-10 w-10 opacity-40" />
            <p style={{ fontSize: '0.9rem', margin: 0 }}>
              Aún no tienes montajes. ¡Crea tu primer PC!
            </p>
            <Button
              onClick={() => navigate('/dashboard/montajes/crear')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8 }}
            >
              <Plus className="h-4 w-4" />
              Crear montaje
            </Button>
          </div>
        )}

        {}
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

