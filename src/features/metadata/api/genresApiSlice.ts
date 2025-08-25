// src/features/metadata/api/genresApiSlice.ts
import { apiSlice } from '@/common/api/apiSlice';
import type { components } from '@/common/types/generated-api-types';

export type Genre = components['schemas']['Genre'];
export type GenresList = Genre[];

export type GenreBooks = components['schemas']['GenreBooks'];
export type GenresWithBooksList = GenreBooks[];

export const genresApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGenres: builder.query<GenresList, void>({
      query: () => `/api/library/genres/`,
    }),
    getGenresWithBooks: builder.query<GenresWithBooksList, void>({
      query: () => `/api/library/genres-with-books/`,
    }),
  }),
  overrideExisting: false,
});

export const { useGetGenresQuery, useGetGenresWithBooksQuery } = genresApiSlice;
