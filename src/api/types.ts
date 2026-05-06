// Tipos genéricos para manejar respuestas paginadas de la API

/** Estructura de una página de resultados devuelta por Spring Data */
export interface PageResponse<T> {
  content: T[];           // Elementos de la página actual
  totalElements: number;  // Total de elementos en todas las páginas
  totalPages: number;     // Número total de páginas
  size: number;           // Tamaño de página solicitado
  number: number;         // Índice de la página actual (0-based)
  first: boolean;         // ¿Es la primera página?
  last: boolean;          // ¿Es la última página?
  numberOfElements: number; // Elementos devueltos en esta página
  empty: boolean;         // ¿La página está vacía?
}

/** Parámetros opcionales para filtrar, paginar y ordenar */
export interface PaginationParams {
  filter?: string; // Filtro DSL (ej: "nombre~texto")
  page?: number;   // Número de página (0-based)
  size?: number;   // Elementos por página
  sort?: string;   // Criterio de orden (ej: "id:desc")
}
