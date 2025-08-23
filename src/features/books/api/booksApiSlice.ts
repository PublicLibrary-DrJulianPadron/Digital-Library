// src/features/books/api/booksApiSlice.ts
import { apiSlice } from "@/common/api/apiSlice";
import type { components, operations } from "@/common/types/generated-api-types";

type Book = components["schemas"]["Book"];
type BooksList = operations["api_library_books_list"]["responses"]["200"]["content"]["application/json"];
type BooksCreate = components["schemas"]["BookRequest"];
type BooksUpdate = components["schemas"]["BookRequest"];
type BooksPartialUpdate = components["schemas"]["PatchedBookRequest"];

export const booksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query<BooksList, { search?: string; author?: string; genres__name?: string; publication_date?: number } | void>({
      query: (arg) => {
        const params = new URLSearchParams();
        if (arg) {
          Object.entries(arg).forEach(([key, value]) => {
            if (value !== undefined) {
              params.append(key, String(value));
            }
          });
        }
        return {
          url: `/api/library/books/`,
          params,
        };
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Books' as const, id })), { type: 'Books', id: 'LIST' }]
          : [{ type: 'Books', id: 'LIST' }],
    }),
    createBook: builder.mutation<Book, BooksCreate>({
      query: (newBook) => ({
        url: `/api/library/books/`,
        method: "POST",
        body: newBook,
      }),
      invalidatesTags: [{ type: "Books", id: "LIST" }],
    }),
    getBookById: builder.query<Book, string>({
      query: (id) => `/api/library/books/${id}/`,
      providesTags: (result, error, id) => [{ type: "Books", id }],
    }),
    updateBook: builder.mutation<Book, { id: string; body: BooksUpdate }>({
      query: (bookData) => ({
        url: `/api/library/books/${bookData.id}/`,
        method: "PUT",
        body: bookData.body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Books", id }],
    }),
    partialUpdateBook: builder.mutation<Book, { id: string; body: BooksPartialUpdate }>({
      query: (bookData) => ({
        url: `/api/library/books/${bookData.id}/`,
        method: "PATCH",
        body: bookData.body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Books", id }],
    }),
    deleteBook: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/library/books/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Books", id }, { type: "Books", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetBooksQuery, useCreateBookMutation, useGetBookByIdQuery, useUpdateBookMutation, usePartialUpdateBookMutation, useDeleteBookMutation } = booksApiSlice;