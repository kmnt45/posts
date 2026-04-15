import type { PaginatedPosts, Post } from '@/types/post';

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';
const FALLBACK_POSTS_URL = 'https://dummyjson.com/posts';
export const POSTS_PER_PAGE = 10;

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

class ApiError extends Error {
  public readonly code: 'invalid_response' | 'not_found' | 'unavailable';

  public constructor(code: 'invalid_response' | 'not_found' | 'unavailable', message: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const isPost = (value: unknown): value is Post => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'number' &&
    Number.isInteger(value.id) &&
    typeof value.title === 'string' &&
    typeof value.body === 'string'
  );
};

const isDummyJsonPostsResponse = (value: unknown): value is DummyJsonPostsResponse => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    Array.isArray(value.posts) &&
    value.posts.every(isPost) &&
    typeof value.total === 'number' &&
    typeof value.skip === 'number' &&
    typeof value.limit === 'number'
  );
};

const getTotalPages = (totalPosts: number) => {
  return Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE));
};

const getTotalPostsFromHeader = (headerValue: string | null): number => {
  const totalPosts = Number(headerValue);

  if (!Number.isInteger(totalPosts) || totalPosts < 0) {
    throw new ApiError('invalid_response', 'Invalid x-total-count header');
  }

  return totalPosts;
};

const mapFetchError = (error: unknown, fallbackMessage: string): never => {
  if (error instanceof ApiError) {
    throw error;
  }

  throw new ApiError('unavailable', fallbackMessage);
};

const fetchJsonPlaceholderPosts = async (page: number): Promise<PaginatedPosts> => {
  try {
    const response = await fetch(`${POSTS_URL}?_limit=${POSTS_PER_PAGE}&_page=${page}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new ApiError('unavailable', 'Failed to fetch posts from JSONPlaceholder');
    }

    const totalPosts = getTotalPostsFromHeader(response.headers.get('x-total-count'));
    const payload: unknown = await response.json();

    if (!Array.isArray(payload) || !payload.every(isPost)) {
      throw new ApiError('invalid_response', 'Invalid posts response payload');
    }

    const posts: JsonPlaceholderPost[] = payload;

    return {
      posts,
      totalPosts,
      totalPages: getTotalPages(totalPosts),
    };
  } catch (error: unknown) {
    return mapFetchError(error, 'Failed to fetch posts from JSONPlaceholder');
  }
};

const fetchDummyJsonPosts = async (page: number): Promise<PaginatedPosts> => {
  try {
    const skip = (page - 1) * POSTS_PER_PAGE;
    const response = await fetch(`${FALLBACK_POSTS_URL}?limit=${POSTS_PER_PAGE}&skip=${skip}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new ApiError('unavailable', 'Failed to fetch posts from DummyJSON');
    }

    const payload: unknown = await response.json();

    if (!isDummyJsonPostsResponse(payload)) {
      throw new ApiError('invalid_response', 'Invalid DummyJSON posts response payload');
    }

    return {
      posts: payload.posts.map(({ id, title, body }) => ({ id, title, body })),
      totalPosts: payload.total,
      totalPages: getTotalPages(payload.total),
    };
  } catch (error: unknown) {
    return mapFetchError(error, 'Failed to fetch posts from DummyJSON');
  }
};

export const getPosts = async (page: number): Promise<PaginatedPosts> => {
  try {
    return await fetchJsonPlaceholderPosts(page);
  } catch (error: unknown) {
    if (!(error instanceof ApiError) || error.code !== 'unavailable') {
      throw error;
    }

    return fetchDummyJsonPosts(page);
  }
};

export const getPost = async (postId: string): Promise<Post> => {
  try {
    const response = await fetch(`${POSTS_URL}/${postId}`, {
      cache: 'force-cache',
    });

    if (response.status === 404) {
      throw new ApiError('not_found', 'Post not found');
    }

    if (!response.ok) {
      throw new ApiError('unavailable', 'Failed to fetch post from JSONPlaceholder');
    }

    const payload: unknown = await response.json();

    if (!isPost(payload)) {
      throw new ApiError('invalid_response', 'Invalid post response payload');
    }

    return payload;
  } catch (error: unknown) {
    if (error instanceof ApiError && error.code !== 'unavailable') {
      throw error;
    }

    if (!(error instanceof ApiError)) {
      throw new ApiError('unavailable', 'Failed to fetch post from JSONPlaceholder');
    }
  }

  try {
    const fallbackResponse = await fetch(`${FALLBACK_POSTS_URL}/${postId}`, {
      cache: 'force-cache',
    });

    if (fallbackResponse.status === 404) {
      throw new ApiError('not_found', 'Post not found');
    }

    if (!fallbackResponse.ok) {
      throw new ApiError('unavailable', 'Failed to fetch post from DummyJSON');
    }

    const payload: unknown = await fallbackResponse.json();

    if (!isPost(payload)) {
      throw new ApiError('invalid_response', 'Invalid DummyJSON post response payload');
    }

    return payload;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError('unavailable', 'Failed to fetch post from DummyJSON');
  }
};
