import { configureStore } from '@reduxjs/toolkit';
import authReducer from "@/features/authentication/store/authSlice";
import profileReducer from "@/features/users/store/profileSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
  },
});


export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;