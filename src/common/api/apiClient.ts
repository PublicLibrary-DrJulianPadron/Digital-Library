// src/common/api/apiClient.ts

import ky from 'ky';
import { getCookie } from '@/common/lib/utils'

export interface AuthSuccessResponse {
  status: string;
}

let isRefreshing = false;
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: any) => void; }[] = [];

const processQueue = (error: any, newToken = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(newToken);
  });
  failedQueue = [];
};

export function createApi() {
  const api = ky.create({
    prefixUrl: import.meta.env.VITE_API_BASE_URL + 'api',
    credentials: 'include',
    retry: {
      limit: 0,
      methods: ['get'],
      statusCodes: [401],
      backoffLimit: 3000
    },
    hooks: {
      beforeRequest: [
        (request) => {
          const csrfToken = getCookie('csrftoken');
          if (csrfToken) {
            request.headers.set('X-CSRFToken', csrfToken);
          }
        },
      ],
      afterResponse: [
        async (request, options, response) => {
          if (response.status === 401) {
            if (isRefreshing) {
              return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
              }).then(() => {
                return ky(request);
              });
            }

            isRefreshing = true;

            try {
              await ky.post('users/token/refresh/', {
                prefixUrl: import.meta.env.VITE_API_BASE_URL + 'api',
                credentials: 'include'
              });

              processQueue(null);
              isRefreshing = false;
              return ky(request);
            } catch (err) {
              processQueue(err, null);
              isRefreshing = false;
              throw err;
            }
          }
          return response;
        },
      ],
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return api;
}

// You would now use the API client like this:
// import { createApi } from './common/api/apiClient';
// const api = createApi();
// await api.get('protected/resource').json();