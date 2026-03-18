// ── Shared API types ──────────────────────────────────────────────────────

/** Mirrors Spring Data's Page<T> response shape */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

/** Query-string params accepted by all paginated endpoints */
export interface PaginationParams {
  filter?: string;
  page?: number;
  size?: number;
  sort?: string;
}

