"use client"

import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2, ShieldAlert } from "lucide-react"

// Hardcoded list of admin emails for now
// In a real app, this should be a "role" in the Firestore user document
const ADMIN_EMAILS = [
    "vsmatanawi@gmail.com",
    "selormtyphoon@gmail.com",
    "typhoonentertainment1@gmail.com"
]

export function AdminGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                // Not logged in -> redirect to home
                router.push("/")
                return
            }

            if (ADMIN_EMAILS.includes(user.email)) {
                setIsAuthorized(true)
            } else {
                // Logged in but not admin -> redirect to home
                console.warn(`Unauthorized access attempt by ${user.email}`)
                router.push("/")
            }
        }
    }, [user, isLoading, router])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#E50914] animate-spin" />
            </div>
        )
    }

    if (!isAuthorized) {
        return null // Will redirect in useEffect
    }

    return <>{children}</>
}
