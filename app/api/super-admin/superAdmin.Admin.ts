import { baseApi } from "../base-api/baseApi";

export const superAdminAdmin = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createaAdmin : builder.mutation({
        query : (formData)=>({
            url : `/create-admin`,
            method : "POST",
            body : formData
        }),
        invalidatesTags : ["SuperAdminAdmin"]
    }),
  }),
});

export const {
    useCreateaAdminMutation
  
} = superAdminAdmin;
