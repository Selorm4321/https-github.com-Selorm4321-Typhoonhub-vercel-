"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    type User as FirebaseUser
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

interface User {
    id: string
    email: string
    name: string
    avatar?: string
    userType?: "viewer" | "creator"
    membershipTier?: string
    stats?: {
        filmsWatchedThisWeek?: number
        watchlistCount?: number
        lastWatched?: string
    }
    wallet?: {
        balance: number
        currency: string
        paypalEmail?: string
    }
    creatorStats?: {
        totalEarnings: number
        totalUploads: number
        totalViews: number
        pendingCollaborations: number
        uploadProgress?: number
        profileStatus: "active" | "pending_payment" | "suspended"
    }
}

interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<boolean>
    signup: (name: string, email: string, password: string, isCreator?: boolean) => Promise<boolean>
    resetPassword: (email: string) => Promise<void>
    completeCreatorPayment: () => Promise<boolean>
    logout: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Fetch additional user data from Firestore
                try {
                    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
                    if (userDoc.exists()) {
                        setUser({ id: firebaseUser.uid, ...userDoc.data() } as User)
                    } else {
                        // Fallback if user is in Auth but not Firestore (shouldn't happen ideally)
                        setUser({
                            id: firebaseUser.uid,
                            email: firebaseUser.email || "",
                            name: firebaseUser.displayName || "User",
                            userType: "viewer"
                        })
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error)
                    // Fallback on error so user isn't locked out
                    setUser({
                        id: firebaseUser.uid,
                        email: firebaseUser.email || "",
                        name: firebaseUser.displayName || "User",
                        userType: "viewer"
                    })
                }
            } else {
                setUser(null)
            }
            setIsLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const login = async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true)
        try {
            await signInWithEmailAndPassword(auth, email, password)
            // onAuthStateChanged will handle setting the user, but we clear loading here to be safe
            setIsLoading(false)
            return true
        } catch (error) {
            console.error("Login error:", error)
            setIsLoading(false)
            return false
        }
    }

    const signup = async (name: string, email: string, password: string, isCreator: boolean = false): Promise<boolean> => {
        setIsLoading(true)
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const firebaseUser = userCredential.user

            const newUser: User = {
                id: firebaseUser.uid,
                email: email,
                name: name,
                userType: isCreator ? "creator" : "viewer",
                membershipTier: "Free",
                stats: {
                    filmsWatchedThisWeek: 0,
                    watchlistCount: 0,
                },
                // If creator, set status to pending_payment initially
                creatorStats: isCreator ? {
                    totalEarnings: 0,
                    totalUploads: 0,
                    totalViews: 0,
                    pendingCollaborations: 0,
                    profileStatus: "pending_payment"
                } : undefined,
                wallet: isCreator ? {
                    balance: 0,
                    currency: "USD"
                } : undefined
            }

            // Save user profile to Firestore
            await setDoc(doc(db, "users", firebaseUser.uid), newUser)

            // onAuthStateChanged will pick this up, but we can optimistically set it
            setUser(newUser)

            return true
        } catch (error) {
            console.error("Signup error:", error)
            setIsLoading(false)
            throw error
        }
    }

    const completeCreatorPayment = async (): Promise<boolean> => {
        setIsLoading(true)
        try {
            // In a real app, verify backend payment session here
            await new Promise((resolve) => setTimeout(resolve, 1500))

            if (user && user.creatorStats) {
                const updatedUser = {
                    ...user,
                    creatorStats: {
                        ...user.creatorStats,
                        profileStatus: "active" as const
                    }
                }

                // Update Firestore
                await setDoc(doc(db, "users", user.id), updatedUser, { merge: true })

                setUser(updatedUser) // Update local state
                setIsLoading(false)
                return true
            }
            setIsLoading(false)
            return false
        } catch (error) {
            console.error("Payment error", error)
            setIsLoading(false)
            return false
        }
    }

    const logout = async () => {
        try {
            await signOut(auth)
            setUser(null)
        } catch (error) {
            console.error("Logout error:", error)
        }
    }

    const resetPassword = async (email: string): Promise<void> => {
        try {
            await sendPasswordResetEmail(auth, email)
        } catch (error) {
            console.error("Reset password error:", error)
            throw error
        }
    }

    return <AuthContext.Provider value={{ user, login, signup, resetPassword, completeCreatorPayment, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
