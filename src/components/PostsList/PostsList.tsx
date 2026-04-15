import PostCard from '@/components/PostCard/PostCard';
import type { Post } from '@/types/post';

import styles from './PostsList.module.css';

type PostsListProps = {
  posts: Post[];
  currentPage: number;
};

export default function PostsList({ posts, currentPage }: PostsListProps) {
  return (
    <section className={styles.list}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} currentPage={currentPage} />
      ))}
    </section>
  );
}
