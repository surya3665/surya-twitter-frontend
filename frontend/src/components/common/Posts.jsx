import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({ feedType, userName, userId }) => {
  const getPostEnd = () => {
    switch (feedType) {
      case "forYou":
        return "/api/post/allPost";
      case "following":
        return "/api/post/following";
      case "posts": 
        return `/api/post/user/${userName}`
      case "likes":
        return `/api/post/likes/${userId}`
      default:
        return "/api/post/allPost";
    }
  };

  const POST_ENDPOINT = getPostEnd();
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (err) {
        throw new Error(err);
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [feedType, refetch, userName, userId]);

  return (
    <>
      {isLoading ||
        (isRefetching && (
          <div className="flex flex-col justify-center">
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        ))}
      {!isLoading && !isRefetching && data?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && !data.length == 0 && (
        <div>
          {data.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
