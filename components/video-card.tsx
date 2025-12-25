"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import { getStorageUrl } from "@/lib/firebase"
import { VideoData } from "@/lib/video-data"
import { cn } from "@/lib/utils"

interface VideoCardProps {
    video: VideoData
    onClick: (video: VideoData) => void
    className?: string
}

export function VideoCard({ video, onClick, className }: VideoCardProps) {
    const [thumbnailUrl, setThumbnailUrl] = useState<string>("/placeholder.svg")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true

        async function fetchThumbnail() {
            if (video.thumbnail) {
                try {
                    const url = await getStorageUrl(video.thumbnail)
                    if (isMounted) {
                        setThumbnailUrl(url)
                        setLoading(false)
                    }
                } catch (error) {
                    console.error("Error fetching thumbnail:", error)
                    if (isMounted) setLoading(false)
                }
            } else {
                if (isMounted) setLoading(false)
            }
        }

        fetchThumbnail()

        return () => {
            isMounted = false
        }
    }, [video.thumbnail])

    return (
        <div
            className={cn("group cursor-pointer relative", className)}
            onClick={() => onClick(video)}
        >
            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted mb-3 shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02]">
                <Image
                    src={thumbnailUrl}
                    alt={video.title}
                    fill
                    className={cn(
                        "object-cover transition-transform duration-500 group-hover:scale-110",
                        loading ? "opacity-50" : "opacity-100"
                    )}
                />

                {/* Overlay with Play Button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 bg-primary/90 rounded-full flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-300 delay-100">
                        <Play className="w-6 h-6 text-primary-foreground fill-primary-foreground ml-1" />
                    </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded font-medium uppercase tracking-wider">
                    {video.category}
                </div>
            </div>

            <div className="px-1">
                <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {video.title}
                </h3>
                <div className="flex justify-between items-center mt-1">
                    <p className="text-muted-foreground text-sm line-clamp-1">
                        {video.description}
                    </p>
                    {video.price && (
                        <span className="text-xs font-bold text-[#E50914] bg-[#E50914]/10 px-1.5 py-0.5 rounded border border-[#E50914]/20 whitespace-nowrap ml-2">
                            PREMIUM
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
