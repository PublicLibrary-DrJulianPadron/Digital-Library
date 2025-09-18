import { apiSlice } from "@/common/api/apiSlice";
import type { components } from "@/common/types/generated-api-types";

export type Profile = components["schemas"]["Profile"];
export type ProfileList = components["schemas"]["PaginatedMinimalProfileList"];
export type ProfileRequest = components["schemas"]["ProfileRequest"];

export const profileApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProfiles: builder.query<
            ProfileList,
            { page?: number; page_size?: number; search?: string }
        >({
            query: ({ page, page_size, search } = {}) => {
                let params = ``;
                if (page) {
                    params += `page=${encodeURIComponent(page)}`;
                }
                if (page_size) {
                    params += `&page_size=${encodeURIComponent(page_size)}`;
                }
                if (search) {
                    params += `&search=${encodeURIComponent(search)}`;
                }
                return `/profiles/?${params}`;
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.results.map(({ id }) => ({
                            type: "Profiles" as const,
                            id: id,
                        })),
                        { type: "Profiles", id: "LIST" },
                    ]
                    : [{ type: "Profiles", id: "LIST" }],
        }),
        getProfileById: builder.query<Profile, string>({
            query: (id) => `/profiles/${id}/`,
            providesTags: (result, error, id) => [{ type: "Profiles", id }],
        }),
        createProfile: builder.mutation<Profile, Partial<ProfileRequest>>({
            query: (body) => ({
                url: "/profiles/",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Profiles", id: "LIST" }],
        }),
        updateProfile: builder.mutation<
            Profile,
            { id: string; data: Partial<ProfileRequest> }
        >({
            query: ({ id, data }) => ({
                url: `/profiles/${id}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Profiles", id }],
        }),
        deleteProfile: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({
                url: `/profiles/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [{ type: "Profiles", id }],
        }),
    }),
});

export const {
    useGetProfilesQuery,
    useGetProfileByIdQuery,
    useCreateProfileMutation,
    useUpdateProfileMutation,
    useDeleteProfileMutation,
} = profileApiSlice;