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
                url: 'users/login/',
                method: 'POST',
                body: payload,
            }),
        }),
        signUp: builder.mutation<AuthSuccessResponse, SignUpRequest>({
            query: (payload) => ({
                url: 'users/signup/',
                method: 'POST',
                body: payload,
            }),
        }),
        signOut: builder.mutation<AuthSuccessResponse, void>({
            query: () => ({
                url: 'users/signout/',
                method: 'POST',
                body: {},
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    deleteCookie('csrftoken');
                    dispatch(apiSlice.util.invalidateTags(['Profile']));
                } catch (error) {
                    console.error('Logout failed:', error);
                }
            },
        }),
    }),
    overrideExisting: false,
});

export const { useLogInMutation, useSignUpMutation, useSignOutMutation } = authApiSlice;