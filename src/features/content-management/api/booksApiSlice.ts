import { apiSlice } from "@/common/api/apiSlice";
import type { components, paths, operations } from "@/common/types/generated-api-types";

export type Book = components["schemas"]["Book"];
export type MinimalBook = components["schemas"]["MinimalBook"];
export type BookRequest = paths["/library/books/{slug}/"]["put"]["requestBody"];
export type PatchedBookRequest = paths["/library/books/{slug}/"]["patch"]["requestBody"];
export type BooksList = components["schemas"]["PaginatedMinimalBookList"];
export type BooksListRequest = operations["library_books_list"]["parameters"]["query"];

export const booksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query<
      BooksList,
      { search?: string; author?: string; genres__name?: string; publication_date?: string; material_type?: string; language?: string; page?: number; page_size?: number } | void
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
          url: `library/books/`,
          params,
        };
      },
      transformResponse: (response: BooksList) => response,
      providesTags: (result) =>
        result?.results
          ? [...result.results.map(({ id }) => ({ type: 'Books' as const, id })), { type: 'Books', id: 'LIST' }]
          : [{ type: 'Books', id: 'LIST' }],
    }),
    createBook: builder.mutation<Book, FormData>({
      query: (formData) => ({
        url: `library/books/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Books", id: "LIST" }],
    }),
    getBookBySlug: builder.query<Book, string>({
      query: (slug) => `library/books/${slug}/`,
      providesTags: (result, error, slug) => [{ type: "Books", id: 'LIST' }],
    }),
    updateBook: builder.mutation<Book, { slug: string; formData: FormData }>({
      query: ({ slug, formData }) => ({
        url: `library/books/${slug}/`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { slug }) => [{ type: "Books", id: 'LIST' }],
    }),
    partialUpdateBook: builder.mutation<Book, { slug: string; body: PatchedBookRequest }>({
      query: ({ slug, body }) => ({
        url: `library/books/${slug}/`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: (result, error, { slug }) => [{ type: "Books", id: 'LIST' }],
    }),
    deleteBook: builder.mutation<void, string>({
      query: (slug) => ({
        url: `library/books/${slug}/`,
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