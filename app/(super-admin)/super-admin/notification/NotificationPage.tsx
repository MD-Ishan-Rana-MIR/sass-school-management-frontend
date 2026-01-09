"use client";

import { Bell, School, User, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAllNotificationQuery, useReadAllNotificationMutation, useReadSingleNotificationMutation } from "@/app/api/super-admin/superAdminNotification";
import { NotificationType } from "@/app/utility/type/super-admin/notificationType";
import { timeAgo } from "@/app/utility/time/timeFormat";
import NotificationSkeleton from "@/app/components/skeleton/NotificationSkeleton";
import { toast } from "sonner";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { notificationReadAlert } from "@/app/utility/alert/notificationReadAlert";




 











export default function NotificationsPage() {
    const {data,isLoading,refetch} =useAllNotificationQuery({});
    console.log(data?.data);
    const notification : NotificationType[] = data?.data || [];
    // notification read 

    const [readSingleNotification,{isLoading:notificationLoading}] = useReadSingleNotificationMutation()



    const notificationRead = async (id: string, refetch: () => void) => {
  try {
    // Call API
    const res = await readSingleNotification(id).unwrap();

    if (res) {
      refetch(); // Refetch notifications
      toast.success(res?.message || "Notification marked as read ✅");
    }
  } catch (err) {
    const error = err as FetchBaseQueryError & { data?: { message?: string } };

    const message = error.data?.message || "Something went wrong ❌";
    toast.error(message);
  }
};


    // all notification read 

    const [readAllNotification] = useReadAllNotificationMutation();

    const allNotificationRead = async ()=>{
        try {
            const res = await notificationReadAlert();
            if(res.isConfirmed){
                const res = await readAllNotification({}).unwrap();
                if(res){
                  refetch()
                    toast.success(res?.message)
                }

            }
        } catch (err) {
             const error = err as FetchBaseQueryError & { data?: { message?: string } };

    const message = error.data?.message || "Something went wrong ❌";
    toast.error(message);
        }
    }


    if(isLoading){
        return(
            <NotificationSkeleton/>
        )
    }

    



  return (
    <div className="p-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className=" flex items-center gap-x-3 " >
            <Bell className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-semibold">Notifications</h1>
        </div>
        <div>
            <Button onClick={allNotificationRead} >
                Read All
            </Button>
        </div>
      </div>

      {/* Empty State */}
      {notification.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Bell className="w-12 h-12 mb-3" />
          <p>No notifications yet</p>
        </div>
      )}

      {/* Notification List */}
      <div className="space-y-4">
        {notification.map((item) => (
          <Card
            key={item._id}
            className={cn(
              "transition border",
              !item.isRead && "border-primary/40 bg-primary/5"
            )}
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="flex items-center gap-3">
                <NotificationIcon type={item.type} />
                <div>
                  <CardTitle className="text-base">
                    {item.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {item.message}
                  </p>
                </div>
              </div>

              {!item.isRead && (
                <Badge variant="destructive">New</Badge>
              )}
            </CardHeader>

            <CardContent className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {/* {item.createdAt} */}
                  {timeAgo(item.createdAt)}

              </span>

              {!item.isRead && (
                <Button onClick={()=>{notificationRead(item?._id)}} className="cursor-pointer" size="sm" variant="ghost">
                  Mark as read
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------------- ICON LOGIC ---------------- */

function NotificationIcon({ type }: { type: string }) {
  const baseClass =
    "w-10 h-10 rounded-full flex items-center justify-center";

  if (type === "school") {
    return (
      <div className={cn(baseClass, "bg-blue-100 text-blue-600")}>
        <School size={20} />
      </div>
    );
  }

  if (type === "user") {
    return (
      <div className={cn(baseClass, "bg-green-100 text-green-600")}>
        <User size={20} />
      </div>
    );
  }

  return (
    <div className={cn(baseClass, "bg-gray-100 text-gray-600")}>
      <CheckCircle size={20} />
    </div>
  );
}
