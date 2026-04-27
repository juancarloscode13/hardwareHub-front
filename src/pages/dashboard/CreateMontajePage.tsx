import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, PcCase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MontajeFormPanel from '@/components/montaje/MontajeFormPanel';
import type { MontajeEnrichedDto } from '@/dto';

export default function CreateMontajePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const editingMontaje = (location.state as { montaje?: MontajeEnrichedDto })?.montaje;
  const isEditing = !!editingMontaje;

  const handleSuccess = () => {
    navigate('/dashboard/montajes');
  };

  return (
    <div className="hw-page-flow">
      <div className="hw-create-montaje-header">
        <div className="hw-create-montaje-brand">
          <PcCase className="hw-create-montaje-icon h-7 w-7 text-hw-accent shrink-0" />
          <div className="hw-create-montaje-copy">
            <h1 className="hw-create-montaje-title text-hw-title font-heading">
              {isEditing ? 'Editar Montaje' : 'Nuevo Montaje'}
            </h1>
            <p className="hw-create-montaje-subtitle text-hw-subtitle">
              {isEditing
                ? 'Modifica los componentes de tu montaje.'
                : 'Selecciona cada componente para crear tu montaje ideal.'}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          className="hw-create-montaje-back-btn"
          onClick={() => navigate('/dashboard/montajes')}
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
      </div>

      <MontajeFormPanel
        editingMontaje={editingMontaje}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

