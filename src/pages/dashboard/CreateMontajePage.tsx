import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, PcCase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MontajeFormPanel from '@/components/montaje/MontajeFormPanel';
import type { MontajeEnrichedDto } from '@/dto';

// ── Component ─────────────────────────────────────────────────────────────

export default function CreateMontajePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Si venimos de "editar", el montaje llega por state
  const editingMontaje = (location.state as { montaje?: MontajeEnrichedDto })?.montaje;
  const isEditing = !!editingMontaje;

  const handleSuccess = () => {
    navigate('/dashboard/montajes');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '24px 0' }}>
      {/* ── Cabecera ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <PcCase className="h-7 w-7 text-hw-accent shrink-0" />
          <div>
            <h1
              className="text-hw-title font-heading"
              style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}
            >
              {isEditing ? 'Editar Montaje' : 'Nuevo Montaje'}
            </h1>
            <p
              className="text-hw-subtitle"
              style={{ fontSize: '0.85rem', margin: '4px 0 0' }}
            >
              {isEditing
                ? 'Modifica los componentes de tu montaje.'
                : 'Selecciona cada componente para crear tu montaje ideal.'}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => navigate('/dashboard/montajes')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
      </div>

      {/* ── Formulario ───────────────────────────────────────────────── */}
      <MontajeFormPanel
        editingMontaje={editingMontaje}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

