import Link from 'next/link';
import { type FC } from 'react';

import type { PaginationState } from '@/lib/pagination';
import { buildPostsPageHref } from '@/lib/routes';

import styles from './Pagination.module.css';

type PaginationProps = {
  pagination: PaginationState;
  basePath: string;
};

export const Pagination: FC<PaginationProps> = ({ pagination, basePath }) => {
  const previousHref = basePath === '/' ? buildPostsPageHref(pagination.previousPage) : basePath;
  const nextHref = basePath === '/' ? buildPostsPageHref(pagination.nextPage) : basePath;

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
};
