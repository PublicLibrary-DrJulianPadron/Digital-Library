import { configureStore } from '@reduxjs/toolkit';
import storage from "redux-persist/lib/storage"; 
import { persistReducer, persistStore } from "redux-persist";
import authReducer from "@/features/authentication/store/authSlice";
import profileReducer from "@/features/users/store/profileSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ['auth', 'profile'],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedProfileReducer = persistReducer(persistConfig, profileReducer);


export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    profile: persistedProfileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;