// src/features/authentication/store/authApiSlice.ts
import { apiSlice } from '@/common/api/apiSlice';
import type { AuthSuccessResponse } from '@/common/api/apiClient';
import type { components } from '@/common/types/generated-api-types';
import { deleteCookie } from '@/common/lib/utils'

export type LoginRequest = components['schemas']['LoginRequest'];
export type SignUpRequest = components['schemas']['SingUpRequest'];

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        logIn: builder.mutation<AuthSuccessResponse, LoginRequest>({
            query: (payload) => ({
                url: 'login/',
                method: 'POST',
                body: payload,
                providesTags: (result, error, id) => [{ type: "User", id }],
            }),
        }),
        signUp: builder.mutation<AuthSuccessResponse, SignUpRequest>({
            query: (payload) => ({
                url: 'signup/',
                method: 'POST',
                body: payload,
                providesTags: (result, error, id) => [{ type: "User", id }],
            }),
        }),
        signOut: builder.mutation<AuthSuccessResponse, void>({
            query: () => ({
                url: 'signout/',
                method: 'POST',
                body: {},
            }),
            invalidatesTags: [{ type: "User", id: "LIST" }],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    deleteCookie('csrftoken');
                    dispatch(apiSlice.util.invalidateTags(['User']));
                } catch (error) {
                    console.error('Logout failed:', error);
                }
            },
        }),
    }),
    overrideExisting: false,
});

export const { useLogInMutation, useSignUpMutation, useSignOutMutation } = authApiSlice;