export const buildPostsPageHref = (page: number): string => {
  return page <= 1 ? '/' : `/?page=${page}`;
};

export const buildPostHref = (postId: number, page: number): string => {
  return page <= 1 ? `/posts/${postId}` : `/posts/${postId}?page=${page}`;
};
