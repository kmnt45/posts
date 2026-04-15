import { notFound } from 'next/navigation';

import BackButton from '@/components/BackButton/BackButton';
import { getPost } from '@/lib/api';
import { parsePageParam } from '@/lib/pagination';
import type { Post } from '@/types/post';

import styles from './page.module.css';

type PostPageProps = {
  params: Promise<{ postId: string }>;
  searchParams?: Promise<{ page?: string }>;
};

export default async function PostPage({ params, searchParams }: PostPageProps) {
  const [{ postId }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const page = parsePageParam(resolvedSearchParams?.page);
  const numericPostId = Number(postId);

  if (!Number.isInteger(numericPostId) || numericPostId < 1) {
    notFound();
  }

  let post: Post;

  try {
    post = await getPost(postId);
  } catch {
    notFound();
  }

  return (
    <main className={styles.page}>
      <BackButton href={`/?page=${page}`} />

      <article className={styles.article}>
        <p className={styles.meta}>Пост #{post.id}</p>
        <h1 className={styles.title}>{post.title}</h1>
        <p className={styles.body}>{post.body}</p>
      </article>
    </main>
  );
}
