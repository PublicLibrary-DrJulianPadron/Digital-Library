// src/features/authentication/store/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApiSlice } from './authApiSlice.ts';
import type { AppRole } from '../types/user_roles';

interface AuthState {
  isAuthenticated: boolean;
  userRole: AppRole | null;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userRole: null,
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
    clearIsAuthenticated: (state) => {
      state.isAuthenticated = false;
      state.userRole = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApiSlice.endpoints.logIn.matchFulfilled, (state, action) => {
        state.isAuthenticated = !!action.payload;
        state.error = null;
      })
      .addMatcher(authApiSlice.endpoints.logIn.matchRejected, (state, action) => {
        state.isAuthenticated = false;
        state.userRole = null;
        state.error = action.error?.message ?? 'Unknown error';
      })
      .addMatcher(authApiSlice.endpoints.signUp.matchFulfilled, (state, action) => {
        state.isAuthenticated = !!action.payload;
        state.error = null;
      })
      .addMatcher(authApiSlice.endpoints.signUp.matchRejected, (state, action) => {
        state.isAuthenticated = false;
        state.userRole = null;
        state.error = action.error?.message ?? 'Unknown error';
      })
      .addMatcher(authApiSlice.endpoints.signOut.matchFulfilled, (state) => {
        state.isAuthenticated = false;
        state.userRole = null;
        state.error = null;
      })
      .addMatcher(authApiSlice.endpoints.signOut.matchRejected, (state, action) => {
        state.isAuthenticated = false;
        state.userRole = null;
        state.error = action.error?.message ?? 'Unknown error';
      });
  },
});

export const { setIsAuthenticated, setUserRole, clearIsAuthenticated } = authSlice.actions;
export default authSlice.reducer;