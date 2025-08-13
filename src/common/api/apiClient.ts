// src/common/api/apiClient.ts

import ky from 'ky';
import { RootState } from '@/app/store';
import store from '@/app/store';
import { setCredentials } from '@/features/authentication/store/authSlice';
import type { components } from '@/common/types/generated-api-types';

export type AuthResponse = components['schemas']['AccessToken'];

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

const api = ky.create({
  prefixUrl: import.meta.env.VITE_API_BASE_URL,
  hooks: {
    beforeRequest: [
      request => {
        const token = (store.getState() as RootState).auth.accessToken;
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then(token => {
              const newRequest = request.clone();
              newRequest.headers.set('Authorization', `Bearer ${token}`);
              return ky(newRequest);
            });
          }

          isRefreshing = true;

          try {
            const refreshResponse = await ky.get('users/token/refresh/', {
              prefixUrl: import.meta.env.VITE_API_BASE_URL,
            }).json<AuthResponse>();

            const newAccessToken = refreshResponse.access;
            store.dispatch(setCredentials({ accessToken: newAccessToken }));

            processQueue(null, newAccessToken);
            isRefreshing = false;
            const newRequest = request.clone();
            newRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);
            return ky(newRequest);
          } catch (err) {
            processQueue(err, null);
            isRefreshing = false;
            window.location.href = '/login';
            throw err;
          }
        }
        return response;
      },
    ],
  },
});

export default api;