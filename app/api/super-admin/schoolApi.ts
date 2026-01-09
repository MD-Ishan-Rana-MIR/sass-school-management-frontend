import { baseApi } from "../base-api/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createSchool: builder.mutation({
      query: (data) => ({
        url: "/school-create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["School"],
    }),

    allSchool: builder.query({
      query: () => ({
        url: "/all-school",
        method: "GET",
      }),
      providesTags: ["School"],
    }),

    schoolUpdate: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/school-update/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["School"],
    }),

    deleteSchool: builder.mutation({
      query: (id) => ({
        url: `/school-delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["School"],
    }),

    // ✅ STATUS TOGGLE API
    schoolStatusUpdate: builder.mutation({
      query: (id) => ({
        url: `/school-status-update/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["School"],
    }),

  }),
});

export const {
  useCreateSchoolMutation,
  useAllSchoolQuery,
  useSchoolUpdateMutation,
  useDeleteSchoolMutation,
  useSchoolStatusUpdateMutation,
} = authApi;
