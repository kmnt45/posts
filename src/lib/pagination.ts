export type PaginationState = {
  currentPage: number;
  totalPages: number;
  previousPage: number;
  nextPage: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export function parsePageParam(pageParam?: string) {
  const page = Number(pageParam);

  if (!Number.isInteger(page) || page < 1) {
    return 1;
  }

  return page;
}

export function getPaginationState(currentPage: number, totalPages: number): PaginationState {
  const safeTotalPages = Math.max(1, totalPages);
  // Если пользователь вручную передал слишком большой номер страницы,
  // приводим его к последней доступной.
  const safeCurrentPage = Math.min(currentPage, safeTotalPages);

  return {
    currentPage: safeCurrentPage,
    totalPages: safeTotalPages,
    previousPage: Math.max(1, safeCurrentPage - 1),
    nextPage: Math.min(safeTotalPages, safeCurrentPage + 1),
    hasPreviousPage: safeCurrentPage > 1,
    hasNextPage: safeCurrentPage < safeTotalPages,
  };
}
