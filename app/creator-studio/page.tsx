"use client"

import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { BarChart3, Film, Upload, DollarSign, Users, Clock } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { collection, query, where, getDocs, orderBy, type Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface VideoData {
    id: string
    title: string
    status: "active" | "pending" | "rejected"
    createdAt: Timestamp
    views: number
    revenue: number
    monetization: {
        type: "free" | "paid"
    }
}

export default function CreatorStudioPage() {
    const { user } = useAuth()
    const [videos, setVideos] = useState<VideoData[]>([])
    const [loadingVideos, setLoadingVideos] = useState(true)

    useEffect(() => {
        const fetchVideos = async () => {
            if (!user) return
            try {
                const q = query(
                    collection(db, "videos"),
                    where("creatorId", "==", user.id),
                    // orderBy("createdAt", "desc") // Requires compound index, stick to simple filter first or client sort
                )
                const querySnapshot = await getDocs(q)
                const videoList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as VideoData[]

                // Sort client-side to avoid index requirement during dev
                videoList.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)

                setVideos(videoList)
            } catch (error) {
                console.error("Error fetching creator videos:", error)
            } finally {
                setLoadingVideos(false)
            }
        }

        fetchVideos()
    }, [user])

    if (!user || user.userType !== "creator") {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                <p className="text-gray-400 mb-6">You must be a Creator to access this studio.</p>
                <Link href="/">
                    <Button>Return Home</Button>
                </Link>
            </div>
        )
    }

    const { creatorStats } = user

    return (
        <div className="min-h-screen bg-black text-foreground">
            <div className="flex h-screen overflow-hidden">

                {/* Sidebar */}
                <aside className="w-64 bg-[#0a0a0a] border-r border-[#2a2a2a] hidden md:flex flex-col">
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-[#E50914] flex items-center gap-2">
                            <Film className="w-6 h-6" />
                            STUDIO
                        </h2>
                    </div>

                    <nav className="flex-1 px-4 space-y-1">
                        <a href="#" className="flex items-center gap-3 px-4 py-3 bg-[#E50914]/10 text-[#E50914] rounded-lg">
                            <BarChart3 className="w-5 h-5" />
                            <span className="font-medium">Dashboard</span>
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                            <Film className="w-5 h-5" />
                            <span className="font-medium">Content</span>
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                            <DollarSign className="w-5 h-5" />
                            <span className="font-medium">Earnings</span>
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                            <Users className="w-5 h-5" />
                            <span className="font-medium">Community</span>
                        </a>
                    </nav>

                    <div className="p-4 border-t border-[#2a2a2a]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E50914] to-orange-600 flex items-center justify-center font-bold text-white">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-white truncate">{user.name}</div>
                                <div className="text-xs text-gray-500 truncate">{user.email}</div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">
                    {/* Header */}
                    <header className="h-16 border-b border-[#2a2a2a] bg-[#0a0a0a]/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
                        <h1 className="text-lg font-semibold text-white">Dashboard</h1>
                        <Link href="/creator-studio/upload">
                            <Button className="bg-[#E50914] hover:bg-[#c40812] text-white flex items-center gap-2">
                                <Upload className="w-4 h-4" />
                                Upload New
                            </Button>
                        </Link>
                    </header>

                    <div className="p-6 md:p-8 space-y-8">

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-[#141414] border border-[#2a2a2a] p-6 rounded-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-gray-400 text-sm font-medium">Total Earnings</span>
                                    <DollarSign className="w-5 h-5 text-green-500" />
                                </div>
                                <div className="text-3xl font-bold text-white">
                                    ${creatorStats?.totalEarnings.toLocaleString() || "0"}
                                </div>
                                <div className="text-sm text-green-500 mt-2 flex items-center gap-1">
                                    +12.5% <span className="text-gray-500">from last month</span>
                                </div>
                            </div>

                            <div className="bg-[#141414] border border-[#2a2a2a] p-6 rounded-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-gray-400 text-sm font-medium">Total Views</span>
                                    <Users className="w-5 h-5 text-blue-500" />
                                </div>
                                <div className="text-3xl font-bold text-white">
                                    {creatorStats?.totalViews.toLocaleString() || "0"}
                                </div>
                                <div className="text-sm text-green-500 mt-2 flex items-center gap-1">
                                    +8.2% <span className="text-gray-500">from last month</span>
                                </div>
                            </div>

                            <div className="bg-[#141414] border border-[#2a2a2a] p-6 rounded-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-gray-400 text-sm font-medium">Uploads</span>
                                    <Film className="w-5 h-5 text-purple-500" />
                                </div>
                                <div className="text-3xl font-bold text-white">
                                    {videos.length || creatorStats?.totalUploads || "0"}
                                </div>
                                <div className="text-sm text-gray-500 mt-2">
                                    {videos.filter(v => v.status === 'pending').length} pending approval
                                </div>
                            </div>

                            <div className="bg-[#141414] border border-[#2a2a2a] p-6 rounded-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-gray-400 text-sm font-medium">Watch Time</span>
                                    <Clock className="w-5 h-5 text-orange-500" />
                                </div>
                                <div className="text-3xl font-bold text-white">
                                    124h
                                </div>
                                <div className="text-sm text-green-500 mt-2 flex items-center gap-1">
                                    +5% <span className="text-gray-500">from last month</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Content Table */}
                        <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl overflow-hidden">
                            <div className="p-6 border-b border-[#2a2a2a]">
                                <h3 className="text-lg font-semibold text-white">Recent Content</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-400">
                                    <thead className="bg-[#0a0a0a] text-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 font-medium">Title</th>
                                            <th className="px-6 py-4 font-medium">Status</th>
                                            <th className="px-6 py-4 font-medium">Date</th>
                                            <th className="px-6 py-4 font-medium">Views</th>
                                            <th className="px-6 py-4 font-medium text-right">Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#2a2a2a]">
                                        {loadingVideos ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                                    Loading videos...
                                                </td>
                                            </tr>
                                        ) : videos.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                                    No videos uploaded yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            videos.map((video) => (
                                                <tr key={video.id} className="hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                                        <div className="w-10 h-6 bg-gray-800 rounded"></div>
                                                        {video.title}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {video.status === 'active' && (
                                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                                                                Active
                                                            </span>
                                                        )}
                                                        {video.status === 'pending' && (
                                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                                                Pending
                                                            </span>
                                                        )}
                                                        {video.status === 'rejected' && (
                                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
                                                                Rejected
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {video.createdAt ? new Date(video.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                                                    </td>
                                                    <td className="px-6 py-4">{video.views.toLocaleString()}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        {video.monetization.type === 'paid' ? `$${video.revenue.toFixed(2)}` : '-'}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    )
}
