"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import SchoolFormUpload from "./SchoolFormUpload";

interface User {
  id: number;
  schoolName: string;
  schoolLogo: string;
  schoolEmail: string;
  contactNumber: string;
  schoolId: string;
  createdAt: string;
  isActive: boolean;
}

const dummyData: User[] = Array.from({ length: 42 }, (_, i) => ({
  id: i + 1,
  schoolName: `School ${i + 1}`,
  schoolLogo: "https://via.placeholder.com/40",
  schoolEmail: `school${i + 1}@example.com`,
  contactNumber: `017XXXXXXXX`,
  schoolId: `SCH-${1000 + i}`,
  createdAt: new Date().toISOString().split("T")[0],
  isActive: i % 2 === 0,
}));

export default function SchoolTable() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdminModal, setOpenAdminModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Filtered data
  const filteredData = useMemo(
    () =>
      dummyData.filter(
        (user) =>
          user.schoolName.toLowerCase().includes(search.toLowerCase()) ||
          user.schoolEmail.toLowerCase().includes(search.toLowerCase()) ||
          user.contactNumber.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

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
    <div className="p-4 sm:p-6 bg-white rounded-2xl shadow space-y-4">
      {/* Search + Add */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <Input
          placeholder="Search by school name, email or contact..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-sm"
        />
        <Button
          size="sm"
          variant="destructive"
          onClick={() => setOpenAdminModal(!openAdminModal)}
        >
          Add School
        </Button>
      </div>

      {/* Table wrapper for responsive scroll */}
      <div className="overflow-x-auto">
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
            {paginatedData.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.schoolId}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <Image
                    src={user.schoolLogo}
                    alt={user.schoolName}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  {user.schoolName}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.schoolEmail}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {user.contactNumber}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {user.createdAt}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdate(user)}
                    >
                      Update
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(user)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center flex-wrap items-center gap-2 mt-4">
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
            <DialogTitle>Update School</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p>
              Update info for: <strong>{selectedUser?.schoolName}</strong>
            </p>
            {/* Add form inputs here */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenUpdate(false)}>
              Cancel
            </Button>
            <Button>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete School</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p>
              Are you sure you want to delete{" "}
              <strong>{selectedUser?.schoolName}</strong>?
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add School Modal */}
      <Dialog open={openAdminModal} onOpenChange={setOpenAdminModal}>
        <DialogContent>
          <DialogHeader>
            {/* <DialogTitle>Add School</DialogTitle> */}
          </DialogHeader>
          <div className="space-y-2">
            <SchoolFormUpload/>
          </div>
          
        </DialogContent>
      </Dialog>
    </div>
  );
}
