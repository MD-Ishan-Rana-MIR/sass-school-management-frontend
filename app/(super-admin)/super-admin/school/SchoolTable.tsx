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
import { useForm, Controller } from "react-hook-form";
import SchoolFormUpload from "./SchoolFormUpload";
import { Label } from "@/components/ui/label";

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

type FormValues = {
  schoolName: string;
  schoolEmail: string;
  contactNumber: string;
  schoolLogo: FileList | null;
};

export default function SchoolTable() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdminModal, setOpenAdminModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // React Hook Form for Update
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>();

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
    reset({
      schoolName: user.schoolName,
      schoolEmail: user.schoolEmail,
      contactNumber: user.contactNumber,
      schoolLogo: null,
    });
    setPreview(user.schoolLogo);
    setOpenUpdate(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setOpenDelete(true);
  };

  const onUpdateSubmit = (data: FormValues) => {
    console.log("Updated data:", data);
    setOpenUpdate(false);
    setPreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
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

      {/* Table */}
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

          <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-4">
            {/* School Name */}
            <div className="flex flex-col space-y-4 ">
              <Label htmlFor="schoolName">School Name</Label>
              <Input
                id="schoolName"
                {...register("schoolName", { required: "School name is required" })}
              />
              {errors.schoolName && (
                <p className="text-red-500 text-sm">{errors.schoolName.message}</p>
              )}
            </div>

            {/* School Email */}
            <div className="flex flex-col space-y-4 ">
              <Label htmlFor="schoolEmail">School Email</Label>
              <Input
                id="schoolEmail"
                type="email"
                {...register("schoolEmail", { required: "Email is required" })}
              />
              {errors.schoolEmail && (
                <p className="text-red-500 text-sm">{errors.schoolEmail.message}</p>
              )}
            </div>

            {/* Contact Number */}
            <div className="flex flex-col space-y-4 ">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                {...register("contactNumber", { required: "Contact number is required" })}
              />
              {errors.contactNumber && (
                <p className="text-red-500 text-sm">{errors.contactNumber.message}</p>
              )}
            </div>

            {/* School Logo */}
            <div className="flex flex-col space-y-4 ">
              <Label htmlFor="schoolLogo">School Logo</Label>
              <Controller
                control={control}
                name="schoolLogo"
                render={({ field }) => (
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      field.onChange(e.target.files);
                      handleFileChange(e);
                    }}
                  />
                )}
              />
              {preview && (
                <div className="mt-2 w-24 h-24 relative border rounded overflow-hidden">
                  <Image src={preview} alt="School Logo" fill style={{ objectFit: "cover" }} />
                </div>
              )}
            </div>

            <DialogFooter className="space-x-2">
              <Button variant="outline" onClick={() => setOpenUpdate(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
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
          <SchoolFormUpload/>
        </DialogContent>
      </Dialog>
    </div>
  );
}
