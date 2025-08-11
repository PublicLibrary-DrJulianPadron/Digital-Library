import ky from 'ky';

interface TokenRefreshResponse {
  access: string;
}

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

// Create the ky instance with hooks
const api = ky.create({
  prefixUrl: import.meta.env.VITE_API_BASE_URL,
  hooks: {
    beforeRequest: [
      request => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            // No refresh token: logout
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return response;
          }

          if (isRefreshing) {
            // Queue this request until token refresh finishes
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then(token => {
              // Retry the original request with new token
              const newRequest = request.clone();
              newRequest.headers.set('Authorization', `Bearer ${token}`);
              return ky(newRequest);
            });
          }

          isRefreshing = true;

          try {
            // Call refresh endpoint
            const refreshResponse = await ky.post('token/refresh/', {
              prefixUrl: import.meta.env.VITE_API_BASE_URL,
              json: { refresh: refreshToken },
            }).json<TokenRefreshResponse>();

            const newAccessToken = refreshResponse.access;
            localStorage.setItem('accessToken', newAccessToken);

            processQueue(null, newAccessToken);
            isRefreshing = false;

            // Retry original request with new token
            const newRequest = request.clone();
            newRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);
            return ky(newRequest);
          } catch (err) {
            processQueue(err, null);
            isRefreshing = false;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            throw err;
          }
        }

        // Return response normally if not 401
        return response;
      },
    ],
  },
});

export default api;
