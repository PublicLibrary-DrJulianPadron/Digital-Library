// src/features/content-manegement/api/userApiSlice.ts
import { apiSlice } from "@/common/api/apiSlice";
import type { components } from "@/common/types/generated-api-types";

export type User = components["schemas"]["User"];
export type UserList = components["schemas"]["PaginatedProfileList"];
export type UserRequest = components["schemas"]["UserRequest"];

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<
      UserList,
      { page?: number; page_size?: number; search?: string }
    >({
      query: ({ page, page_size, search } = {}) => {
        let params = ``;
        if (page) {
          params += `page=${encodeURIComponent(page)}`;
        }
        if (page_size) {
          params += `&page_size=${encodeURIComponent(page_size)}`;
        }
        if (search) {
          params += `&search=${encodeURIComponent(search)}`;
        }
        return `/user/?${params}`;
      },
      providesTags: (result) =>
        result
          ? [
            ...result.results.map(({ id }) => ({
              type: "User" as const,
              id: id,
            })),
            { type: "User", id: "LIST" },
          ]
          : [{ type: "User", id: "LIST" }],
    }),
    getUserById: builder.query<User, string>({
      query: (id) => `/user/${id}/`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    createUser: builder.mutation<User, Partial<UserRequest>>({
      query: (body) => ({
        url: "/user/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    updateUser: builder.mutation<
      User,
      { id: string; data: Partial<UserRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/user/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),
    deleteUser: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/user/${id}/`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, id) => [{ type: "User", id }],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApiSlice;