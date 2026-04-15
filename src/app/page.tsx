import { redirect } from 'next/navigation';
import { type FC } from 'react';

import { Pagination } from '@/components/Pagination';
import { PostsList } from '@/components/PostsList';
import { getPosts } from '@/lib/api';
import { getPaginationState, parsePageParam } from '@/lib/pagination';
import { buildPostsPageHref } from '@/lib/routes';

import styles from './page.module.css';

type HomePageProps = {
  searchParams?: Promise<{ page?: string }>;
};

const HomePage: FC<HomePageProps> = async ({ searchParams }) => {
  const resolvedSearchParams = await searchParams;
  const requestedPage = parsePageParam(resolvedSearchParams?.page);

  if (resolvedSearchParams?.page !== undefined && requestedPage === 1) {
    redirect('/');
  }

  const { posts, totalPages } = await getPosts(requestedPage);
  const pagination = getPaginationState(requestedPage, totalPages);

  if (pagination.currentPage !== requestedPage) {
    redirect(buildPostsPageHref(pagination.currentPage));
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Посты</h1>
      </section>

      <PostsList posts={posts} currentPage={pagination.currentPage} />
      <Pagination pagination={pagination} basePath='/' />
    </main>
  );
};

export default HomePage;
