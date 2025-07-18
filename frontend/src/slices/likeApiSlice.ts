import { LIKES_URL } from "@/constanst";
import { apiSlice } from "./apiSlice";

export const likeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    toggleVideoLike: builder.mutation({
      query: (videoId) => ({
        url: `${LIKES_URL}/toggle/v/${videoId}`,
        method: "POST",
      }),
    }),
  }),
});

export const { useToggleVideoLikeMutation } = likeApiSlice;
