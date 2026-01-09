import { SuperAdminLoginApiResponse, SuperAdminLoginRequest } from "@/app/utility/type/super-admin/superAdminAuthType"
import { baseApi } from "../base-api/baseApi"

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<SuperAdminLoginApiResponse, SuperAdminLoginRequest>({
            query: (data) => ({
                url: "/login-super-admin",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Auth"],
        }),

        profile: builder.query({
            query: () => "/super-admin-profile",
            providesTags: ["Auth"],
        }),

        logout: builder.mutation({
            query: () => ({
                url: "/super-admin-logout",
                method: "GET",
            }),
            invalidatesTags: ["Auth"],
        }),
        superAdminProfileUpdate : builder.mutation({
            query : (values) =>({
                url : `/super-admin-profile-update`,
                method : "PUT",
                body : values
            }),
            invalidatesTags : ["Auth"]
        }),
        superAdminProfileImageUpdate : builder.mutation({
            query : (formData)=>({
                url : `/super-admin-img-update`,
                method : "PUT",
                body : formData
            }),
            invalidatesTags:["Auth"]
        })

    }),
})

export const {
    useLoginMutation,
    useProfileQuery,
    useLogoutMutation,
    useSuperAdminProfileUpdateMutation,
    useSuperAdminProfileImageUpdateMutation
} = authApi
