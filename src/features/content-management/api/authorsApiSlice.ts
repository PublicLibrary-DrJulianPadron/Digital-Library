// src/features/content-management/api/authorsApiSlice.ts
import { apiSlice } from "@/common/api/apiSlice";
import type { components } from "@/common/types/generated-api-types";

export type Author = components["schemas"]["Author"];
export type AuthorList = components["schemas"]["PaginatedMinimalAuthorList"];
export type AuthorRequest = components["schemas"]["AuthorRequest"];

export const authorsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAuthors: builder.query<
            AuthorList,
            { page?: number; page_size?: number; search?: string }
        >({
            query: ({ page, page_size, search } = {}) => {
                let params = ``;
                if (page) {
                    params += `page=${encodeURIComponent(page)}`;
                }
                if (page_size) {
                    params += `&page_size=${encodeURIComponent(page_size)}`;
                }
                if (search) {
                    params += `&search=${encodeURIComponent(search)}`;
                }
                return `library/authors/?${params}`;
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

        getAuthorBySlug: builder.query<Author, string>({
            query: (slug) => `library/authors/${slug}/`,
            providesTags: (result, error, slug) => [{ type: "Authors", id: slug }],
        }),

        createAuthor: builder.mutation<Author, Partial<Author>>({
            query: (body) => ({
                url: "library/authors/",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Authors", id: "LIST" }],
        }),

        updateAuthor: builder.mutation<
            Author,
            { slug: string; data: Partial<Author> }
        >({
            query: ({ slug, data }) => ({
                url: `library/authors/${slug}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { slug }) => [{ type: "Authors", slug }],
        }),

        deleteAuthor: builder.mutation<{ success: boolean }, string>({
            query: (slug) => ({
                url: `library/authors/${slug}/`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, slug) => [{ type: "Authors", slug }],
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
