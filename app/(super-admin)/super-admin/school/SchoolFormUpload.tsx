"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

type FormValues = {
  schoolName: string;
  schoolEmail: string;
  contactNumber: string;
  schoolLogo: FileList | null;
};

export default function SchoolFormUpload() {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>();
  const [preview, setPreview] = useState<string | null>(null);

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    // reset form
    reset();
    setPreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 bg-white rounded-2xl mx-auto">
      {/* School Name */}
      <div className="flex flex-col space-y-4 ">
        <Label htmlFor="schoolName">School Name</Label>
        <Input
          id="schoolName"
          placeholder="Enter school name"
          {...register("schoolName", { required: "School name is required" })}
        />
        {errors.schoolName && <p className="text-red-500 text-sm">{errors.schoolName.message}</p>}
      </div>

      {/* School Email */}
      <div className="flex flex-col space-y-4 ">
        <Label htmlFor="schoolEmail">School Email</Label>
        <Input
          id="schoolEmail"
          type="email"
          placeholder="Enter school email"
          {...register("schoolEmail", { required: "Email is required" })}
        />
        {errors.schoolEmail && <p className="text-red-500 text-sm">{errors.schoolEmail.message}</p>}
      </div>

      {/* Contact Number */}
      <div className="flex flex-col space-y-4 ">
        <Label htmlFor="contactNumber">Contact Number</Label>
        <Input
          id="contactNumber"
          type="text"
          placeholder="Enter contact number"
          {...register("contactNumber", { required: "Contact number is required" })}
        />
        {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber.message}</p>}
      </div>

      {/* School Logo Upload */}
      <div className="flex flex-col space-y-4 ">
        <Label htmlFor="schoolLogo">School Logo</Label>
        <Controller
          control={control}
          name="schoolLogo"
          rules={{ required: "School logo is required" }}
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
        {errors.schoolLogo && <p className="text-red-500 text-sm">{errors.schoolLogo.message}</p>}

        {preview && (
          <div className="mt-2 w-24 h-24 relative border rounded overflow-hidden">
            <Image
              src={preview}
              alt="School Logo Preview"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="mt-2 w-full">
        Save School
      </Button>
    </form>
  );
}
