// src/features/metadata/api/languagesApiSlice.ts
import { apiSlice } from '@/common/api/apiSlice';
import type { components } from '@/common/types/generated-api-types';

export type Language = components['schemas']['Language'];
export type LanguagesList = components['schemas']['PaginatedMinimalLanguageList'];
export type LanguageRequest = components['schemas']['LanguageRequest'];
export type PatchedLanguageRequest = components['schemas']['PatchedLanguageRequest'];

export const languagesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLanguages: builder.query<LanguagesList, { page?: number; page_size?: number; search?: string; sala?: string }>({
      query: ({ page, page_size, search, sala }) => {
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (page_size) params.append('page_size', page_size.toString());
        if (search) params.append('search', search);
        if (sala) params.append('sala', sala);
        return `library/languages/?${params.toString()}`;
      },
      transformResponse: (response: any) =>
        Array.isArray(response) ? response : response.results ?? [],
      providesTags: (results) =>
        results && results.results
          ? [
            ...results.results.map(({ id }) => ({
              type: "Languages" as const,
              id,
            })),
            { type: "Languages", id: "LIST" },
          ]
          : [{ type: "Languages", id: "LIST" }],
    }),
    createLanguage: builder.mutation<Language, LanguageRequest>({
      query: (newLanguage) => ({
        url: `library/languages/`,
        method: 'POST',
        body: newLanguage,
      }),
      invalidatesTags: [{ type: 'Languages', id: 'LIST' }],
    }),
    getLanguageBySlug: builder.query<Language, string>({
      query: (slug) => `library/languages/${slug}/`,
      providesTags: (result, error, slug) => [{ type: 'Languages', slug }],
    }),
    updateLanguage: builder.mutation<Language, { slug: string; body: LanguageRequest }>({
      query: (languageData) => ({
        url: `/library/languages/${languageData.slug}/`,
        method: 'PUT',
        body: languageData.body,
      }),
      invalidatesTags: (result, error, { slug }) => [{ type: 'Languages', slug }],
    }),
    partialUpdateLanguage: builder.mutation<Language, { slug: string; body: PatchedLanguageRequest }>({
      query: (languageData) => ({
        url: `/library/languages/${languageData.slug}/`,
        method: 'PATCH',
        body: languageData.body,
      }),
      invalidatesTags: (result, error, { slug }) => [{ type: 'Languages', slug }],
    }),
    deleteLanguage: builder.mutation<void, string>({
      query: (slug) => ({
        url: `library/languages/${slug}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, slug) => [{ type: 'Languages', slug }, { type: 'Languages', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLanguagesQuery,
  useCreateLanguageMutation,
  useGetLanguageBySlugQuery,
  useUpdateLanguageMutation,
  usePartialUpdateLanguageMutation,
  useDeleteLanguageMutation,
} = languagesApiSlice;