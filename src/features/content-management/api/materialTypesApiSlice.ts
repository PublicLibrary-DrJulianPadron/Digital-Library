// src/features/metadata/api/materialTypesApiSlice.ts
import { apiSlice } from '@/common/api/apiSlice';
import type { components } from '@/common/types/generated-api-types';

export type MaterialType = components['schemas']['MaterialType'];
export type MaterialTypesList = components['schemas']['PaginatedMinimalMaterialTypeList'];
export type MaterialTypeRequest = components['schemas']['MaterialTypeRequest'];
export type PatchedMaterialTypeRequest = components['schemas']['PatchedMaterialTypeRequest'];

export const materialTypesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMaterialTypes: builder.query<
      MaterialTypesList,
      { page?: number; page_size?: number; search?: string; }
    >({
      query: ({ page, page_size, search }) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page.toString());
        if (page_size) params.append("page_size", page_size.toString());
        if (search) params.append("search", search);
        return `/library/material-types/?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
            ...result.results.map(({ id }) => ({
              type: "MaterialTypes" as const,
              id: id,
            })),
            { type: "MaterialTypes", id: "LIST" },
          ]
          : [{ type: "MaterialTypes", id: "LIST" }],
    }),
    createMaterialType: builder.mutation<MaterialType, MaterialTypeRequest>({
      query: (newMaterialType) => ({
        url: `/library/material-types/`,
        method: 'POST',
        body: newMaterialType,
      }),
      invalidatesTags: [{ type: 'MaterialTypes', id: 'LIST' }],
    }),
    getMaterialTypeBySlug: builder.query<MaterialType, string>({
      query: (slug) => `/library/material-types/${slug}/`,
      providesTags: (result, error, slug) => [{ type: 'MaterialTypes', slug }],
    }),
    updateMaterialType: builder.mutation<MaterialType, { slug: string; body: MaterialTypeRequest }>({
      query: (materialTypeData) => ({
        url: `/library/material-types/${materialTypeData.slug}/`,
        method: 'PUT',
        body: materialTypeData.body,
      }),
      invalidatesTags: (result, error, { slug }) => [{ type: 'MaterialTypes', slug }],
    }),
    partialUpdateMaterialType: builder.mutation<MaterialType, { slug: string; body: PatchedMaterialTypeRequest }>({
      query: (materialTypeData) => ({
        url: `/library/material-types/${materialTypeData.slug}/`,
        method: 'PATCH',
        body: materialTypeData.body,
      }),
      invalidatesTags: (result, error, { slug }) => [{ type: 'MaterialTypes', slug }],
    }),
    deleteMaterialType: builder.mutation<void, string>({
      query: (slug) => ({
        url: `/library/material-types/${slug}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, slug) => [{ type: 'MaterialTypes', slug }, { type: 'MaterialTypes', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMaterialTypesQuery,
  useCreateMaterialTypeMutation,
  useGetMaterialTypeBySlugQuery,
  useUpdateMaterialTypeMutation,
  usePartialUpdateMaterialTypeMutation,
  useDeleteMaterialTypeMutation,
} = materialTypesApiSlice;