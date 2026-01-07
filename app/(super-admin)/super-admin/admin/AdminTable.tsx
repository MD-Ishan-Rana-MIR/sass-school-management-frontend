"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import AdminUploadFrom from "./AdminUploadFrom";

interface User {
    id: number;
    name: string;
    email: string;
    designation: string;
    schoolId: string;
    adminId: string;
    image: string;
    isActive: boolean;
}

const dummyData: User[] = Array.from({ length: 42 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    designation: i % 2 === 0 ? "Teacher" : "Staff",
    schoolId: `SCH-${1000 + i}`,
    adminId: `ADM-${500 + i}`,
    image: "https://via.placeholder.com/40",
    isActive: i % 2 === 0,
}));

export default function AdminTable() {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openAdminModal, setOpenAdminModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Filtered data
    const filteredData = useMemo(() => {
        return dummyData.filter(
            (user) =>
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase()) ||
                user.designation.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    // Pagination
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredData.slice(start, start + pageSize);
    }, [currentPage, filteredData, pageSize]);

    const handleUpdate = (user: User) => {
        setSelectedUser(user);
        setOpenUpdate(true);
    };

    const handleDelete = (user: User) => {
        setSelectedUser(user);
        setOpenDelete(true);
    };

    return (
        <div className="p-6 space-y-4 bg-white rounded-2xl shadow overflow-x-auto  ">
            {/* Search */}
            <div className="flex justify-between items-center">
                <Input
                    placeholder="Search by name, email or designation..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="max-w-sm"
                />
                <Button size="sm" variant="destructive" onClick={() => { setOpenAdminModal(!openAdminModal) }}  >
                    Add Admin
                </Button>
            </div>

            {/* Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Designation</TableHead>
                        <TableHead>School ID</TableHead>
                        <TableHead>Admin ID</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedData.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.designation}</TableCell>
                            <TableCell>{user.schoolId}</TableCell>
                            <TableCell>{user.adminId}</TableCell>
                            <TableCell>
                                <Image width={100} height={100} src={user.image} alt={user.name} className="w-10 h-10 rounded-full" />
                            </TableCell>
                            <TableCell>{user.isActive ? "Yes" : "No"}</TableCell>
                            <TableCell className="space-x-2">
                                <Button size="sm" variant="outline" onClick={() => handleUpdate(user)}>
                                    Update
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDelete(user)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination with page numbers */}
            <div className="flex justify-center items-center space-x-2 mt-4 flex-wrap gap-2">
                <Button
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                    Prev
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                        key={page}
                        size="sm"
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => setCurrentPage(page)}
                    >
                        {page}
                    </Button>
                ))}

                <Button
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                    Next
                </Button>
            </div>

            {/* Update Modal */}
            <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                        <p>Update info for: <strong>{selectedUser?.name}</strong></p>
                        {/* Replace with form inputs */}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenUpdate(false)}>Cancel</Button>
                        <Button>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                        <p>Are you sure you want to delete <strong>{selectedUser?.name}</strong>?</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenDelete(false)}>Cancel</Button>
                        <Button variant="destructive">Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>



            {/* admin add modal  */}

            <Dialog open={openAdminModal} onOpenChange={setOpenAdminModal}>
                <DialogContent className="  " >
                    <AdminUploadFrom />
                    {/* <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenDelete(false)}>Cancel</Button>
                        <Button variant="destructive">Delete</Button>
                    </DialogFooter> */}
                </DialogContent>
            </Dialog>






        </div>
    );
}
