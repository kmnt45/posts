import { redirect } from 'next/navigation';

import Pagination from '@/components/Pagination/Pagination';
import PostsList from '@/components/PostsList/PostsList';
import { getPosts } from '@/lib/api';
import { getPaginationState, parsePageParam } from '@/lib/pagination';

import styles from './page.module.css';

type HomePageProps = {
  searchParams?: Promise<{ page?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parsePageParam(resolvedSearchParams?.page);
  const { posts, totalPages } = await getPosts(currentPage);
  const pagination = getPaginationState(currentPage, totalPages);

  if (pagination.currentPage !== currentPage) {
    redirect(pagination.currentPage === 1 ? '/' : `/?page=${pagination.currentPage}`);
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Посты</h1>
      </section>

      <PostsList posts={posts} currentPage={currentPage} />
      <Pagination pagination={pagination} basePath='/' />
    </main>
  );
}
