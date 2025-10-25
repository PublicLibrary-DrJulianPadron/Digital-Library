import { apiSlice } from "@/common/api/apiSlice";
import type { components, paths } from "@/common/types/generated-api-types";

export type Video = components["schemas"]["Video"];
export type MinimalVideo = components["schemas"]["MinimalVideo"];
export type VideoRequest = paths["/api/library/videos/{slug}/"]["put"]["requestBody"]["content"]["multipart/form-data"];
export type PatchedVideoRequest = paths["/api/library/videos/{slug}/"]["patch"]["requestBody"]["content"]["multipart/form-data"];
export type VideosList = components["schemas"]["PaginatedMinimalVideoList"];


export const videosApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVideos: builder.query<
      VideosList,
      { search?: string; director?: string; genres__name?: string; release_date?: string; duration?: string; page?: number; page_size?: number } | void
    >({
      query: (arg) => {
        const params = new URLSearchParams();
        if (arg) {
          Object.entries(arg).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
              params.append(key, String(value));
            }
          });
        }
        return {
          url: `/library/videos/`,
          params,
        };
      },
      transformResponse: (response: VideosList) => response,
      providesTags: (result) =>
        result?.results
          ? [...result.results.map(({ id }) => ({ type: 'Videos' as const, id })), { type: 'Videos', id: 'LIST' }]
          : [{ type: 'Videos', id: 'LIST' }],
    }),
    createVideo: builder.mutation<Video, VideoRequest>({
      query: (newVideo) => ({
        url: `/library/videos/`,
        method: "POST",
        body: newVideo,
      }),
      invalidatesTags: [{ type: "Videos", id: "LIST" }],
    }),
    getVideoBySlug: builder.query<Video, string>({
      query: (slug) => `/library/videos/${slug}/`,
      providesTags: (result, error, slug) => [{ type: "Videos", id: slug }],
    }),
    updateVideo: builder.mutation<Video, { slug: string; body: VideoRequest }>({
      query: ({ slug, body }) => ({
        url: `/library/videos/${slug}/`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (result, error, { slug }) => [{ type: "Videos", id: slug }],
    }),
    partialUpdateVideo: builder.mutation<Video, { slug: string; body: PatchedVideoRequest }>({
      query: ({ slug, body }) => ({
        url: `/library/videos/${slug}/`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: (result, error, { slug }) => [{ type: "Videos", id: slug }],
    }),
    deleteVideo: builder.mutation<void, string>({
      query: (slug) => ({
        url: `/library/videos/${slug}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, slug) => [{ type: 'Videos', id: slug }, { type: 'Videos', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetVideosQuery,
  useCreateVideoMutation,
  useGetVideoBySlugQuery,
  useUpdateVideoMutation,
  usePartialUpdateVideoMutation,
  useDeleteVideoMutation,
} = videosApiSlice;