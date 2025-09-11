            // src/features/content-management/api/authorsApiSlice.ts
            import { apiSlice } from "@/common/api/apiSlice";
            import type { components } from "@/common/types/generated-api-types";

            export type Author = components["schemas"]["Author"];
            export type AuthorListResponse = components["schemas"]["PaginatedMinimalAuthorList"];
            export type AuthorDetailResponse = Author;

            export const authorsApiSlice = apiSlice.injectEndpoints({
                endpoints: (builder) => ({
                    getAuthors: builder.query<
                        AuthorListResponse,
                        { page?: number; page_size?: number; search?: string }
                    >({
                        query: ({ page = 1, page_size = 10, search } = {}) => {
                            let params = `page=${page}&page_size=${page_size}`;
                            if (search) {
                                params += `&search=${encodeURIComponent(search)}`;
                            }
                            return `/library/authors/?${params}`;
                        },
                        providesTags: (result) =>
                            result
                                ? [
                                    ...result.results.map(({ slug }) => ({
                                        type: "Authors" as const,
                                        id: slug, // use slug as unique identifier
                                    })),
                                    { type: "Authors", id: "LIST" },
                                ]
                                : [{ type: "Authors", id: "LIST" }],
                    }),

                    getAuthorBySlug: builder.query<AuthorDetailResponse, string>({
                        query: (slug) => `/library/authors/${slug}/`,
                        providesTags: (result, error, slug) => [{ type: "Authors", id: slug }],
                    }),

                    createAuthor: builder.mutation<AuthorDetailResponse, Partial<Author>>({
                        query: (body) => ({
                            url: "/library/authors/",
                            method: "POST",
                            body,
                        }),
                        invalidatesTags: [{ type: "Authors", id: "LIST" }],
                    }),

                    updateAuthor: builder.mutation<
                        AuthorDetailResponse,
                        { id: string; data: Partial<Author> }
                    >({
                        query: ({ id, data }) => ({
                            url: `/library/authors/${id}/`,
                            method: "PUT",
                            body: data,
                        }),
                        invalidatesTags: (result, error, { id }) => [{ type: "Authors", id }],
                    }),

                    deleteAuthor: builder.mutation<{ success: boolean }, string>({
                        query: (id) => ({
                            url: `/library/authors/${id}/`,
                            method: "DELETE",
                        }),
                        invalidatesTags: (result, error, id) => [{ type: "Authors", id }],
                    }),
                }),
            });

            export const {
                useGetAuthorsQuery,
                useGetAuthorBySlugQuery,
                useCreateAuthorMutation,
                useUpdateAuthorMutation,
                useDeleteAuthorMutation,
            } = authorsApiSlice;
