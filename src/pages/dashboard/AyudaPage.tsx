import { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  MessageSquare,
  GitCompare,
  Newspaper,
  PcCaseIcon,
  Shield,
  Mail,
} from 'lucide-react';



interface FaqItem {
  question: string;
  answer: string;
  icon: React.ElementType;
}

const FAQ_SECTIONS: { title: string; items: FaqItem[] }[] = [
  {
    title: 'General',
    items: [
      {
        question: '¿Qué es HardwareHub?',
        answer:
          'HardwareHub es una plataforma comunitaria dedicada al mundo del hardware de PC. Aquí puedes comparar componentes, compartir tus montajes, discutir en el foro y mantenerte al día con las últimas noticias del sector.',
        icon: HelpCircle,
      },
      {
        question: '¿Necesito una cuenta para usar HardwareHub?',
        answer:
          'Sí, necesitas registrarte para acceder a todas las funcionalidades: publicar en el foro, comparar componentes, enviar mensajes y crear montajes. El registro es gratuito y solo toma unos segundos.',
        icon: Shield,
      },
    ],
  },
  {
    title: 'Foro',
    items: [
      {
        question: '¿Cómo publico en el foro?',
        answer:
          'Ve a la sección "Foro" desde el menú lateral y haz clic en "Nueva publicación". Puedes escribir texto y adjuntar imágenes. También puedes reaccionar y comentar en las publicaciones de otros usuarios.',
        icon: MessageSquare,
      },
      {
        question: '¿Puedo buscar publicaciones o usuarios?',
        answer:
          'Sí, en la parte superior del foro encontrarás una barra de búsqueda. Puedes buscar por contenido de publicaciones o por nombre de usuario usando los botones "Publicaciones" y "Personas".',
        icon: MessageSquare,
      },
    ],
  },
  {
    title: 'Comparador',
    items: [
      {
        question: '¿Cómo comparo componentes?',
        answer:
          'Ve a "Comparar" desde el menú lateral. Selecciona la categoría (CPU o GPU), elige dos componentes de la lista y verás una tabla comparativa detallada con todas las especificaciones y barras visuales de rendimiento.',
        icon: GitCompare,
      },
      {
        question: '¿Qué componentes puedo comparar?',
        answer:
          'Actualmente puedes comparar procesadores (CPU) y tarjetas gráficas (GPU). La base de datos incluye componentes de las últimas generaciones de AMD, Intel y NVIDIA.',
        icon: GitCompare,
      },
    ],
  },
  {
    title: 'Mensajería',
    items: [
      {
        question: '¿Cómo envío un mensaje a otro usuario?',
        answer:
          'Puedes iniciar una conversación desde el perfil de un usuario (botón "Mensaje") o desde la sección "Mensajes" haciendo clic en el icono de nueva conversación. Los mensajes son en tiempo real.',
        icon: Mail,
      },
      {
        question: '¿Los mensajes son en tiempo real?',
        answer:
          'Sí, utilizamos WebSockets (STOMP) para entregar mensajes instantáneamente. También verás indicadores de lectura (✓ enviado, ✓✓ leído) y contadores de mensajes no leídos.',
        icon: Mail,
      },
    ],
  },
  {
    title: 'Noticias y Montajes',
    items: [
      {
        question: '¿De dónde vienen las noticias?',
        answer:
          'Las noticias se obtienen automáticamente de fuentes especializadas en tecnología y hardware. Se actualizan periódicamente para mantenerte informado de las últimas novedades.',
        icon: Newspaper,
      },
      {
        question: '¿Qué son los montajes?',
        answer:
          'Un montaje es una configuración de PC completa que puedes guardar: CPU, GPU, RAM, placa base, almacenamiento, fuente de alimentación, caja y refrigeración. Puedes crear tus propios montajes y compartirlos con la comunidad.',
        icon: PcCaseIcon,
      },
    ],
  },
];



function FaqAccordionItem({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);
  const Icon = item.icon;

  return (
    <div
      className="bg-hw-card ring-1 ring-hw-card-border rounded-xl overflow-hidden transition-all"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center text-left cursor-pointer hover:bg-muted/40 transition-colors hw-ayuda-item-trigger"
      >
        <Icon className="h-4 w-4 text-hw-accent shrink-0" />
        <span className="flex-1 text-hw-title text-sm font-medium">{item.question}</span>
        <ChevronDown
          className="h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-200"
        style={{ maxHeight: open ? 300 : 0, opacity: open ? 1 : 0 }}
      >
        <p
          className="text-hw-subtitle hw-ayuda-item-answer"
        >
          {item.answer}
        </p>
      </div>
    </div>
  );
}



export default function AyudaPage() {
  return (
    <section className="flex flex-col gap-8 hw-ayuda-page">
      {}
      <div className="hw-ayuda-header">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-hw-icon-border bg-hw-icon-bg">
          <HelpCircle className="w-5 h-5 text-hw-accent" />
        </div>
        <div>
          <h1 className="font-heading text-xl font-bold tracking-tight text-hw-title sm:text-2xl">
            Ayuda y FAQ
          </h1>
          <p className="mt-1 text-sm text-hw-subtitle sm:text-base">
            Respuestas a las preguntas más frecuentes sobre HardwareHub
          </p>
        </div>
      </div>

      <div className="hw-ayuda-separator" aria-hidden="true" />

      {}
      {FAQ_SECTIONS.map((section, index) => (
        <div key={section.title}>
          <div className="hw-ayuda-section">
            <h2
              className="font-heading text-hw-title hw-ayuda-section-title"
            >
              {section.title}
            </h2>
            <div className="hw-ayuda-section-items">
              {section.items.map((item) => (
                <FaqAccordionItem key={item.question} item={item} />
              ))}
            </div>
          </div>
          {index < FAQ_SECTIONS.length - 1 && (
            <div className="hw-ayuda-category-separator" aria-hidden="true" />
          )}
        </div>
      ))}

      <div className="hw-ayuda-separator" aria-hidden="true" />

      {}
      <div className="bg-hw-icon-bg ring-1 ring-hw-icon-border rounded-2xl text-center hw-ayuda-footer">
        <p className="text-hw-title font-heading hw-ayuda-footer-title">
          ¿No encuentras lo que buscas?
        </p>
        <p className="text-hw-subtitle hw-ayuda-footer-text">
          Contacta con nosotros a través de la sección de mensajería o publica tu duda en el foro.
          La comunidad estará encantada de ayudarte.
        </p>
      </div>
    </section>
  );
}
