// src/app/store/index.ts
import {
  configureStore,
  combineReducers,
  Tuple,
  ThunkMiddleware,
} from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from '@/common/api/apiSlice';
import { authorsApiSlice }from '@/features/content-management/api/authorsApiSlice';
import { booksApiSlice }from '@/features/content-management/api/booksApiSlice';
import { genresApiSlice }from '@/features/content-management/api/genresApiSlice';
import { languagesApiSlice }from '@/features/content-management/api/languagesApiSlice';
import { materialTypesApiSlice }from '@/features/content-management/api/materialTypesApiSlice';
import { profileApiSlice }from '@/features/content-management/api/profilesApiSlice';
import { userApiSlice }from '@/features/content-management/api/userApiSlice';
import { videosApiSlice }from '@/features/content-management/api/videosApiSlice';
import authReducer from '@/features/authentication/api/authSlice';


const rootReducer = combineReducers({
  auth: authReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware as any),
});


export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;