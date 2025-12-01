"use client";

import { useInfiniteQuery, DehydratedState } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { getPosts, Post } from "./getPosts";
import Comments from "../page/Comments";
import AuthorDetails from "../page/AuthorDetails";

interface PostInfiniteScrollProps {
  dehydratedState?: DehydratedState;
}

function PostCard({ post }: { post: Post }) {
  return (
    <div
      style={{
        padding: "15px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        marginBottom: "20px",
        background: "#fafafa",
      }}
    >
      <p>
        <strong>ID:</strong> {post.id}
      </p>
      <p>
        <strong>Title:</strong> {post.title}
      </p>
      <p>
        <strong>Body:</strong> {post.body}
      </p>

      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <Comments postId={post.id} />
        <AuthorDetails userId={post.userId} />
      </div>
    </div>
  );
}

export default function PostInfiniteScroll({ dehydratedState }: PostInfiniteScrollProps) {

  const firstPageData = dehydratedState?.queries
    ?.find(q => q.queryKey[0] === "posts")?.state?.data as
      | { posts: Post[]; nextPageToken?: number }
      | undefined;


  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam = 1 }) => getPosts(pageParam, 10),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
    initialData: firstPageData
      ? { pages: [firstPageData], pageParams: [1] }
      : undefined,
  });


  const lastRef = useRef<HTMLDivElement | null>(null);
  const { ref, entry } = useIntersection({ root: lastRef.current,threshold: 1,});

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry]);

  const posts = data?.pages.flatMap((p) => p.posts) ?? [];

  return (
    <div style={{ maxWidth: "600px", margin: "auto", marginTop: "40px" }}>

        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-blue-900 uppercase tracking-wide mb-8 drop-shadow-lg">
        Blog Explorer - Infitinite Scroll
      </h1>

      {posts.map((post, index) => {
        const isLast = index === posts.length - 1;

        return isLast ? (
          <div ref={ref} key={post.id}>
            <PostCard post={post} />
          </div>
        ) : (
          <PostCard key={post.id} post={post} />
        );
      })}

      {isFetchingNextPage && (
        <p
          style={{
            textAlign: "center",
            padding: "10px",
            color: "#a31616ff",
            fontSize: "25px",
          }}
        >
          Loading more posts...
        </p>
      )}
    </div>
  );
}
