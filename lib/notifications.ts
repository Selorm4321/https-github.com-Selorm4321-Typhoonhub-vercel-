import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export async function notifyAdmin(type: string, details: any) {
    try {
        console.log(`[MOCK EMAIL] To: typhoonentertainment1@gmail.com | Subject: New ${type}`)
        console.log(`[MOCK EMAIL] Body:`, details)

        // Add to in-app notifications collection
        await addDoc(collection(db, "notifications"), {
            type,
            details,
            read: false,
            createdAt: serverTimestamp()
        })

        return true
    } catch (error) {
        console.error("Failed to notify admin:", error)
        return false
    }
}
