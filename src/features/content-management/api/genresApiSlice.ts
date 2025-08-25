// src/features/metadata/api/genresApiSlice.ts
import { apiSlice } from '@/common/api/apiSlice';
import type { components } from '@/common/types/generated-api-types';

export type Genre = components['schemas']['Genre'];
export type GenresList = Genre[];
export type GenreRequest = Omit<Genre, "id">;

export type GenreBooks = components['schemas']['GenreBooks'];
export type GenresWithBooksList = GenreBooks[];


export const genresApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGenres: builder.query<GenresList, void>({
      query: () => `/library/genres/`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Genres', id } as const)),
              { type: 'Genres', id: 'LIST' },
            ]
          : [{ type: 'Genres', id: 'LIST' }],
    }),
    getGenresWithBooks: builder.query<GenresWithBooksList, void>({
      query: () => `/library/genres-with-books/`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Genres', id } as const)),
              { type: 'Genres', id: 'LIST' },
            ]
          : [{ type: 'Genres', id: 'LIST' }],
    }),
    getGenreById: builder.query<Genre, number>({
      query: (id) => `/library/genres/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Genres', id }],
    }),
    createGenre: builder.mutation<Genre, GenreRequest>({
      query: (newGenre) => ({
        url: `/library/genres/`,
        method: 'POST',
        body: newGenre,
      }),
      invalidatesTags: [{ type: 'Genres', id: 'LIST' }],
    }),
    updateGenre: builder.mutation<Genre, { id: number; data: Partial<Genre> }>({
      query: ({ id, data }) => ({
        url: `/library/genres/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Genres', id }, { type: 'Genres', id: 'LIST' }],
    }),
    deleteGenre: builder.mutation<void, number>({
      query: (id) => ({
        url: `/library/genres/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Genres', id }, { type: 'Genres', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetGenresQuery,
  useGetGenresWithBooksQuery,
  useGetGenreByIdQuery,
  useCreateGenreMutation,
  useUpdateGenreMutation,
  useDeleteGenreMutation,
} = genresApiSlice;