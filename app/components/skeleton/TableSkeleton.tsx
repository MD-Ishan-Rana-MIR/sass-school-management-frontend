import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function TableSkeleton({ rows = 10 }: { rows?: number }) {
    return (
        <div className="overflow-x-auto bg-white ">
            <Table className="min-w-[700px]">
                <TableHeader>
                    <TableRow>
                        <TableHead>School ID</TableHead>
                        <TableHead>School Name</TableHead>
                        <TableHead className="hidden md:table-cell">Email</TableHead>
                        <TableHead className="hidden lg:table-cell">Contact</TableHead>
                        <TableHead className="hidden lg:table-cell">Created At</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {Array.from({ length: rows }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <Skeleton className="h-4 w-20" />
                            </TableCell>

                            <TableCell className="flex items-center gap-2">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <Skeleton className="h-4 w-32" />
                            </TableCell>

                            <TableCell className="hidden md:table-cell">
                                <Skeleton className="h-4 w-40" />
                            </TableCell>

                            <TableCell className="hidden lg:table-cell">
                                <Skeleton className="h-4 w-28" />
                            </TableCell>

                            <TableCell className="hidden lg:table-cell">
                                <Skeleton className="h-4 w-32" />
                            </TableCell>

                            <TableCell>
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </TableCell>

                            <TableCell>
                                <div className="flex gap-2">
                                    <Skeleton className="h-8 w-16" />
                                    <Skeleton className="h-8 w-16" />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
