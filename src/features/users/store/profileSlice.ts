// src/features/profile/profileSlice.ts
import api from '@/common/api/apiClient';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { paths } from '@/common/types/generated-api-types';

export type ProfileResponse = paths['/api/users/me/']['get']['responses']['200']['content']['application/json'];


export interface ProfileState {
  profile: ProfileResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk<ProfileResponse>(
  'users/loadProfile',
  async () => {
    const data = await api.get('users/me/').json<ProfileResponse>();
    return data;
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // optional reducers if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch profile';
      });
  },
});

export default profileSlice.reducer;