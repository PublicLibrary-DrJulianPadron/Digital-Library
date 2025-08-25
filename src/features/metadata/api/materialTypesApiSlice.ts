// src/features/metadata/api/materialTypesApiSlice.ts
import { apiSlice } from '@/common/api/apiSlice';
import type { components } from '@/common/types/generated-api-types';

export type MaterialType = components['schemas']['MaterialType'];
export type MaterialTypeRequest = components['schemas']['MaterialTypeRequest'];
export type PatchedMaterialTypeRequest = components['schemas']['PatchedMaterialTypeRequest'];
export type MaterialTypesList = MaterialType[];

export const materialTypesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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
        method: 'POST',
        body: newMaterialType,
      }),
      invalidatesTags: [{ type: 'MaterialTypes', id: 'LIST' }],
    }),
    getMaterialTypeById: builder.query<MaterialType, number>({
      query: (id) => `/api/library/material-types/${id}/`,
      providesTags: (result, error, id) => [{ type: 'MaterialTypes', id }],
    }),
    updateMaterialType: builder.mutation<MaterialType, { id: number; body: MaterialTypeRequest }>({
      query: (materialTypeData) => ({
        url: `/api/library/material-types/${materialTypeData.id}/`,
        method: 'PUT',
        body: materialTypeData.body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'MaterialTypes', id }],
    }),
    partialUpdateMaterialType: builder.mutation<MaterialType, { id: number; body: PatchedMaterialTypeRequest }>({
      query: (materialTypeData) => ({
        url: `/api/library/material-types/${materialTypeData.id}/`,
        method: 'PATCH',
        body: materialTypeData.body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'MaterialTypes', id }],
    }),
    deleteMaterialType: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/library/material-types/${id}/`,
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
