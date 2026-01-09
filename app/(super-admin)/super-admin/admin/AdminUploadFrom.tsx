"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAllSchoolQuery } from "@/app/api/super-admin/schoolApi";
// import { useCreateAdminMutation } from "@/app/api/super-admin/adminApi";
import { AllSchoolType } from "@/app/utility/type/super-admin/schoolType";
import { useCreateaAdminMutation } from "@/app/api/super-admin/superAdmin.Admin";
import { toast } from "sonner";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";


// ----------------- ZOD SCHEMA -----------------
const formSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
    designation: z.string().min(1, "Select a designation"),
    schoolId: z.string().min(1, "Select a school"),
    image: z.any().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;


// ----------------- COMPONENT -----------------
export default function AdminUploadForm() {
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      designation: "",
      schoolId: "",
    },
  });

  const [createAdmin, { isLoading }] = useCreateaAdminMutation();

  // ----------------- SUBMIT -----------------
  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("designation", data.designation);
    formData.append("schoolId", data.schoolId);

    if (data.image) {
      formData.append("image", data.image);
    }

    console.log("Submitting Admin:", Object.fromEntries(formData));

    try {
    // form.reset();

    const res = await createAdmin(formData).unwrap();

    if(res){
        console.log(res)
        form.reset()
        toast.success(res?.message)
    }

        
    } catch (err) {
              const error = err as FetchBaseQueryError & {
        data?: { message?: string };
      };

      const message =
        error.data?.message || "Something went wrong ❌";

      toast.error(message);
    }

    // await createAdmin(formData);
    // setPreview(null);
  };

  // ----------------- GET ALL SCHOOLS -----------------
  const { data } = useAllSchoolQuery({});
  const allSchool: AllSchoolType[] = data?.data?.schools || [];

  // ----------------- UI -----------------
  return (
    <div className="w-full mx-auto py-6 px-8">
      <h1 className="text-3xl mb-6">Create Admin</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* School */}
          <FormField
            control={form.control}
            name="schoolId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select school" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {allSchool.map((school) => (
                      <SelectItem key={school._id} value={school._id}>
                        {school.schoolName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Designation */}
          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select designation" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Teacher">Teacher</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        field.onChange(file);
                        setPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Preview */}
          {preview && (
            <Image
              src={preview}
              alt="Preview"
              width={100}
              height={100}
              className="w-24 h-24 rounded-full border object-cover"
            />
          )}

          {/* Submit */}
          <Button type="submit" variant="destructive" className="w-full mt-6">
            Create Admin
          </Button>
        </form>
      </Form>
    </div>
  );
}
