"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, Film, DollarSign, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { useAuth } from "@/components/auth-context"
import { notifyAdmin } from "@/lib/notifications"

export default function SubmitFilmPage() {
    const { user } = useAuth()
    const router = useRouter()

    // Form State
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [genre, setGenre] = useState("")
    const [videoUrl, setVideoUrl] = useState("")
    const [thumbnailUrl, setThumbnailUrl] = useState("") // Keep for fallback or direct url if needed, but primarily use file now
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
    const [price, setPrice] = useState("")
    const [rentalPrice, setRentalPrice] = useState("")
    const [creatorPaypal, setCreatorPaypal] = useState("")

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [validationErrors, setValidationErrors] = useState<string[]>([])

    const validateForm = () => {
        const errors: string[] = []
        if (!title.trim()) errors.push("Film Title is missing")
        if (!description.trim()) errors.push("Synopsis is missing")
        if (!genre) errors.push("Genre is not selected")
        if (!videoUrl.trim()) errors.push("Video Source URL is missing")
        if (!thumbnailFile && !thumbnailUrl.trim()) errors.push("Thumbnail Image is missing")

        const hasPrice = (price && parseFloat(price) > 0) || (rentalPrice && parseFloat(rentalPrice) > 0)
        if (hasPrice) {
            if (!creatorPaypal.trim()) {
                errors.push("PayPal Email is required for paid content")
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(creatorPaypal)) {
                errors.push("PayPal Email format is invalid")
            }
        }
        return errors
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setValidationErrors([])
        if (!user) {
            alert("Please sign in or create an account to submit content.")
            // Ideally we would trigger the login modal here, but for now the alert serves as feedback.
            // The button text also changes to "Sign In to Submit".
            return
        }

        const errors = validateForm()
        if (errors.length > 0) {
            setValidationErrors(errors)
            window.scrollTo({ top: 0, behavior: 'smooth' })
            return
        }

        setIsSubmitting(true)

        try {
            let finalThumbnailUrl = thumbnailUrl

            if (thumbnailFile) {
                const { storage } = await import("@/lib/firebase")
                const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage")

                const storageRef = ref(storage, `thumbnails/${user.id}/${Date.now()}_${thumbnailFile.name}`)
                const snapshot = await uploadBytes(storageRef, thumbnailFile)
                finalThumbnailUrl = await getDownloadURL(snapshot.ref)
            }

            // 1. Create Document in 'videos' collection
            const docRef = await addDoc(collection(db, "videos"), {
                title,
                description,
                genre,
                videoPath: videoUrl, // Using URL directly for now, usually would be a path ref
                thumbnailUrl: finalThumbnailUrl,
                price: price ? parseFloat(price) : 0,
                rentalPrice: rentalPrice ? parseFloat(rentalPrice) : 0,
                creatorPaypal: creatorPaypal || user.email, // Default to user email if not provided
                creatorId: user.id,
                creatorName: user.name || user.email,
                status: "pending",
                createdAt: serverTimestamp(),
                rejectionReason: ""
            })

            // 2. Notify Admin
            await notifyAdmin("Submission", {
                title,
                creator: user.email,
                id: docRef.id
            })

            setSuccess(true)

            // Reset form
            setTitle("")
            setDescription("")
            setGenre("")
            setVideoUrl("")
            setThumbnailUrl("")
            setVideoUrl("")
            setThumbnailUrl("")
            setPrice("")
            setRentalPrice("")
            setCreatorPaypal("")

        } catch (error: any) {
            console.error("Submission error:", error)
            alert(`Failed to submit film: ${error.message || "Unknown error"}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-[#0f171e] text-white flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-[#19232d] p-8 rounded-xl border border-white/10 text-center space-y-6">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                    <h2 className="text-3xl font-bold">Submission Received!</h2>
                    <p className="text-gray-400">
                        Thank you! Your film has been sent to our curation team. You will receive an email once it has been reviewed.
                        <br /><br />
                        Questions? Contact us at <span className="text-[#3aa7ff]">typhoonentertainment1@gmail.com</span>
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10"
                            onClick={() => setSuccess(false)}
                        >
                            Submit Another
                        </Button>
                        <Button
                            className="bg-[#3aa7ff] hover:bg-[#3aa7ff]/90 text-white"
                            onClick={() => router.push("/")}
                        >
                            Back Home
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0f171e] text-white pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tight">Submit Your Film</h1>
                        <p className="text-gray-400 text-lg">
                            Share your work with the global audience.
                        </p>
                    </div>

                    {/* How it Works / Process Guide */}
                    {validationErrors.length > 0 && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-red-400 font-bold">
                                <AlertCircle className="w-5 h-5" />
                                <h3>Please fix the following errors:</h3>
                            </div>
                            <ul className="list-disc list-inside text-sm text-red-300 ml-2">
                                {validationErrors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="grid md:grid-cols-4 gap-4 py-6 border-y border-white/10">
                        <div className="space-y-2">
                            <div className="text-[#3aa7ff] font-bold text-lg">1. Upload</div>
                            <p className="text-sm text-gray-400">Submit your video details, thumbnail, and PayPal info.</p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-[#3aa7ff] font-bold text-lg">2. Review</div>
                            <p className="text-sm text-gray-400">Our team reviews quality and content guidelines (24-48h).</p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-[#3aa7ff] font-bold text-lg">3. Approval</div>
                            <p className="text-sm text-gray-400">Once approved, your film is instantly live on TyphoonHub.</p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-[#3aa7ff] font-bold text-lg">4. Earn</div>
                            <p className="text-sm text-gray-400">You keep <span className="text-white font-bold">100%</span> of rentals/sales. We run ads to support the platform.</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <div className="bg-[#19232d] p-6 rounded-xl border border-white/10 space-y-6">
                        <div className="flex items-center gap-2 text-xl font-bold text-[#3aa7ff]">
                            <Film className="w-6 h-6" />
                            <h2>Basic Information</h2>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-gray-300">Film Title</label>
                                <Input
                                    required
                                    placeholder="Enter the title of your film"
                                    className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 focus:border-[#3aa7ff]"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-gray-300">Synopsis</label>
                                <Textarea
                                    required
                                    placeholder="Brief description of your film..."
                                    className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 focus:border-[#3aa7ff] min-h-[120px]"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Genre</label>
                                <Select onValueChange={setGenre} required>
                                    <SelectTrigger className="bg-black/50 border-white/10 text-white">
                                        <SelectValue placeholder="Select genre" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#19232d] border-white/10 text-white">
                                        <SelectItem value="drama">Drama</SelectItem>
                                        <SelectItem value="action">Action</SelectItem>
                                        <SelectItem value="comedy">Comedy</SelectItem>
                                        <SelectItem value="documentary">Documentary</SelectItem>
                                        <SelectItem value="horror">Horror</SelectItem>
                                        <SelectItem value="scifi">Sci-Fi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Media Assets */}
                    <div className="bg-[#19232d] p-6 rounded-xl border border-white/10 space-y-6">
                        <div className="flex items-center gap-2 text-xl font-bold text-[#3aa7ff]">
                            <Upload className="w-6 h-6" />
                            <h2>Media Assets</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Video Source URL (MP4)</label>
                                <Input
                                    required
                                    placeholder="https://..."
                                    className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 focus:border-[#3aa7ff]"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                />
                                <p className="text-xs text-gray-500">Provide a direct link to your video file (hosted on Vercel Blob, AWS S3, etc.)</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Thumbnail Image</label>
                                <div className="space-y-3">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        className="bg-black/50 border-white/10 text-white file:bg-[#3aa7ff] file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4 hover:file:bg-[#3aa7ff]/90 cursor-pointer"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setThumbnailFile(e.target.files[0])
                                            }
                                        }}
                                    />
                                    <div className="text-xs text-gray-500 text-center">- OR -</div>
                                    <Input
                                        placeholder="https://... (Direct Image URL)"
                                        className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 focus:border-[#3aa7ff]"
                                        value={thumbnailUrl}
                                        onChange={(e) => setThumbnailUrl(e.target.value)}
                                    />
                                </div>
                                <p className="text-xs text-gray-500">Upload a JPG or PNG, or provide a direct URL.</p>
                            </div>
                        </div>
                    </div>

                    {/* Monetization */}
                    <div className="bg-[#19232d] p-6 rounded-xl border border-white/10 space-y-6">
                        <div className="flex items-center gap-2 text-xl font-bold text-[#3aa7ff]">
                            <DollarSign className="w-6 h-6" />
                            <h2>Monetization</h2>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Purchase Price ($)</label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 focus:border-[#3aa7ff]"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Rental Price ($)</label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 focus:border-[#3aa7ff]"
                                    value={rentalPrice}
                                    onChange={(e) => setRentalPrice(e.target.value)}
                                />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Leave blank or 0 for free content. Platform fees may apply.
                        </p>
                    </div>

                    {/* Payment Information */}
                    <div className="bg-[#19232d] p-6 rounded-xl border border-white/10 space-y-6">
                        <div className="flex items-center gap-2 text-xl font-bold text-[#3aa7ff]">
                            <DollarSign className="w-6 h-6" />
                            <h2>Payout Information</h2>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">PayPal Email Address</label>
                            <Input
                                required={price !== "" || rentalPrice !== ""} // Required if charging money
                                placeholder="payments@yourproduction.com"
                                className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 focus:border-[#3aa7ff]"
                                value={creatorPaypal}
                                onChange={(e) => setCreatorPaypal(e.target.value)}
                            />
                            <p className="text-xs text-gray-500">
                                100% of sales and rentals will be sent directly to this address.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-[#00E0FF] to-[#FF00E0] text-white font-bold px-12 py-6 text-lg rounded-full hover:opacity-90 transition-opacity"
                        >
                            {isSubmitting ? "Submitting..." : (user ? "Submit Film" : "Sign In to Submit")}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
