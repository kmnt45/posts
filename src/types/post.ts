export type Post = {
  id: number;
  title: string;
  body: string;
};

export type PaginatedPosts = {
  posts: Post[];
  totalPosts: number;
  totalPages: number;
};
