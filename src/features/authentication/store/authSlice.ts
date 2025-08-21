// src/features/authentication/store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { createApi } from '@/common/api/apiClient';
import { deleteCookie } from '@/common/lib/utils'
import type { AuthSuccessResponse } from '@/common/api/apiClient';
import type { components } from '@/common/types/generated-api-types';
import {clearUser } from "@/features/users/store/profileSlice";

  
export type LoginRequest = components['schemas']['LoginRequest'];
export type SingUpRequest = components['schemas']['SingUpRequest'];

export const logIn = createAsyncThunk<
  AuthSuccessResponse,
  LoginRequest,
  { rejectValue: string }
>(
  'auth/logIn',
  async (payload, thunkAPI) => {
    try {
      const api = createApi();
      const response = await api.post('users/login/', { json: payload });
      const data = await response.json<AuthSuccessResponse>();
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.message ?? 'Login failed');
    }
  }
);

export const signUp = createAsyncThunk<
  AuthSuccessResponse,
  SingUpRequest,
  { rejectValue: string }
>(
  'auth/signUp',
  async (payload, thunkAPI) => {
    try {
      const api = createApi();
      const response = await api.post('users/signup/', { json: payload });
      const data = await response.json<AuthSuccessResponse>();
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.message ?? 'Signup failed');
    }
  }
);

export const SingOut = createAsyncThunk<
  AuthSuccessResponse,
  undefined,
  { rejectValue: string }
>(
  'auth/singOut',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const api = createApi();
      const response = await api.post('users/signout/', {});
      const data = await response.json<AuthSuccessResponse>();
      deleteCookie('csrftoken');
      dispatch(clearUser());
      return data;
    } catch (error: any) {
      return rejectWithValue(error?.message ?? 'Logout failed');
    }
  }
);

interface AuthState {
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuthenticated: (state) => {
      state.isAuthenticated = true;
      state.error = null;
    },
    clearIsAuthenticated: (state) => {
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logIn.pending, (state) => {
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.isAuthenticated = !!action.payload; 
        state.error = null;
      })
      .addCase(logIn.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.error = action.payload ?? action.error.message ?? 'Unknown error';
      })
      .addCase(signUp.pending, (state) => {
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isAuthenticated = !!action.payload;
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.error = action.payload ?? action.error.message ?? 'Unknown error';
      })
      .addCase(SingOut.pending, (state) => {
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(SingOut.fulfilled, (state, action) => {
        state.isAuthenticated = !action.payload;
        state.error = null;
      })
      .addCase(SingOut.rejected, (state, action) => {
        state.isAuthenticated = !action.payload;
        state.error = action.payload ?? action.error.message ?? 'Unknown error';
      });
  }
});

export const { setIsAuthenticated, clearIsAuthenticated } = authSlice.actions;
export default authSlice.reducer;