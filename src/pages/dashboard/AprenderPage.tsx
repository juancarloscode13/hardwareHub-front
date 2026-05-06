// Pagina AprenderPage: encapsula logica y presentacion de dashboard.
// Nota: este archivo se documenta con comentarios cortos centrados en decisiones no obvias.
import { useState } from 'react';
import {
  GraduationCap,
  Cpu,
  MonitorIcon,
  MemoryStick,
  HardDrive,
  CircuitBoard,
  Zap,
  Wind,
  Box,
  ChevronDown,
} from 'lucide-react';



interface GuideSection {
  title: string;
  icon: React.ElementType;
  intro: string;
  tips: string[];
}



const GUIDE_SECTIONS: GuideSection[] = [
  {
    title: 'Procesadores (CPU)',
    icon: Cpu,
    intro:
      'El procesador es el cerebro de tu PC. Determina la velocidad general del sistema y es crucial para tareas como gaming, edición de vídeo y programación.',
    tips: [
      'Más núcleos = mejor multitarea (streaming, compilación, renderizado).',
      'Mayor frecuencia (GHz) = mejor rendimiento en tareas mono-hilo (gaming).',
      'El TDP indica el consumo y calor generado — importante para elegir la refrigeración.',
      'Los sockets (AM5, LGA1700…) determinan la compatibilidad con la placa base.',
      'Passmark y Cinebench son benchmarks populares para comparar CPUs.',
    ],
  },
  {
    title: 'Tarjetas Gráficas (GPU)',
    icon: MonitorIcon,
    intro:
      'La GPU se encarga del procesamiento gráfico. Es el componente más importante para gaming, diseño 3D e inteligencia artificial.',
    tips: [
      'Más VRAM = mejor rendimiento en resoluciones altas y texturas pesadas.',
      'GDDR6X y GDDR7 son más rápidas que GDDR6 estándar.',
      'El ancho de banda de memoria afecta directamente el rendimiento gráfico.',
      'Comprueba la longitud máxima de GPU soportada por tu caja.',
      'El consumo (TDP) determina qué fuente de alimentación necesitas.',
    ],
  },
  {
    title: 'Memoria RAM',
    icon: MemoryStick,
    intro:
      'La RAM es la memoria de trabajo temporal de tu PC. Almacena los datos de las aplicaciones activas para acceso rápido.',
    tips: [
      '16 GB es el mínimo recomendado para gaming actual; 32 GB para edición y multitarea pesada.',
      'DDR5 ofrece mayor velocidad y ancho de banda que DDR4, pero necesita placa base compatible.',
      'La latencia (CL) importa: menor CL = menor tiempo de respuesta.',
      'Usar dos módulos (dual channel) duplica el ancho de banda respecto a uno solo.',
      'Verifica la velocidad máxima soportada por tu placa base.',
    ],
  },
  {
    title: 'Almacenamiento',
    icon: HardDrive,
    intro:
      'El almacenamiento guarda tu sistema operativo, programas y archivos. La velocidad del almacenamiento afecta los tiempos de carga.',
    tips: [
      'Un SSD NVMe M.2 puede ser hasta 10 veces más rápido que un SSD SATA.',
      'Usa un NVMe para el sistema operativo y los juegos principales.',
      'Los HDD siguen siendo útiles para almacenamiento masivo a bajo coste.',
      'Velocidad de lectura/escritura secuencial: lo que verás en las transferencias de archivos grandes.',
      'PCIe Gen 4 y Gen 5 ofrecen velocidades superiores a Gen 3.',
    ],
  },
  {
    title: 'Placa Base',
    icon: CircuitBoard,
    intro:
      'La placa base conecta todos los componentes entre sí. Determina qué procesador, RAM y almacenamiento puedes usar.',
    tips: [
      'El chipset determina las funcionalidades: overclocking, puertos USB, PCIe lanes…',
      'Formato ATX es el estándar; Micro-ATX y Mini-ITX son más compactos.',
      'Verifica la compatibilidad de socket con tu CPU.',
      'WiFi integrado ahorra un slot de expansión.',
      'Más ranuras M.2 = más opciones de almacenamiento NVMe.',
    ],
  },
  {
    title: 'Fuente de Alimentación (PSU)',
    icon: Zap,
    intro:
      'La fuente de alimentación convierte la corriente de la red en energía utilizable por los componentes. Una PSU de calidad protege tu inversión.',
    tips: [
      'Certificación 80 Plus indica eficiencia: White < Bronze < Silver < Gold < Platinum < Titanium.',
      'Calcula tu consumo total y añade un 20-30% de margen.',
      'Modular = solo conectas los cables que necesitas → mejor flujo de aire.',
      'SFX y SFX-L son formatos compactos para cajas Mini-ITX.',
      'No escatimes en la PSU: una mala fuente puede dañar todos los componentes.',
    ],
  },
  {
    title: 'Refrigeración',
    icon: Wind,
    intro:
      'La refrigeración mantiene las temperaturas bajo control para un rendimiento óptimo y la longevidad de los componentes.',
    tips: [
      'Aire: más simple, fiable y silencioso para CPUs de gama media.',
      'Líquida (AIO): mejor rendimiento térmico para CPUs de alto TDP y overclocking.',
      'Verifica la altura máxima del disipador soportada por tu caja.',
      'Comprueba la compatibilidad del socket del cooler con tu CPU.',
      'Una buena pasta térmica puede reducir las temperaturas 3-5 °C.',
    ],
  },
  {
    title: 'Cajas',
    icon: Box,
    intro:
      'La caja alberga todos los componentes y determina el flujo de aire, la compatibilidad de tamaños y la estética de tu PC.',
    tips: [
      'El formato debe coincidir con tu placa base (ATX, Micro-ATX, Mini-ITX).',
      'Comprueba la longitud máxima de GPU y la altura del disipador de CPU.',
      'Buenas opciones de ventilación frontal y trasera mejoran drásticamente las temperaturas.',
      'Los paneles de cristal templado permiten ver el interior (ideal con RGB).',
      'Bahías 2.5" y 3.5" determinan cuántos discos puedes montar.',
    ],
  },
];



function GuideSectionCard({ section }: { section: GuideSection }) {
  const [open, setOpen] = useState(false);
  const Icon = section.icon;

  return (
    <div className="bg-hw-card ring-1 ring-hw-card-border rounded-2xl overflow-hidden transition-all hw-aprender-section-card">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center py-5 text-left cursor-pointer hover:bg-muted/40 transition-colors hw-aprender-section-trigger"
      >
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-hw-icon-border bg-hw-icon-bg shrink-0 hw-aprender-section-icon-wrap">
          <Icon className="w-5 h-5 text-hw-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-hw-title font-heading hw-aprender-section-title">
            {section.title}
          </p>
        </div>
        <ChevronDown
          className="h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? 600 : 0, opacity: open ? 1 : 0 }}
      >
        <div className="hw-aprender-section-content">
          <p className="text-hw-subtitle" style={{ fontSize: '0.84rem', lineHeight: 1.65, margin: 0 }}>
            {section.intro}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <p className="text-hw-title font-heading" style={{ fontSize: '0.82rem', fontWeight: 600, margin: 0 }}>
              💡 Consejos clave
            </p>
            <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {section.tips.map((tip) => (
                <li
                  key={tip}
                  className="text-hw-subtitle"
                  style={{ fontSize: '0.82rem', lineHeight: 1.55 }}
                >
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}



export default function AprenderPage() {
  return (
    <section className="flex flex-col gap-8 hw-aprender-page">
      {}
      <div className="hw-aprender-header">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-hw-icon-border bg-hw-icon-bg">
          <GraduationCap className="w-5 h-5 text-hw-accent" />
        </div>
        <div>
          <h1 className="font-heading text-xl font-bold tracking-tight text-hw-title sm:text-2xl">
            Aprender Hardware
          </h1>
          <p className="mt-1 text-sm text-hw-subtitle sm:text-base">
            Guía completa sobre los componentes de un PC — desde lo básico hasta los detalles técnicos
          </p>
        </div>
      </div>

      <div className="hw-aprender-separator" aria-hidden="true" />

      {}
      <div className="bg-hw-icon-bg ring-1 ring-hw-icon-border rounded-2xl hw-aprender-intro">
        <p className="text-hw-title" style={{ fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>
          Montar un PC puede parecer intimidante, pero en realidad es como construir con piezas de LEGO:
          cada componente tiene su lugar y función. En esta guía te explicamos qué hace cada pieza,
          qué debes tener en cuenta y cómo elegir los mejores componentes para tu presupuesto.
        </p>
      </div>

      <div className="hw-aprender-separator" aria-hidden="true" />

      {}
      <div className="hw-aprender-sections">
        {GUIDE_SECTIONS.map((section) => (
          <GuideSectionCard key={section.title} section={section} />
        ))}
      </div>

      <div className="hw-aprender-separator" aria-hidden="true" />

      {}
      <div className="bg-hw-icon-bg ring-1 ring-hw-icon-border rounded-2xl text-center hw-aprender-footer">
        <p className="text-hw-title font-heading" style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>
          ¿Listo para construir?
        </p>
        <p className="text-hw-subtitle" style={{ fontSize: '0.84rem', margin: '8px 0 0' }}>
          Usa el <strong>comparador</strong> para elegir tus componentes y crea tu primer <strong>montaje</strong>.
          ¡La comunidad del foro también está para ayudarte!
        </p>
      </div>
    </section>
  );
}



