"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, X, Film, Info, DollarSign } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { useAuth } from "@/components/auth-context"

export default function UploadPage() {
    const { user } = useAuth()
    const [dragActive, setDragActive] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [genre, setGenre] = useState("Drama")
    const [visibility, setVisibility] = useState("Public")
    const [monetizationType, setMonetizationType] = useState<"free" | "paid">("free")
    const [price, setPrice] = useState("")
    const [rentalPrice, setRentalPrice] = useState("")

    const router = useRouter()

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0])
            // Auto-fill title if empty
            if (!title) setTitle(e.dataTransfer.files[0].name.split('.')[0])
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            if (!title) setTitle(e.target.files[0].name.split('.')[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setIsUploading(true)

        try {
            // Mock File Upload (Would go to Firebase Storage here)
            // const storageRef = ref(storage, `videos/${user.id}/${file.name}`)
            // await uploadBytes(storageRef, file)
            // const url = await getDownloadURL(storageRef)
            const mockUrl = `videos/${user.id}/${file?.name}` // Placeholder for now

            // Save Metadata to Firestore
            await addDoc(collection(db, "videos"), {
                creatorId: user.id,
                creatorName: user.name,
                title: title,
                description: description,
                genre: genre,
                visibility: visibility,
                videoPath: mockUrl,
                thumbnailUrl: "/placeholder.svg", // Placeholder
                status: "pending", // Default status for review
                monetization: {
                    type: monetizationType,
                    price: monetizationType === 'paid' ? parseFloat(price) || 0 : 0,
                    rentalPrice: monetizationType === 'paid' ? parseFloat(rentalPrice) || 0 : 0
                },
                views: 0,
                revenue: 0,
                createdAt: serverTimestamp()
            })

            // Update user stats (optional, could be a cloud function)

            router.push("/creator-studio?uploaded=true")
        } catch (error) {
            console.error("Error uploading video:", error)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Upload New Content</h1>
                    <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* File Upload Area */}
                    <div
                        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${dragActive ? "border-[#E50914] bg-[#E50914]/5" : "border-[#2a2a2a] bg-[#141414]"
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        {file ? (
                            <div className="flex flex-col items-center">
                                <Film className="w-16 h-16 text-[#E50914] mb-4" />
                                <p className="text-xl font-medium mb-2">{file.name}</p>
                                <p className="text-gray-500 text-sm mb-6">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                    onClick={() => setFile(null)}
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Remove File
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <Upload className="w-16 h-16 text-gray-600 mb-4" />
                                <p className="text-xl font-medium mb-2">Drag and drop video files to upload</p>
                                <p className="text-gray-500 text-sm mb-6">Your videos will remain private until you publish them.</p>
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="hidden"
                                        accept="video/*"
                                        onChange={handleChange}
                                    />
                                    <Button asChild>
                                        <label htmlFor="file-upload" className="cursor-pointer bg-[#E50914] hover:bg-[#c40812]">
                                            Select Files
                                        </label>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Details Form */}
                    <div className="grid gap-6 bg-[#141414] p-8 rounded-xl border border-[#2a2a2a]">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Info className="w-5 h-5 text-[#E50914]" />
                            Details
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                                <Input
                                    placeholder="e.g. The Lost City"
                                    className="bg-[#0a0a0a] border-[#333]"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                                <textarea
                                    className="w-full h-32 rounded-md border border-[#333] bg-[#0a0a0a] p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                                    placeholder="Tell viewers about your video..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Genre</label>
                                    <select
                                        className="w-full h-10 rounded-md border border-[#333] bg-[#0a0a0a] px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                                        value={genre}
                                        onChange={(e) => setGenre(e.target.value)}
                                    >
                                        <option>Drama</option>
                                        <option>Comedy</option>
                                        <option>Sci-Fi</option>
                                        <option>Horror</option>
                                        <option>Documentary</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Visibility</label>
                                    <select
                                        className="w-full h-10 rounded-md border border-[#333] bg-[#0a0a0a] px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                                        value={visibility}
                                        onChange={(e) => setVisibility(e.target.value)}
                                    >
                                        <option>Public</option>
                                        <option>Unlisted</option>
                                        <option>Private</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Monetization */}
                    <div className="grid gap-6 bg-[#141414] p-8 rounded-xl border border-[#2a2a2a]">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-green-500" />
                            Monetization
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <input
                                    type="radio"
                                    name="monetization"
                                    id="free"
                                    className="text-[#E50914] focus:ring-[#E50914]"
                                    checked={monetizationType === 'free'}
                                    onChange={() => setMonetizationType('free')}
                                />
                                <label htmlFor="free" className="flex-1 cursor-pointer">
                                    <span className="block font-medium">Free (Ad-Supported)</span>
                                    <span className="block text-xs text-gray-500">Earn revenue from pre-roll ads.</span>
                                </label>
                            </div>
                            <div className="flex items-center gap-4">
                                <input
                                    type="radio"
                                    name="monetization"
                                    id="paid"
                                    className="text-[#E50914] focus:ring-[#E50914]"
                                    checked={monetizationType === 'paid'}
                                    onChange={() => setMonetizationType('paid')}
                                />
                                <label htmlFor="paid" className="flex-1 cursor-pointer">
                                    <span className="block font-medium">Rent / Buy</span>
                                    <span className="block text-xs text-gray-500">Set a price for 48h rental or lifetime purchase.</span>
                                </label>
                            </div>

                            {monetizationType === 'paid' && (
                                <div className="grid grid-cols-2 gap-4 pl-8 pt-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Purchase Price ($)</label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="14.99"
                                            className="bg-[#0a0a0a] border-[#333]"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Rental Price ($)</label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="3.99"
                                            className="bg-[#0a0a0a] border-[#333]"
                                            value={rentalPrice}
                                            onChange={(e) => setRentalPrice(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            size="lg"
                            className="bg-[#E50914] hover:bg-[#c40812] text-white w-40"
                            disabled={!file || isUploading}
                        >
                            {isUploading ? "Uploading..." : "Submit for Review"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
