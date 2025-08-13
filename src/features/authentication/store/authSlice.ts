// src/features/authentication/store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import api from '@/common/api/apiClient';
import type { components } from '@/common/types/generated-api-types';

export type AuthResponse = components['schemas']['AccessToken'];
export type LoginRequest = components['schemas']['LoginRequest'];
export type SingUpRequest = components['schemas']['SingUpRequest'];

// Login thunk
export const logIn = createAsyncThunk<
  AuthResponse,
  LoginRequest,
  { rejectValue: string }
>(
  'auth/logIn',
  async (credentials, thunkAPI) => {
    try {
      const response = await api.post('users/login/', { json: credentials }).json<AuthResponse>();
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.message ?? 'Login failed');
    }
  }
);

// Signup thunk
export const signUp = createAsyncThunk<
  AuthResponse,
  SingUpRequest,
  { rejectValue: string }
>(
  'auth/signUp',
  async (data, thunkAPI) => {
    try {
      const response = await api.post('users/register/', { json: data }).json<AuthResponse>();
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.message ?? 'Signup failed');
    }
  }
);

interface AuthState {
  accessToken: AuthResponse['access'] | null;
  status: 'idle' | 'loading' | 'failed' | 'succeeded';
  error: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.status = 'succeeded';
      state.error = null;
    },
    clearCredentials: (state) => {
      state.accessToken = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login lifecycle
      .addCase(logIn.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.accessToken = action.payload.access;
        state.error = null;
      })
      .addCase(logIn.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Unknown error';
        state.accessToken = null;
      })
      // Signup lifecycle
      .addCase(signUp.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state) => {
        // Usually signUp just returns created user or confirmation,
        // no tokens, so no state change except status
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Unknown error';
      });
  }
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;
