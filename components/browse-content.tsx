"use client"

import { Film } from "lucide-react"
import { useState, useEffect } from "react"
import TyphoonVideoPlayer from "@/components/typhoon-video-player"
import { videos, type VideoData } from "@/lib/video-data"
import { VideoCard } from "@/components/video-card"

export function BrowseContent() {
    const [selectedShow, setSelectedShow] = useState<VideoData | null>(null)

    const openVideo = (show: VideoData) => {
        console.log("[v0] Opening video:", show.title, show.firebaseStoragePath)
        setSelectedShow(show)
    }

    const closeVideo = () => {
        setSelectedShow(null)
    }

    const [dynamicVideos, setDynamicVideos] = useState<VideoData[]>([])

    useEffect(() => {
        const fetchDynamicVideos = async () => {
            try {
                const { db } = await import("@/lib/firebase")
                const { collection, query, where, getDocs } = await import("firebase/firestore")

                const q = query(
                    collection(db, "videos"),
                    where("status", "==", "active")
                )
                const snapshot = await getDocs(q)
                const fetched: VideoData[] = snapshot.docs.map(doc => {
                    const data = doc.data()
                    return {
                        id: doc.id,
                        title: data.title,
                        description: data.description,
                        category: data.genre || "Community", // Map genre to category
                        firebaseStoragePath: data.videoPath,
                        thumbnail: data.thumbnailUrl,
                        price: data.price,
                        rentalPrice: data.rentalPrice,
                        creatorPaypal: data.creatorPaypal
                    } as VideoData
                })
                setDynamicVideos(fetched)
            } catch (e) {
                console.error("Failed to fetch dynamic videos", e)
            }
        }
        fetchDynamicVideos()
    }, [])

    const allVideos = [...videos, ...dynamicVideos]

    // Group videos by category
    const categories = Array.from(new Set(allVideos.map(v => v.category)))
    const videosByCategory = categories.reduce((acc, category) => {
        acc[category] = allVideos.filter(v => v.category === category)
        return acc
    }, {} as Record<string, VideoData[]>)

    return (
        <main className="container mx-auto px-4 py-16">
            {/* Header Section */}
            <div className="text-center mb-16">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                        <Film className="w-8 h-8 text-primary-foreground" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground tracking-tight">
                    Browse All Shows
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Explore our complete collection of independent films, shorts, and documentaries.
                </p>
            </div>

            {/* Content Groups */}
            <div className="space-y-16 mb-16">
                {categories.map((category) => (
                    <section key={category}>
                        <div className="flex items-center gap-4 mb-6">
                            <h2 className="text-2xl font-bold text-foreground">{category}</h2>
                            <div className="h-[1px] bg-border flex-grow mt-1 opacity-50"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {videosByCategory[category].map((show) => (
                                <VideoCard
                                    key={show.id}
                                    video={show}
                                    onClick={openVideo}
                                />
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            {selectedShow && (
                <div className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-6xl shadow-2xl rounded-lg overflow-hidden border border-border/50">
                        <TyphoonVideoPlayer
                            videoPath={selectedShow.firebaseStoragePath}
                            title={selectedShow.title}
                            autoplay={true}
                            onClose={closeVideo}
                            isLocked={!!selectedShow.price}
                            price={selectedShow.price}
                            rentalPrice={selectedShow.rentalPrice}
                            creatorPaypal={selectedShow.creatorPaypal}
                        />
                    </div>
                </div>
            )}
        </main>
    )
}

export default BrowseContent
