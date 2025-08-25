// src/features/metadata/api/languagesApiSlice.ts
import { apiSlice } from '@/common/api/apiSlice';
import type { components } from '@/common/types/generated-api-types';

export type Language = components['schemas']['Language'];
export type LanguageRequest = components['schemas']['LanguageRequest'];
export type PatchedLanguageRequest = components['schemas']['PatchedLanguageRequest'];
export type LanguagesList = Language[];

export const languagesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLanguages: builder.query<LanguagesList, void>({
      query: () => `/library/languages/`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Languages' as const, id })), { type: 'Languages', id: 'LIST' }]
          : [{ type: 'Languages', id: 'LIST' }],
    }),
    createLanguage: builder.mutation<Language, LanguageRequest>({
      query: (newLanguage) => ({
        url: `/library/languages/`,
        method: 'POST',
        body: newLanguage,
      }),
      invalidatesTags: [{ type: 'Languages', id: 'LIST' }],
    }),
    getLanguageById: builder.query<Language, number>({
      query: (id) => `/library/languages/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Languages', id }],
    }),
    updateLanguage: builder.mutation<Language, { id: number; body: LanguageRequest }>({
      query: (languageData) => ({
        url: `/library/languages/${languageData.id}/`,
        method: 'PUT',
        body: languageData.body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Languages', id }],
    }),
    partialUpdateLanguage: builder.mutation<Language, { id: number; body: PatchedLanguageRequest }>({
      query: (languageData) => ({
        url: `/library/languages/${languageData.id}/`,
        method: 'PATCH',
        body: languageData.body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Languages', id }],
    }),
    deleteLanguage: builder.mutation<void, number>({
      query: (id) => ({
        url: `/library/languages/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Languages', id }, { type: 'Languages', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLanguagesQuery,
  useCreateLanguageMutation,
  useGetLanguageByIdQuery,
  useUpdateLanguageMutation,
  usePartialUpdateLanguageMutation,
  useDeleteLanguageMutation,
} = languagesApiSlice;
