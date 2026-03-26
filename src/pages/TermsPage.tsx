import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';

// ── Tipos ─────────────────────────────────────────────────────────────────
interface Section {
  title: string;
  items?: string[];
  text?: string;
}

// ── Datos ─────────────────────────────────────────────────────────────────
const SECTIONS: Section[] = [
  {
    title: '1. Responsable del tratamiento',
    items: [
      'Nombre: Juan Carlos (autor del TFG)',
      'Proyecto: Trabajo de Fin de Grado (TFG)',
      'Email de contacto: [email de contacto]',
    ],
  },
  {
    title: '2. Finalidad del tratamiento de los datos',
    items: [
      'Gestionar el registro y autenticación de usuarios',
      'Mantener la sesión del usuario mediante tokens de acceso',
      'Garantizar la seguridad de la aplicación',
      'Permitir el acceso a funcionalidades restringidas',
    ],
  },
  {
    title: '3. Datos que se recopilan',
    items: [
      'Datos identificativos (usuario, email)',
      'Credenciales de acceso (en formato cifrado)',
      'Tokens de autenticación (access token y refresh token)',
      'Dirección IP y datos técnicos de conexión',
    ],
  },
  {
    title: '4. Legitimación',
    items: [
      'El consentimiento del usuario al registrarse en la aplicación',
      'La ejecución de un servicio solicitado por el usuario (autenticación y acceso)',
    ],
  },
  {
    title: '5. Uso de cookies',
    text: 'Esta aplicación utiliza únicamente cookies técnicas necesarias para su funcionamiento.',
    items: [
      'Se emplean cookies para almacenar tokens de autenticación (access y refresh tokens)',
      'Estas cookies son esenciales para mantener la sesión del usuario',
      'No recopilan información con fines publicitarios',
      'No realizan seguimiento del usuario',
      'No son compartidas con terceros',
    ],
  },
  {
    title: '6. Conservación de los datos',
    items: [
      'Mientras el usuario mantenga su cuenta activa',
      'O durante el tiempo necesario para cumplir con la finalidad para la que fueron recogidos',
      'Los tokens de autenticación tienen una duración limitada por motivos de seguridad',
    ],
  },
  {
    title: '7. Seguridad de los datos',
    text: 'Se aplican medidas de seguridad adecuadas para proteger los datos personales, incluyendo:',
    items: [
      'Uso de cookies con atributos HttpOnly y Secure',
      'Control de acceso mediante autenticación basada en tokens',
      'Protección frente a accesos no autorizados',
    ],
  },
  {
    title: '8. Derechos del usuario',
    text: 'El usuario tiene derecho a:',
    items: [
      'Acceder a sus datos personales',
      'Solicitar la rectificación de datos incorrectos',
      'Solicitar la eliminación de sus datos',
      'Limitar u oponerse al tratamiento',
    ],
  },
  {
    title: '9. Cesión de datos a terceros',
    text: 'No se ceden datos personales a terceros, salvo obligación legal.',
  },
  {
    title: '10. Cambios en la política de privacidad',
    text: 'Esta política puede actualizarse para adaptarse a cambios legales o técnicos. Se recomienda revisarla periódicamente.',
  },
  {
    title: '11. Contacto',
    text: 'Para cualquier duda relacionada con esta política de privacidad:',
    items: ['Email: [email de contacto]'],
  },
];

// ── Componente ────────────────────────────────────────────────────────────
export default function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-hw-page transition-colors duration-300">
      {/* Glow decorativo */}
      <div className="fixed w-[600px] h-[600px] rounded-full bg-hw-glow blur-[120px] top-0 right-0 pointer-events-none transition-colors duration-300" />

      <div className="relative z-10 max-w-[760px] mx-auto px-[1.5rem] py-[3rem]">

        {/* Botón volver */}
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-[2rem] bg-transparent text-hw-muted border-hw-muted-border rounded-[8px] gap-[0.5rem] hover:border-hw-accent/40 hover:bg-hw-accent/5 hover:text-hw-title transition-colors duration-300"
        >
          <ArrowLeft className="w-[16px] h-[16px]" />
          Volver
        </Button>

        {/* Cabecera */}
        <div className="flex items-center gap-[1rem] mb-[0.75rem]">
          <div className="inline-flex items-center justify-center w-[48px] h-[48px] rounded-[12px] border border-hw-icon-border bg-hw-icon-bg shrink-0 transition-colors duration-300">
            <Shield className="w-[24px] h-[24px] text-hw-accent" />
          </div>
          <h1 className="font-heading text-[1.75rem] font-bold tracking-[-0.02em] text-hw-title leading-tight transition-colors duration-300">
            Política de Privacidad
          </h1>
        </div>

        <p className="text-[0.875rem] text-hw-subtitle mb-[2.5rem] transition-colors duration-300">
          HardwareHub — Última actualización: marzo 2026
        </p>

        {/* Card contenido */}
        <div className="bg-hw-card border border-hw-card-border rounded-[16px] p-[2rem] [box-shadow:var(--hw-card-shadow)] flex flex-col gap-[2rem] transition-all duration-300">

          {/* Intro */}
          <p className="text-[0.9375rem] text-hw-label leading-relaxed transition-colors duration-300">
            El responsable del tratamiento de los datos personales recogidos a través de esta
            aplicación es el autor del proyecto. A continuación se detallan los términos que
            rigen el uso de la plataforma y el tratamiento de tus datos.
          </p>

          {/* Divider */}
          <div className="border-t border-hw-divider" />

          {/* Secciones */}
          {SECTIONS.map((section) => (
            <section key={section.title} className="flex flex-col gap-[0.75rem]">
              <h2 className="font-heading text-[1.0625rem] font-semibold text-hw-title transition-colors duration-300">
                {section.title}
              </h2>

              {section.text && (
                <p className="text-[0.875rem] text-hw-label leading-relaxed transition-colors duration-300">
                  {section.text}
                </p>
              )}

              {section.items && (
                <ul className="flex flex-col gap-[0.375rem] pl-[0.25rem]">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-[0.625rem] text-[0.875rem] text-hw-label leading-relaxed transition-colors duration-300"
                    >
                      {/* Bullet cian */}
                      <span className="mt-[0.45rem] w-[5px] h-[5px] rounded-full bg-hw-accent shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {/* Divider final */}
          <div className="border-t border-hw-divider" />

          {/* Nota final */}
          <p className="text-[0.8125rem] text-hw-subtitle text-center transition-colors duration-300">
            Al registrarte en HardwareHub, confirmas que has leído y aceptas esta política de privacidad.
          </p>
        </div>

        {/* Botón volver abajo */}
        <div className="flex justify-center mt-[2rem]">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="bg-transparent text-hw-muted border-hw-muted-border rounded-[8px] gap-[0.5rem] hover:border-hw-accent/40 hover:bg-hw-accent/5 hover:text-hw-title transition-colors duration-300"
          >
            <ArrowLeft className="w-[16px] h-[16px]" />
            Volver al registro
          </Button>
        </div>
      </div>
    </div>
  );
}



