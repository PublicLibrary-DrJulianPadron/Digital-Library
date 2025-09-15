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
    getMaterialTypeById: builder.query<MaterialType, number>({
      query: (id) => `/library/material-types/${id}/`,
      providesTags: (result, error, id) => [{ type: 'MaterialTypes', id }],
    }),
    updateMaterialType: builder.mutation<MaterialType, { id: number; body: MaterialTypeRequest }>({
      query: (materialTypeData) => ({
        url: `/library/material-types/${materialTypeData.id}/`,
        method: 'PUT',
        body: materialTypeData.body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'MaterialTypes', id }],
    }),
    partialUpdateMaterialType: builder.mutation<MaterialType, { id: number; body: PatchedMaterialTypeRequest }>({
      query: (materialTypeData) => ({
        url: `/library/material-types/${materialTypeData.id}/`,
        method: 'PATCH',
        body: materialTypeData.body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'MaterialTypes', id }],
    }),
    deleteMaterialType: builder.mutation<void, number>({
      query: (id) => ({
        url: `/library/material-types/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'MaterialTypes', id }, { type: 'MaterialTypes', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMaterialTypesQuery,
  useCreateMaterialTypeMutation,
  useGetMaterialTypeByIdQuery,
  useUpdateMaterialTypeMutation,
  usePartialUpdateMaterialTypeMutation,
  useDeleteMaterialTypeMutation,
} = materialTypesApiSlice;