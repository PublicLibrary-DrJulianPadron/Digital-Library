// src/features/books/api/booksApiSlice.ts
import { apiSlice } from "@/common/api/apiSlice";
import type { components } from "@/common/types/generated-api-types";

export type Book = components["schemas"]["Book"];
export type BookRequest = components["schemas"]["BookRequest"];
export type PatchedBookRequest = components["schemas"]["PatchedBookRequest"];
export type BooksList = Book[];

export type Genre = components["schemas"]["Genre"];
export type GenresList = Genre[];

export type GenreBooks = components["schemas"]["GenreBooks"];
export type GenresWithBooksList = GenreBooks[];

export type Language = components["schemas"]["Language"];
export type LanguageRequest = components["schemas"]["LanguageRequest"];
export type PatchedLanguageRequest = components["schemas"]["PatchedLanguageRequest"];
export type LanguagesList = Language[];

export type MaterialType = components["schemas"]["MaterialType"];
export type MaterialTypeRequest = components["schemas"]["MaterialTypeRequest"];
export type PatchedMaterialTypeRequest = components["schemas"]["PatchedMaterialTypeRequest"];
export type MaterialTypesList = MaterialType[];

export type Loan = components["schemas"]["Loan"];
export type LoanRequest = components["schemas"]["LoanRequest"];
export type PatchedLoanRequest = components["schemas"]["PatchedLoanRequest"];
export type LoansList = Loan[];

export const libraryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query<BooksList, { search?: string; author?: string; genres__name?: string; publication_date?: string; material_type?: string; language?: string } | void>({
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
          url: `/api/library/books/`,
          params,
        };
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Books' as const, id })), { type: 'Books', id: 'LIST' }]
          : [{ type: 'Books', id: 'LIST' }],
    }),
    createBook: builder.mutation<Book, BookRequest>({
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
    updateBook: builder.mutation<Book, { id: string; body: BookRequest }>({
      query: (bookData) => ({
        url: `/api/library/books/${bookData.id}/`,
        method: "PUT",
        body: bookData.body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Books", id }],
    }),
    partialUpdateBook: builder.mutation<Book, { id: string; body: PatchedBookRequest }>({
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
    getBookLoanHistory: builder.query<LoansList, string>({
      query: (id) => `/api/library/books/${id}/loan-history/`,
    }),
    getAllLoanHistory: builder.query<LoansList, { book?: string; ordering?: string; status?: "Active" | "Overdue" | "Returned"; user?: number } | void>({
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
          url: `/api/library/books/loan-history/`,
          params,
        };
      },
    }),
    getGenres: builder.query<GenresList, void>({
      query: () => `/api/library/genres/`,
    }),
    getGenresWithBooks: builder.query<GenresWithBooksList, void>({
      query: () => `/api/library/genres-with-books/`,
    }),
    getLanguages: builder.query<LanguagesList, void>({
      query: () => `/api/library/languages/`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Languages' as const, id })), { type: 'Languages', id: 'LIST' }]
          : [{ type: 'Languages', id: 'LIST' }],
    }),
    createLanguage: builder.mutation<Language, LanguageRequest>({
      query: (newLanguage) => ({
        url: `/api/library/languages/`,
        method: "POST",
        body: newLanguage,
      }),
      invalidatesTags: [{ type: "Languages", id: "LIST" }],
    }),
    getLanguageById: builder.query<Language, number>({
      query: (id) => `/api/library/languages/${id}/`,
      providesTags: (result, error, id) => [{ type: "Languages", id }],
    }),
    updateLanguage: builder.mutation<Language, { id: number; body: LanguageRequest }>({
      query: (languageData) => ({
        url: `/api/library/languages/${languageData.id}/`,
        method: "PUT",
        body: languageData.body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Languages", id }],
    }),
    partialUpdateLanguage: builder.mutation<Language, { id: number; body: PatchedLanguageRequest }>({
      query: (languageData) => ({
        url: `/api/library/languages/${languageData.id}/`,
        method: "PATCH",
        body: languageData.body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Languages", id }],
    }),
    deleteLanguage: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/library/languages/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Languages", id }, { type: "Languages", id: "LIST" }],
    }),
    getLoans: builder.query<LoansList, void>({
      query: () => `/api/library/loans/`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Loans' as const, id })), { type: 'Loans', id: 'LIST' }]
          : [{ type: 'Loans', id: 'LIST' }],
    }),
    createLoan: builder.mutation<Loan, LoanRequest>({
      query: (newLoan) => ({
        url: `/api/library/loans/`,
        method: "POST",
        body: newLoan,
      }),
      invalidatesTags: [{ type: "Loans", id: "LIST" }],
    }),
    getLoanById: builder.query<Loan, string>({
      query: (id) => `/api/library/loans/${id}/`,
      providesTags: (result, error, id) => [{ type: "Loans", id }],
    }),
    updateLoan: builder.mutation<Loan, { id: string; body: LoanRequest }>({
      query: (loanData) => ({
        url: `/api/library/loans/${loanData.id}/`,
        method: "PUT",
        body: loanData.body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Loans", id }],
    }),
    partialUpdateLoan: builder.mutation<Loan, { id: string; body: PatchedLoanRequest }>({
      query: (loanData) => ({
        url: `/api/library/loans/${loanData.id}/`,
        method: "PATCH",
        body: loanData.body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Loans", id }],
    }),
    deleteLoan: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/library/loans/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Loans", id }, { type: "Loans", id: "LIST" }],
    }),
    getMaterialTypes: builder.query<MaterialTypesList, void>({
      query: () => `/api/library/material-types/`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'MaterialTypes' as const, id })), { type: 'MaterialTypes', id: 'LIST' }]
          : [{ type: 'MaterialTypes', id: 'LIST' }],
    }),
    createMaterialType: builder.mutation<MaterialType, MaterialTypeRequest>({
      query: (newMaterialType) => ({
        url: `/api/library/material-types/`,
        method: "POST",
        body: newMaterialType,
      }),
      invalidatesTags: [{ type: "MaterialTypes", id: "LIST" }],
    }),
    getMaterialTypeById: builder.query<MaterialType, number>({
      query: (id) => `/api/library/material-types/${id}/`,
      providesTags: (result, error, id) => [{ type: "MaterialTypes", id }],
    }),
    updateMaterialType: builder.mutation<MaterialType, { id: number; body: MaterialTypeRequest }>({
      query: (materialTypeData) => ({
        url: `/api/library/material-types/${materialTypeData.id}/`,
        method: "PUT",
        body: materialTypeData.body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "MaterialTypes", id }],
    }),
    partialUpdateMaterialType: builder.mutation<MaterialType, { id: number; body: PatchedMaterialTypeRequest }>({
      query: (materialTypeData) => ({
        url: `/api/library/material-types/${materialTypeData.id}/`,
        method: "PATCH",
        body: materialTypeData.body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "MaterialTypes", id }],
    }),
    deleteMaterialType: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/library/material-types/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "MaterialTypes", id }, { type: "MaterialTypes", id: "LIST" }],
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
  useGetBookLoanHistoryQuery,
  useGetAllLoanHistoryQuery,
  useGetGenresQuery,
  useGetGenresWithBooksQuery,
  useGetLanguagesQuery,
  useCreateLanguageMutation,
  useGetLanguageByIdQuery,
  useUpdateLanguageMutation,
  usePartialUpdateLanguageMutation,
  useDeleteLanguageMutation,
  useGetLoansQuery,
  useCreateLoanMutation,
  useGetLoanByIdQuery,
  useUpdateLoanMutation,
  usePartialUpdateLoanMutation,
  useDeleteLoanMutation,
  useGetMaterialTypesQuery,
  useCreateMaterialTypeMutation,
  useGetMaterialTypeByIdQuery,
  useUpdateMaterialTypeMutation,
  usePartialUpdateMaterialTypeMutation,
  useDeleteMaterialTypeMutation,
} = libraryApiSlice;