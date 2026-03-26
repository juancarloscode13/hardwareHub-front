// ── Tipos ─────────────────────────────────────────────────────────────────
export interface TermsSection {
  title: string;
  text?: string;
  items?: string[];
}

// ── Datos ─────────────────────────────────────────────────────────────────
export const TERMS_SECTIONS: TermsSection[] = [
  {
    title: '1. Responsable del tratamiento',
    items: [
      'Nombre: Juan Carlos (autor del TFG)',
      'Proyecto: Trabajo de Fin de Grado (TFG)',
      'Email de contacto: soporte.hardwarehub@gmail.com',
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
    items: ['Email: soporte.hardwarehub@gmail.com'],
  },
];

