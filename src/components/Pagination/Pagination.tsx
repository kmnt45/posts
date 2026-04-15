import Link from 'next/link';

import type { PaginationState } from '@/lib/pagination';

import styles from './Pagination.module.css';

type PaginationProps = {
  pagination: PaginationState;
  basePath: string;
};

function buildHref(basePath: string, page: number) {
  return page === 1 ? basePath : `${basePath}?page=${page}`;
}

export default function Pagination({ pagination, basePath }: PaginationProps) {
  const previousHref = buildHref(basePath, pagination.previousPage);
  const nextHref = buildHref(basePath, pagination.nextPage);

  return (
    <nav className={styles.nav} aria-label='Pagination'>
      <Link
        href={previousHref}
        className={`${styles.link} ${!pagination.hasPreviousPage ? styles.linkDisabled : ''}`.trim()}
        aria-disabled={!pagination.hasPreviousPage}
        tabIndex={pagination.hasPreviousPage ? undefined : -1}
      >
        Назад
      </Link>

      <span className={styles.current}>
        Страница {pagination.currentPage} из {pagination.totalPages}
      </span>

      <Link
        href={nextHref}
        className={`${styles.link} ${!pagination.hasNextPage ? styles.linkDisabled : ''}`.trim()}
        aria-disabled={!pagination.hasNextPage}
        tabIndex={pagination.hasNextPage ? undefined : -1}
      >
        Вперед
      </Link>
    </nav>
  );
}
