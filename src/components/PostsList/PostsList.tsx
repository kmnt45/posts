import { type FC } from 'react';

import { PostCard } from '@/components/PostCard/PostCard';
import type { Post } from '@/types/post';

import styles from './PostsList.module.css';

type PostsListProps = {
  posts: Post[];
  currentPage: number;
};

export const PostsList: FC<PostsListProps> = ({ posts, currentPage }) => {
  return (
    <section className={styles.list}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} currentPage={currentPage} />
      ))}
    </section>
  );
};
