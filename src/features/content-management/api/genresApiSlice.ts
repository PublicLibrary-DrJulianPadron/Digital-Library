// src/features/metadata/api/genresApiSlice.ts
import { apiSlice } from '@/common/api/apiSlice';
import type { components } from '@/common/types/generated-api-types';

export type Genre = components['schemas']['Genre'];
export type GenresList = Genre[];
export type GenreRequest = Omit<Genre, "id">;

export type PaginatedBookList = {
  results: components['schemas']['MinimalBook'][];
  count: number;
};

// Assuming the API returns a list of genres where each genre has an associated list of books.
export type GenreWithBooks = Genre & { books: components['schemas']['MinimalBook'][] };
export type GenresWithBooksList = GenreWithBooks[];


export const genresApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGenres: builder.query<{ results: GenresList; count: number }, void>({
      query: () => `/library/genres/`,
      providesTags: (result) =>
        result?.results
          ? [
              ...result.results.map(({ slug }) => ({ type: 'Genres', slug } as const)),
              { type: 'Genres', id: 'LIST' },
            ]
          : [{ type: 'Genres', id: 'LIST' }],
    }),
    getBooksByGenreSlug: builder.query<PaginatedBookList, { slug: string; search?: string }>({
      query: ({ slug, search }) =>
        `/library/genres/${slug}/list/${search ? `?search=${search}` : ''}`,
      providesTags: (_result, _error, { slug }) => [{ type: 'Genres', slug }],
    }),
    getGenreBySlug: builder.query<Genre, string>({
      query: (slug) => `/library/genres/${slug}/`,
      providesTags: (_result, _error, slug) => [{ type: 'Genres', slug }],
    }),
    getGenresWithBooks: builder.query<GenresWithBooksList, Record<string, number>>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        for (const key in params) {
          searchParams.append(key, String(params[key]));
        }
        const queryString = searchParams.toString();
        return `/library/genres/with-books/${queryString ? `?${queryString}` : ''}`;
      },
    }),
    createGenre: builder.mutation<Genre, GenreRequest>({
      query: (newGenre) => ({
        url: `/library/genres/`,
        method: 'POST',
        body: newGenre,
      }),
      invalidatesTags: [{ type: 'Genres', id: 'LIST' }],
    }),
    updateGenre: builder.mutation<Genre, { slug: string; data: Partial<Genre> }>({
      query: ({ slug, data }) => ({
        url: `/library/genres/${slug}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { slug }) => [{ type: 'Genres', slug }, { type: 'Genres', id: 'LIST' }],
    }),
    partialUpdateGenre: builder.mutation<Genre, { slug: string; data: Partial<Genre> }>({
      query: ({ slug, data }) => ({
        url: `/library/genres/${slug}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { slug }) => [{ type: 'Genres', slug }],
    }),
    deleteGenre: builder.mutation<void, string>({
      query: (slug) => ({
        url: `/library/genres/${slug}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, slug) => [{ type: 'Genres', slug }, { type: 'Genres', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetGenresQuery,
  useGetBooksByGenreSlugQuery,
  useGetGenreBySlugQuery,
  useGetGenresWithBooksQuery,
  useCreateGenreMutation,
  useUpdateGenreMutation,
  usePartialUpdateGenreMutation,
  useDeleteGenreMutation,
} = genresApiSlice;