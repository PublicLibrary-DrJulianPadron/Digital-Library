// src/common/api/apiSlice.ts
import {
    createApi,
    fetchBaseQuery,
    FetchBaseQueryError, BaseQueryFn, FetchArgs
} from '@reduxjs/toolkit/query/react';
import { getCookie } from '@/common/lib/utils';
import { RootState } from '@/app/store';

/**
 * A custom base query that handles automatic token refresh on 401 Unauthorized errors.
 * This function wraps `fetchBaseQuery` and adds logic to intercept 401 responses.
 *
 * @param args - The arguments for the fetchBaseQuery call.
 * @param api - The Redux Toolkit Query API object.
 * @param extraOptions - Extra options for the query.
 * @returns The result of the fetchBaseQuery call.
 */
const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL + 'api',
    credentials: 'include',
    prepareHeaders: (headers) => {
        const csrfToken = getCookie('csrftoken');
        if (csrfToken) {
            headers.set('X-CSRFToken', csrfToken);
        }
        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // Attempt to refresh the token
        const refreshResult = await baseQuery(
            { url: 'users/token/refresh/', method: 'POST' },
            api,
            extraOptions,
        );

        if (refreshResult.data) {
            // If refresh is successful, retry the original query
            result = await baseQuery(args, api, extraOptions);
        } else {
            // If refresh fails, you may want to redirect to the login page
            // You can dispatch a logout action here.
            // api.dispatch(logout());
        }
    }
    return result;
};

export const apiSlice = createApi({
    reducerPath: 'api',
    tagTypes: ['User','Profiles', 'Books', 'Languages', 'Loans', 'MaterialTypes', 'Genres', 'Authors', 'Videos'],
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({}),
});
