import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, index) => (
        <Card key={index} className="border">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div className="flex items-center gap-3">
              {/* Icon Skeleton */}
              <Skeleton className="w-10 h-10 rounded-full" />

              {/* Title + Message */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-64" />
              </div>
            </div>

            {/* Badge Skeleton */}
            <Skeleton className="h-5 w-10 rounded-full" />
          </CardHeader>

          <CardContent className="flex items-center justify-between">
            {/* Time */}
            <Skeleton className="h-3 w-24" />

            {/* Button */}
            <Skeleton className="h-8 w-24 rounded-md" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
