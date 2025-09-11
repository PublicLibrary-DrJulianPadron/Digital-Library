// src/features/metadata/api/genresApiSlice.ts
import { apiSlice } from '@/common/api/apiSlice';
import type { components, paths } from '@/common/types/generated-api-types';

export type Genre = components['schemas']['Genre'];
export type GenresList = components['schemas']['PaginatedMinimalGenreList'];
export type GenreRequest = components["schemas"]["GenreRequest"];

export type PaginatedBookList = components["schemas"]["PaginatedMinimalBookList"];


// Assuming the API returns a list of genres where each genre has an associated list of books.
export type SalaWithGenres = components['schemas']['SalaWithGenres'];
export type SalaWithGenresList = SalaWithGenres[];

export const genresApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGenres: builder.query<
      GenresList,
      { page?: number; page_size?: number; search?: string } // Add pagination params
    >({
      query: ({ page = 1, page_size = 10, search } = {}) => {
        let params = `page=${page}&page_size=${page_size}`;
        if (search) {
          params += `&search=${encodeURIComponent(search)}`;
        }
        return `/library/genres/?${params}`; // Add params to URL
      },
      providesTags: (result) =>
        result?.results
          ? [
            ...result.results.map(({ slug }) => ({
              type: 'Genres' as const,
              id: slug // Use slug as unique identifier
            })),
            { type: 'Genres', id: 'LIST' },
          ]
          : [{ type: 'Genres', id: 'LIST' }],
    }),
    getBooksByGenreSlug: builder.query<PaginatedBookList, { slug?: string; search?: string; page?: number; page_size?: number }>({
      query: ({ slug, search, page, page_size }) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (page) params.append('page', String(page));
        if (page_size) params.append('page_size', String(page_size));

        const url = slug ? `/library/genres/${slug}/books/?${params.toString()}` : `/library/books/?${params.toString()}`;
        return url;
      },
      providesTags: (_result, _error, { slug }) =>
        slug ? [{ type: 'Genres', slug }] : [{ type: 'Books', id: 'LIST' }],
    }),
    getGenreBySlug: builder.query<Genre, string>({
      query: (slug) => `/library/genres/${slug}/`,
      providesTags: (_result, _error, slug) => [{ type: 'Genres', slug }],
    }),
    getSalaWithGenres: builder.query<SalaWithGenresList, Record<string, number> | void>({
      query: (params) => ({
        url: `/library/genres/with_books`,
        ...(params && Object.keys(params).length > 0 ? { params } : {}),
      }),
      providesTags: (_result, _error, arg) =>
        arg ? [{ type: 'Genres', slug: JSON.stringify(arg) }] : [{ type: 'Genres', slug: 'LIST' }],
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
  useGetSalaWithGenresQuery,
  useCreateGenreMutation,
  useUpdateGenreMutation,
  usePartialUpdateGenreMutation,
  useDeleteGenreMutation,
} = genresApiSlice;