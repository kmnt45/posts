import Link from 'next/link';
import { type FC } from 'react';

import { buildPostHref } from '@/lib/routes';
import type { Post } from '@/types/post';

import styles from './PostCard.module.css';

type PostCardProps = {
  post: Post;
  currentPage: number;
};

export const PostCard: FC<PostCardProps> = ({ post, currentPage }) => {
  return (
    <Link href={buildPostHref(post.id, currentPage)} className={styles.card}>
      <h2 className={styles.title}>{post.title}</h2>
      <p className={styles.excerpt}>{post.body}</p>
      <span className={styles.meta}>Открыть пост #{post.id}</span>
    </Link>
  );
};
