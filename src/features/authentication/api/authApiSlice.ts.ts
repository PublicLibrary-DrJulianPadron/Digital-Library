// src/features/authentication/store/authApiSlice.ts
import { apiSlice } from '@/common/api/apiSlice';
import type { components } from '@/common/types/generated-api-types';
import { deleteCookie } from '@/common/lib/utils'

export type LoginRequest = components['schemas']['LoginRequest'];
export type SignUpRequest = components['schemas']['SingUpRequest'];

// New response type matching backend
export interface AuthUserResponse {
    first_name: string;
    last_name: string;
    email: string;
    groups: string[];
}

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        logIn: builder.mutation<AuthUserResponse, LoginRequest>({
            query: (payload) => ({
                url: 'login/',
                method: 'POST',
                body: payload,
            }),
        }),
        signUp: builder.mutation<AuthUserResponse, SignUpRequest>({
            query: (payload) => ({
                url: 'signup/',
                method: 'POST',
                body: payload,
            }),
        }),
        signOut: builder.mutation<void, void>({
            query: () => ({
                url: 'signout/',
                method: 'POST',
                body: {},
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    deleteCookie('csrftoken');
                } catch (error) {
                    console.error('Logout failed:', error);
                }
            },
        }),
    }),
    overrideExisting: false,
});

export const { useLogInMutation, useSignUpMutation, useSignOutMutation } = authApiSlice;