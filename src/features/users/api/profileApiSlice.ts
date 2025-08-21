// src/features/profile/profileApiSlice.ts
import { apiSlice } from '@/common/api/apiSlice';
import type { components } from '@/common/types/generated-api-types';

type ProfileResponse = components['schemas']['Profile'];

export const profileApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<ProfileResponse, void>({
      query: () => 'users/me/',
      providesTags: ['Profile'], 
    }),
  }),
});

export const { useGetUserProfileQuery } = profileApiSlice;