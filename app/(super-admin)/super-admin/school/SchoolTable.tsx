"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";


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
import { Label } from "@/components/ui/label";

import { useAllSchoolQuery, useDeleteSchoolMutation, useSchoolStatusUpdateMutation, useSchoolUpdateMutation } from "@/app/api/super-admin/schoolApi";
import { TableSkeleton } from "@/app/components/skeleton/TableSkeleton";
import SchoolFormUpload from "./SchoolFormUpload";
import { imgUrl } from "@/app/utility/img/imgUrl";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { toast } from "sonner";
import { updateAlert } from "@/app/utility/alert/updateAlert";
import { statusUpdateAlert } from "@/app/utility/alert/statusUpdateAlert";
import { deleteAlert } from "@/app/utility/alert/deleteAlert";

/* ---------------- TYPES ---------------- */

interface User {
  _id: number;
  schoolName: string;
  schoolLogo: string;
  schoolEmail: string;
  contactNumber: string;
  schoolId: string;
  createdAt: string;
  status: boolean;
}

type FormValues = {
  schoolName: string;
  schoolEmail: string;
  contactNumber: string;
  schoolLogo: FileList | null;
};

/* ---------------- COMPONENT ---------------- */

export default function SchoolTable() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdminModal, setOpenAdminModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { data, isLoading } = useAllSchoolQuery({});
  const schools: User[] = data?.data?.schools || [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  /* ---------------- FILTER ---------------- */

  const filteredData = useMemo(() => {
    return schools.filter(
      (user) =>
        user.schoolName.toLowerCase().includes(search.toLowerCase()) ||
        user.schoolEmail.toLowerCase().includes(search.toLowerCase()) ||
        user.contactNumber.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, schools]);

  /* ---------------- PAGINATION ---------------- */

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [currentPage, filteredData]);

  /* ---------------- HANDLERS ---------------- */

  const [id, setId] = useState<number | undefined>();

  const handleUpdate = (user: User) => {
    console.log(user)
    setId(user?._id)
    setSelectedUser(user);

    reset({
      schoolName: user.schoolName,
      schoolEmail: user.schoolEmail,
      contactNumber: user.contactNumber,
      schoolLogo: null,
    });

    // ✅ DB image preview
    setPreview(user.schoolLogo ? `${imgUrl}${user.schoolLogo}` : null);
    setOpenUpdate(true);
  };

  const [deleteSchool] = useDeleteSchoolMutation();

  const handleDelete = async (user: User) => {
    try {
      const res = await deleteAlert();
      if(res.isConfirmed){
        const res = await deleteSchool(user?._id).unwrap();
      if (res) {
        toast.success("delete successfully")
      }
      }
    } catch (err) {
      const error = err as FetchBaseQueryError & {
        data?: { message?: string };
      };

      const message =
        error.data?.message || "Something went wrong ❌";

      toast.error(message);

    }

  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ New upload preview
    setPreview(URL.createObjectURL(file));
  };

  const [schoolUpdate, { isLoading: updateLoading }] = useSchoolUpdateMutation();
  const [schoolStatusUpdate] = useSchoolStatusUpdateMutation()
  // status update 
  const handleStatusUpdate = async (id:number)=>{
    try {
      
      const res = await statusUpdateAlert();
      if(res.isConfirmed){
        const res = await schoolStatusUpdate(id).unwrap();
        if(res){
          toast.success(res?.message);
        }
      }

    } catch (err) {
      const error = err as FetchBaseQueryError & {
        data?: { message?: string };
      };

      const message =
        error.data?.message || "Something went wrong ❌";

      toast.error(message);
      
    }
  }

  // school update 

  const onUpdateSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();

      formData.append("schoolName", data.schoolName);
      formData.append("schoolEmail", data.schoolEmail);
      formData.append("contactNumber", data.contactNumber);

      if (data.schoolLogo?.[0]) {
        formData.append("schoolLogo", data.schoolLogo[0]);
      }

      // 🔔 confirmation alert
      // ✅ RTK Query mutation (IMPORTANT FIX)
      const res = await schoolUpdate({
        formData,
        id
      }).unwrap();



      toast.success("School updated successfully ✅");
      console.log(res);

      // ✅ close modal AFTER success
      setOpenUpdate(false);
      setPreview(null);

    } catch (err) {
      const error = err as FetchBaseQueryError & {
        data?: { message?: string };
      };

      const message =
        error.data?.message || "Something went wrong ❌";

      toast.error(message);
    }
  };

  /* ---------------- LOADING ---------------- */

  if (isLoading) {
    return <TableSkeleton />;
  }

  /* ---------------- UI ---------------- */

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
          onClick={() => setOpenAdminModal(true)}
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
              <TableRow key={user._id}>
                <TableCell>{user.schoolId}</TableCell>

                <TableCell className="flex items-center gap-2">
                  <Image
                    src={`${imgUrl}${user.schoolLogo}`}
                    alt={user.schoolName}
                    width={100}
                    height={100}
                    className="rounded-full w-24 h-24 border"
                    unoptimized
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
                  {/* {user.createdAt} */}
                  {
                    new Date(user.createdAt).toDateString()
                  }
                </TableCell>

                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${user.status
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                      }`}
                  >
                    {user.status ? "Active" : "Inactive"}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm"  onClick={() => handleUpdate(user)}>
                      Update
                    </Button>
                    <Button size="sm" onClick={() => handleDelete(user)}>
                      Delete
                    </Button>
                    <Button size="sm" onClick={() => handleStatusUpdate(user?._id)}>
                      {
                        user.status ? "Inactive" : "Active"
                      }
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4 flex-wrap">
        <Button size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
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
          onClick={() => setCurrentPage(p => p + 1)}
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
            <div>
              <Label>School Name</Label>
              <Input {...register("schoolName", { required: true })} />
            </div>

            <div>
              <Label>Email</Label>
              <Input type="email" {...register("schoolEmail", { required: true })} />
            </div>

            <div>
              <Label>Contact</Label>
              <Input {...register("contactNumber", { required: true })} />
            </div>

            <div>
              <Label>School Logo</Label>
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
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button  onClick={() => {
                setOpenUpdate(false);
                setPreview(null);
              }}>
                Cancel
              </Button>
              <Button type="submit">{
                updateLoading ? "" : "Save"
              }</Button>
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
          <p>
            Are you sure you want to delete{" "}
            <strong>{selectedUser?.schoolName}</strong>?
          </p>
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
          <SchoolFormUpload />
        </DialogContent>
      </Dialog>
    </div>
  );
}
