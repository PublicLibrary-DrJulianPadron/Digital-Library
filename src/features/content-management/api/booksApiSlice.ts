// src/features/books/api/booksApiSlice.ts
import { apiSlice } from "@/common/api/apiSlice";
import type { components, paths } from "@/common/types/generated-api-types";

export type Book = components["schemas"]["Book"];
export type BookRequest = paths["/api/library/books/{slug}/"]["put"]["requestBody"];
export type PatchedBookRequest = paths["/api/library/books/{slug}/"]["patch"]["requestBody"];
export type BooksList = Book[];

export const booksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query<
      { results: BooksList; count: number },
      { search?: string; author?: string; genres__name?: string; publication_date?: string; material_type?: string; language?: string } | void
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
          url: `/library/books/`,
          params,
        };
      },
      transformResponse: (response: { results: BooksList; count: number }) => response,
      providesTags: (result) =>
        result?.results
          ? [...result.results.map(({ id }) => ({ type: 'Books' as const, id })), { type: 'Books', id: 'LIST' }]
          : [{ type: 'Books', id: 'LIST' }],
    }),
    createBook: builder.mutation<Book, BookRequest>({
      query: (newBook) => ({
        url: `/library/books/`,
        method: "POST",
        body: newBook,
      }),
      invalidatesTags: [{ type: "Books", id: "LIST" }],
    }),
    getBookBySlug: builder.query<Book, string>({
      query: (slug) => `/library/books/${slug}/`,
      providesTags: (result, error, slug) => [{ type: "Books", id: slug }],
    }),
    updateBook: builder.mutation<Book, { slug: string; body: BookRequest }>({
      query: ({ slug, body }) => ({
        url: `/library/books/${slug}/`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (result, error, { slug }) => [{ type: "Books", id: slug }],
    }),
    partialUpdateBook: builder.mutation<Book, { slug: string; body: PatchedBookRequest }>({
      query: ({ slug, body }) => ({
        url: `/library/books/${slug}/`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: (result, error, { slug }) => [{ type: "Books", id: slug }],
    }),
    deleteBook: builder.mutation<void, string>({
      query: (slug) => ({
        url: `/library/books/${slug}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, slug) => [{ type: 'Books', id: slug }, { type: 'Books', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBooksQuery,
  useCreateBookMutation,
  useGetBookBySlugQuery,
  useUpdateBookMutation,
  usePartialUpdateBookMutation,
  useDeleteBookMutation,
} = booksApiSlice;
