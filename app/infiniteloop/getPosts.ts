export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export async function getPosts(page: number, pageSize = 10) {
  const start = (page - 1) * pageSize;
  const url = `https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${pageSize}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  const posts: Post[] = await response.json();
  return {
    posts,
    nextPageToken: posts.length < pageSize ? undefined : page + 1,
  };
}
