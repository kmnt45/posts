import Link from 'next/link';

import type { Post } from '@/types/post';

import styles from './PostCard.module.css';

type PostCardProps = {
  post: Post;
  currentPage: number;
};

export default function PostCard({ post, currentPage }: PostCardProps) {
  return (
    // Сохраняем номер текущей страницы в query-параметре,
    // чтобы со страницы поста можно было вернуться в тот же список.
    <Link href={`/posts/${post.id}?page=${currentPage}`} className={styles.card}>
      <h2 className={styles.title}>{post.title}</h2>
      <p className={styles.excerpt}>{post.body}</p>
      <span className={styles.meta}>Открыть пост #{post.id}</span>
    </Link>
  );
}
