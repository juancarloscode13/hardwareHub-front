// Utilidad para combinar clases Tailwind sin conflictos
// clsx combina condicionalmente, twMerge resuelve clases duplicadas/conflictivas
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combina clases CSS con soporte condicional y deduplicación de Tailwind */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
