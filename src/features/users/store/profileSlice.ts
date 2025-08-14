// src/features/profile/profileSlice.ts
import { createApi } from '@/common/api/apiClient';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { components } from '@/common/types/generated-api-types';

type ProfileResponse = components['schemas']['Profile'];

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
  async (_, thunkAPI) => {
    try {
      const api = createApi();
      const response = await api.get('users/me/'); 
      const data = await response.json<ProfileResponse>();
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.message ?? 'User Fetch failed');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch profile';
      });
  },
});

export const { clearUser } = profileSlice.actions;

export default profileSlice.reducer;