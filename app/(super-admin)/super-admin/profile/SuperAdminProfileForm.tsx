"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useProfileQuery,
  useSuperAdminProfileImageUpdateMutation,
  useSuperAdminProfileUpdateMutation,
} from "@/app/api/super-admin/superAdminAuth";
import { imgUrl } from "@/app/utility/img/imgUrl";

type ProfileForm = {
  name: string;
  email: string;
};

export default function SuperAdminProfileForm() {
  const { data, refetch, isLoading } = useProfileQuery({});
  const [superAdminProfileUpdate, { isLoading: updateLoading }] =
    useSuperAdminProfileUpdateMutation();
  // const [updateImage] = useUpdateProfileImageMutation();
  const [superAdminProfileImageUpdate] = useSuperAdminProfileImageUpdateMutation();

  const profile = data?.data?.data;

  const [preview, setPreview] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm<ProfileForm>();

  /* ---------------- LOAD DEFAULT VALUES ---------------- */
  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        email: profile.email,
      });
      setPreview(profile.img);
    }
  }, [profile, reset]);
  

  /* ---------------- IMAGE UPDATE ---------------- */
  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setImageLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      await superAdminProfileImageUpdate(formData).unwrap();
      toast.success("Profile image updated ✅");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Image upload failed ❌");
    } finally {
      setImageLoading(false);
    }
  };

  /* ---------------- TEXT UPDATE ---------------- */
  const onSubmit = async (values: ProfileForm) => {
  console.log(values);
    try {
      await superAdminProfileUpdate(values).unwrap();
      toast.success("Profile updated successfully ✅");
      refetch();
    } catch (err: any) {
    console.log(err)
      toast.error(err?.data?.message || "Update failed ❌");
    }
  };

  /* ---------------- SKELETON LOADER ---------------- */
  if (isLoading) {
    return (
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Skeleton className="w-20 h-20 rounded-full" />
            <Skeleton className="h-10 w-40" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Profile Image */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <Image
              src={preview }
              alt="Profile"
              width={100}
              height={100}
              unoptimized
              className="rounded-full w-20 h-20 border object-cover"
            />

            {imageLoading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-full">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="image">Profile Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={imageLoading}
            />
          </div>
        </div>

        {/* Profile Info */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className=" space-y-3 " >
            <Label>Name</Label>
            <Input {...register("name")} />
          </div>

          <div className=" space-y-3 ">
            <Label>Email</Label>
            <Input {...register("email")} />
          </div>

          <div className=" space-y-3 ">
            <Label>Role</Label>
            <Input value={profile?.role} disabled />
          </div>

          <Button className="w-full" type="submit" disabled={updateLoading}>
            {updateLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Update Profile
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
