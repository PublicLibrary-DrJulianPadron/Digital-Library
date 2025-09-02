// src/features/books/api/booksApiSlice.ts
import { apiSlice } from "@/common/api/apiSlice";
import type { components } from "@/common/types/generated-api-types";

export type Book = components["schemas"]["Book"];
export type BookRequest = components["schemas"]["BookRequest"];
export type PatchedBookRequest = components["schemas"]["PatchedBookRequest"];
export type BooksList = Book[];

export const booksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query<
      BooksList,
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
      providesTags: (result) =>
        result
          ? [...result.map(({ title }) => ({ type: 'Books' as const, title })), { type: 'Books', id: 'LIST' }]
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
    getBookById: builder.query<Book, string>({
      query: (id) => `/library/books/${id}/`,
      providesTags: (result, error, id) => [{ type: "Books", id }],
    }),
    updateBook: builder.mutation<Book, { id: string; body: BookRequest }>({
      query: ({ id, body }) => ({
        url: `/library/books/${id}/`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Books", id }],
    }),
    partialUpdateBook: builder.mutation<Book, { id: string; body: PatchedBookRequest }>({
      query: ({ id, body }) => ({
        url: `/library/books/${id}/`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Books", id }],
    }),
    deleteBook: builder.mutation<void, string>({
      query: (id) => ({
        url: `/library/books/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Books', id }, { type: 'Books', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBooksQuery,
  useCreateBookMutation,
  useGetBookByIdQuery,
  useUpdateBookMutation,
  usePartialUpdateBookMutation,
  useDeleteBookMutation,
} = booksApiSlice;