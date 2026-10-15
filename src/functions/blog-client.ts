import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { blogPublicQueries, blogQueries } from "@/server/queries/blog-server";
import { blogMutations } from "@/server/mutations/blog-server";
import { mediaMutations } from "@/server/mutations/media-server";
import type {
  CreatePostInput,
  DeletePostInput,
  GetPostsInput,
  UpdatePostInput,
} from "@/server/validation/blog";

export const POSTS_QUERY_KEY = "posts";
export const POST_QUERY_KEY = "post";

export function usePosts(filters: GetPostsInput) {
  return useQuery({
    queryKey: [POSTS_QUERY_KEY, filters],
    queryFn: () => blogQueries.getPosts({ data: filters }),
  });
}

export function usePost(id: string | undefined) {
  return useQuery({
    queryKey: [POST_QUERY_KEY, id],
    queryFn: () => blogQueries.getPostById({ data: { id: id! } }),
    enabled: Boolean(id),
  });
}

export function usePublicPosts(filters: GetPostsInput) {
  return useQuery({
    queryKey: ["public", POSTS_QUERY_KEY, filters],
    queryFn: () => blogPublicQueries.getPublicPosts({ data: filters }),
  });
}

export function usePublicPostBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["public", POST_QUERY_KEY, slug],
    queryFn: () => blogPublicQueries.getPublicPostBySlug({ data: { slug: slug! } }),
    enabled: Boolean(slug),
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePostInput) =>
      blogMutations.createPost({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [POSTS_QUERY_KEY] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdatePostInput) =>
      blogMutations.updatePost({ data: input }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [POSTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [POST_QUERY_KEY, data.id] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: DeletePostInput) =>
      blogMutations.deletePost({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [POSTS_QUERY_KEY] });
    },
  });
}

export function useUploadImage() {
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return mediaMutations.uploadImage({ data: formData });
    },
  });
}
