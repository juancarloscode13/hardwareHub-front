import { useNavigate } from 'react-router-dom';
import { Cpu } from 'lucide-react';
import MagnetizeButton from '@/components/magnetize-button.tsx';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-hw-page px-4 relative overflow-hidden transition-colors duration-300">
      {/* Glow */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-hw-glow blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300" />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        {/* Icono decorativo */}
        <div className="inline-flex items-center justify-center w-[64px] h-[64px] rounded-[16px] border border-hw-icon-border bg-hw-icon-bg transition-colors duration-300 mb-12">
          <Cpu className="w-[32px] h-[32px] text-hw-accent transition-colors duration-300" />
        </div>

        {/* Título */}
        <h1 className="font-heading text-[3.5rem] sm:text-[4.5rem] font-bold tracking-[-0.04em] leading-[1.05] text-hw-title m-0 mb-8 transition-colors duration-300">
          HardwareHub
        </h1>

        {/* Eslogan */}
        <p className="text-[1.125rem] sm:text-[1.25rem] text-hw-subtitle leading-relaxed max-w-md transition-colors duration-300">
          El espacio definitivo para los amantes del hardware
        </p>

        {/* Espaciador */}
        <div style={{ height: '1rem' }} />

        {/* Botón Magnetize */}
        <MagnetizeButton
          onClick={() => navigate('/login')}
          particleCount={300}
          particleSpread={750}
          className="min-w-[220px] h-[50px] text-[1rem] font-semibold bg-hw-icon-bg border border-hw-icon-border text-hw-accent hover:bg-hw-accent hover:text-hw-accent-fg transition-all duration-300 cursor-pointer rounded-[10px]"
          label="Comenzar"
          attractedLabel="¡Vamos!"
        />
      </div>
    </div>
  );
}

