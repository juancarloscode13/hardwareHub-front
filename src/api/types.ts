


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


export interface PaginationParams {
  filter?: string;
  page?: number;
  size?: number;
  sort?: string;
}

