"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState, useCallback } from "react"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLoginMutation } from "./api/super-admin/superAdminAuth"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { toast } from "sonner"
import { loginAlert } from "./utility/alert/loginAlert"
import { autoLogoutOnCookieExpiry, setCookie7Days } from "./utility/cookies/cookies"

// --------------------
// Config
// --------------------
const MAX_ATTEMPTS = 3
const LOCK_TIME = 10 * 60 * 1000 // 10 minutes
const COOKIE_NAME = "superAdminToken"


// --------------------
// Zod Schema
// --------------------
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

// --------------------
// Helper: Set 7-day cookie
// --------------------


// --------------------
// Helper: Check cookie
// --------------------
function getCookie(name: string) {
  const cookies = document.cookie.split("; ").map((c) => c.split("="))
  const found = cookies.find(([key]) => key === name)
  return found ? found[1] : null
}

export default function LoginPage() {
  const [login, { isLoading }] = useLoginMutation()
  const [isLocked, setIsLocked] = useState(false)
  const [remainingTime, setRemainingTime] = useState<number | null>(null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // --------------------
  // Check lock status
  // --------------------
  useEffect(() => {
    let interval: NodeJS.Timeout

    const startCountdown = () => {
      const lockUntil = localStorage.getItem("loginLockUntil")
      if (!lockUntil) return

      const updateTime = () => {
        const timeLeft = Number(lockUntil) - Date.now()

        if (timeLeft <= 0) {
          localStorage.removeItem("loginLockUntil")
          localStorage.removeItem("loginAttempts")
          setIsLocked(false)
          setRemainingTime(null)
          clearInterval(interval)
        } else {
          setIsLocked(true)
          setRemainingTime(timeLeft)
        }
      }

      updateTime() // run immediately
      interval = setInterval(updateTime, 1000)
    }

    startCountdown()

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [])

  // --------------------
  // Auto redirect if cookie expired
  // --------------------
  useEffect(() => {
    const interval = setInterval(() => {
      const token = getCookie(COOKIE_NAME)
      if (!token) {
        window.location.href = "/"
      }
    }, 60 * 1000) // check every minute

    return () => clearInterval(interval)
  }, [])

  // --------------------
  // Submit Handler
  // --------------------
  const onSubmit = useCallback(async (data: LoginFormValues) => {
    try {
      const alertRes = await loginAlert()
      if (!alertRes.isConfirmed) return

      const res = await login(data).unwrap()

      // --------------------
      // Only for super-admin
      // --------------------
      if (res?.data?.data?.role === "super-admin") {
        // ✅ Set 7-day cookie
        setCookie7Days(COOKIE_NAME, res?.data?.data?.token)
        // ✅ Redirect to dashboard
        window.location.href = "/super-admin"
      }

      // reset lock on success
      localStorage.removeItem("loginAttempts")
      localStorage.removeItem("loginLockUntil")

      toast.success(res?.data?.message)
    } catch (err) {
      const error = err as FetchBaseQueryError & { data?: { message?: string } }
      const message = error.data?.message || "Invalid email or password ❌"
      toast.error(message)

      // --------------------
      // Handle attempts
      // --------------------
      const attempts = Number(localStorage.getItem("loginAttempts") || 0) + 1
      localStorage.setItem("loginAttempts", attempts.toString())

      if (attempts >= MAX_ATTEMPTS) {
        const lockUntil = Date.now() + LOCK_TIME
        localStorage.setItem("loginLockUntil", lockUntil.toString())
        setIsLocked(true)
        setRemainingTime(LOCK_TIME)

        toast.error("Too many attempts. Try again after 10 minutes ⏳")
      }
    }
  }, [login])


  // useEffect(() => {
  //   // Start auto-logout checks
  //   const cleanupToken = autoLogoutOnCookieExpiry("token", "/")
  //   const cleanupAdmin = autoLogoutOnCookieExpiry("superAdminToken", "/")

  //   // Cleanup on unmount
  //   return () => {
  //     cleanupToken()
  //     cleanupAdmin()
  //   }
  // }, [])



  // --------------------
  // Format remaining time
  // --------------------
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // --------------------
  // Render
  // --------------------
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Login to your account
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" type="email" {...field} />
                    </FormControl>
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
                      <Input placeholder="Enter your password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Locked Message */}
              {isLocked && remainingTime && (
                <p className="text-center text-sm text-red-500">
                  Too many failed attempts. Try again in <b>{formatTime(remainingTime)}</b>
                </p>
              )}

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={isLoading || isLocked}>
                {isLocked ? "Locked ⛔" : isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
