"use client"

import TyphoonHeader from "@/components/typhoon-header"
import TyphoonFooter from "@/components/typhoon-footer"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Lock, PlayCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import TyphoonVideoPlayer from "@/components/typhoon-video-player"
import { videos } from "@/lib/video-data"

// Helper component for async thumbnail loading
function AsyncThumbnail({ src, alt, className }: { src?: string; alt: string; className?: string }) {
    const [resolvedSrc, setResolvedSrc] = useState(src || "/placeholder.svg")

    useEffect(() => {
        const resolve = async () => {
            if (src) {
                try {
                    // We only need to resolve if it looks like a path and not a URL
                    if (!src.startsWith('http') && !src.startsWith('/')) {
                        const { getStorageUrl } = await import("@/lib/firebase")
                        const url = await getStorageUrl(src)
                        setResolvedSrc(url)
                    } else {
                        setResolvedSrc(src)
                    }
                } catch (e) {
                    console.error("Failed to resolve thumbnail:", e)
                }
            }
        }
        resolve()
    }, [src])

    // eslint-disable-next-line @next/next/no-img-element
    return <img src={resolvedSrc} alt={alt} className={className} />
}

export default function TyphoonHubPodsPage() {
    const [selectedVideo, setSelectedVideo] = useState<any | null>(null)
    const [showVideoModal, setShowVideoModal] = useState(false)

    // Categorize videos for the podcast page
    // We are treating "Global Cinema", "Legends of Legacy", and some "Typhoonhub Film" as podcasts/shows
    const globalCinema = videos.filter(v => v.category === "Global Cinema")
    const legends = videos.filter(v => v.category === "Legends of Legacy")

    // Filter out specific "Talk Show" style videos from Typhoonhub Film
    const talkShows = videos.filter(v =>
        v.title.includes("Art of Indie") ||
        v.title.includes("Stigma") ||
        v.title.includes("Voice of Waste")
    )

    const categories = [
        { id: "featured", title: "Global Cinema Series", items: globalCinema },
        { id: "talks", title: "Typhoonhub Talks & Indie", items: talkShows },
        { id: "history", title: "Legends of Legacy", items: legends },
    ]

    const handleVideoClick = (video: any) => {
        setSelectedVideo(video)
        setShowVideoModal(true)
    }

    const scrollSection = (sectionId: string, direction: "left" | "right") => {
        const section = document.getElementById(`section-${sectionId}`)
        if (section) {
            const scrollAmount = direction === "left" ? -400 : 400
            section.scrollBy({ left: scrollAmount, behavior: "smooth" })
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <TyphoonHeader />

            <div className="bg-gradient-to-b from-muted/50 to-background border-b border-border pt-20">
                <div className="container mx-auto px-6 py-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
                            <PlayCircle className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                            TYPHOON<span className="text-primary">POD</span>
                        </h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Deep dives into global cinema, independent filmmaking, and the stories behind the lens.
                    </p>
                </div>
            </div>

            <main className="bg-background pb-20">
                {categories.map((category) => (
                    category.items.length > 0 &&
                    <div key={category.id} className="py-8 border-b border-white/5">
                        <div className="container mx-auto px-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    {category.title}
                                </h2>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => scrollSection(category.id, "left")}
                                        className="rounded-full hover:bg-white/10"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => scrollSection(category.id, "right")}
                                        className="rounded-full hover:bg-white/10"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>

                            <div
                                id={`section-${category.id}`}
                                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                            >
                                {category.items.map((video) => (
                                    <div
                                        key={video.id}
                                        onClick={() => handleVideoClick(video)}
                                        className="flex-shrink-0 w-64 cursor-pointer group"
                                    >
                                        <div className="relative aspect-video rounded-lg overflow-hidden mb-3 bg-white/5 border border-white/10">
                                            <AsyncThumbnail
                                                src={video.thumbnail}
                                                alt={video.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                                                <PlayCircle className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity transform scale-50 group-hover:scale-100 duration-200" />
                                            </div>
                                        </div>
                                        <h3 className="font-semibold text-sm text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                                            {video.title}
                                        </h3>
                                        <p className="text-xs text-muted-foreground line-clamp-2">{video.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </main>

            {showVideoModal && selectedVideo && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-lg max-w-5xl w-full overflow-hidden border border-border relative">
                        <div className="absolute top-4 right-4 z-50">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    setShowVideoModal(false)
                                    setSelectedVideo(null)
                                }}
                                className="text-white hover:bg-white/20 rounded-full"
                            >
                                ✕
                            </Button>
                        </div>
                        <TyphoonVideoPlayer
                            videoPath={selectedVideo.firebaseStoragePath}
                            posterUrl={selectedVideo.thumbnail}
                            title={selectedVideo.title}
                            autoplay={true}
                            onClose={() => {
                                setShowVideoModal(false)
                                setSelectedVideo(null)
                            }}
                        />
                    </div>
                </div>
            )}

            <TyphoonFooter />
        </div>
    )
}
