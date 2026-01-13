// src/features/authentication/store/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApiSlice, AuthUserResponse } from './authApiSlice.ts';
import type { AppRole } from '../types/user_roles';

interface AuthState {
  isAuthenticated: boolean;
  userRole: AppRole | null;
  user: AuthUserResponse | null;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userRole: null,
  user: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsAuthenticated: (state) => {
      state.isAuthenticated = true;
      state.error = null;
    },
    setUserRole: (state, action: PayloadAction<AppRole | null>) => {
      state.userRole = action.payload;
    },
    setUser: (state, action: PayloadAction<AuthUserResponse | null>) => {
      state.user = action.payload;
    },
    clearIsAuthenticated: (state) => {
      state.isAuthenticated = false;
      state.userRole = null;
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApiSlice.endpoints.logIn.matchFulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addMatcher(authApiSlice.endpoints.logIn.matchRejected, (state, action) => {
        state.isAuthenticated = false;
        state.userRole = null;
        state.user = null;
        state.error = action.error?.message ?? 'Unknown error';
      })
      .addMatcher(authApiSlice.endpoints.signUp.matchFulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addMatcher(authApiSlice.endpoints.signUp.matchRejected, (state, action) => {
        state.isAuthenticated = false;
        state.userRole = null;
        state.user = null;
        state.error = action.error?.message ?? 'Unknown error';
      })
      .addMatcher(authApiSlice.endpoints.signOut.matchFulfilled, (state) => {
        state.isAuthenticated = false;
        state.userRole = null;
        state.user = null;
        state.error = null;
      })
      .addMatcher(authApiSlice.endpoints.signOut.matchRejected, (state, action) => {
        state.isAuthenticated = false;
        state.userRole = null;
        state.user = null;
        state.error = action.error?.message ?? 'Unknown error';
      });
  },
});

export const { setIsAuthenticated, setUserRole, setUser, clearIsAuthenticated } = authSlice.actions;
export default authSlice.reducer;