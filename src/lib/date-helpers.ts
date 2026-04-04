const MINUTE = 60_000;
const HOUR = 3_600_000;
const DAY = 86_400_000;
const WEEK = 604_800_000;
const MONTH = 2_592_000_000;
const YEAR = 31_536_000_000;

/**
 * Convierte un ISO date string a formato relativo legible.
 * Ejemplo: "hace 3 horas", "ayer", "hace 2 semanas"
 */
export function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();

  if (diff < MINUTE) return 'ahora mismo';
  if (diff < HOUR) {
    const m = Math.floor(diff / MINUTE);
    return `hace ${m} ${m === 1 ? 'minuto' : 'minutos'}`;
  }
  if (diff < DAY) {
    const h = Math.floor(diff / HOUR);
    return `hace ${h} ${h === 1 ? 'hora' : 'horas'}`;
  }
  if (diff < 2 * DAY) return 'ayer';
  if (diff < WEEK) {
    const d = Math.floor(diff / DAY);
    return `hace ${d} días`;
  }
  if (diff < MONTH) {
    const w = Math.floor(diff / WEEK);
    return `hace ${w} ${w === 1 ? 'semana' : 'semanas'}`;
  }
  if (diff < YEAR) {
    const mo = Math.floor(diff / MONTH);
    return `hace ${mo} ${mo === 1 ? 'mes' : 'meses'}`;
  }
  const y = Math.floor(diff / YEAR);
  return `hace ${y} ${y === 1 ? 'año' : 'años'}`;
}

