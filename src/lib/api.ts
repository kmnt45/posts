import type { PaginatedPosts, Post } from '@/types/post';

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';
const POSTS_PER_PAGE = 10;
const FALLBACK_POSTS_URL = 'https://dummyjson.com/posts';

type JsonPlaceholderPost = Post;

type DummyJsonPost = {
  id: number;
  title: string;
  body: string;
};

type DummyJsonPostsResponse = {
  posts: DummyJsonPost[];
  total: number;
  skip: number;
  limit: number;
};

function getTotalPages(totalPosts: number) {
  return Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE));
}

async function fetchJsonPlaceholderPosts(page: number): Promise<PaginatedPosts> {
  const response = await fetch(`${POSTS_URL}?_limit=${POSTS_PER_PAGE}&_page=${page}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch posts from JSONPlaceholder');
  }

  const totalPostsHeader = response.headers.get('x-total-count');
  const totalPosts = Number(totalPostsHeader ?? 0);
  const posts = (await response.json()) as JsonPlaceholderPost[];

  return {
    posts,
    totalPosts,
    totalPages: getTotalPages(totalPosts),
  };
}

async function fetchDummyJsonPosts(page: number): Promise<PaginatedPosts> {
  const skip = (page - 1) * POSTS_PER_PAGE;
  const response = await fetch(`${FALLBACK_POSTS_URL}?limit=${POSTS_PER_PAGE}&skip=${skip}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch posts from DummyJSON');
  }

  const data = (await response.json()) as DummyJsonPostsResponse;

  return {
    posts: data.posts.map(({ id, title, body }) => ({ id, title, body })),
    totalPosts: data.total,
    totalPages: getTotalPages(data.total),
  };
}

export async function getPosts(page: number): Promise<PaginatedPosts> {
  // Основной источник данных должен соответствовать условиям задания,
  // fallback нужен только чтобы приложение оставалось рабочим при недоступности API.
  try {
    return await fetchJsonPlaceholderPosts(page);
  } catch {
    return fetchDummyJsonPosts(page);
  }
}

export async function getPost(postId: string): Promise<Post> {
  const response = await fetch(`${POSTS_URL}/${postId}`, {
    cache: 'force-cache',
  });

  if (response.ok) {
    return (await response.json()) as JsonPlaceholderPost;
  }

  const fallbackResponse = await fetch(`${FALLBACK_POSTS_URL}/${postId}`, {
    cache: 'force-cache',
  });

  if (!fallbackResponse.ok) {
    throw new Error('Failed to fetch post');
  }

  const fallbackPost = (await fallbackResponse.json()) as DummyJsonPost;

  return {
    id: fallbackPost.id,
    title: fallbackPost.title,
    body: fallbackPost.body,
  };
}
