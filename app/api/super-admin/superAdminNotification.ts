import { url } from "inspector";
import { baseApi } from "../base-api/baseApi";

export const superAdminNotification = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    allNotification : builder.query({
        query : ()=>({
            url : `/all-notification`,
            method : "GET",
        }),
        providesTags : ["SuperAdminNotification"]
    }),
    unreadNotification : builder.query({
        query : ()=>({
            url : `/unread-notification`,
            method : "GET"
        }),
        providesTags : ["SuperAdminNotification"]
    }),
    readSingleNotification : builder.mutation({
        query : (id)=>({

            url : `/read-notification/${id}`,
            method : "PUT"
        }),
        invalidatesTags : ["SuperAdminNotification"]
    }),
    readAllNotification : builder.mutation({
        query : ()=>({
            url : `/read-all-notification`,
            method : "PUT"
        })
    })
  }),
});

export const {
    useAllNotificationQuery,
    useUnreadNotificationQuery,
    useReadSingleNotificationMutation,
    useReadAllNotificationMutation
  
} = superAdminNotification;
