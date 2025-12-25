"use client"

import { useState, useEffect } from "react"
import { TyphoonHeader } from "@/components/typhoon-header"
import { TyphoonFooter } from "@/components/typhoon-footer"
import TyphoonVideoPlayer from "@/components/typhoon-video-player"
import { videos } from "@/lib/video-data"
import { Radio } from "lucide-react"

// Helper component for async thumbnail loading
function AsyncThumbnail({ src, alt, className }: { src: string; alt: string; className?: string }) {
    const [resolvedSrc, setResolvedSrc] = useState(src)

    useEffect(() => {
        const resolve = async () => {
            if (src) {
                try {
                    // We only need to resolve if it looks like a path and not a URL
                    if (!src.startsWith('http')) {
                        const { getStorageUrl } = await import("@/lib/firebase")
                        const url = await getStorageUrl(src)
                        setResolvedSrc(url)
                    }
                } catch (e) {
                    console.error("Failed to resolve thumbnail:", e)
                }
            }
        }
        resolve()
    }, [src])

    return <img src={resolvedSrc} alt={alt} className={className} />
}

export default function LivePage() {
    // Start with a random video to simulate "tuning in"
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
        // Pick a random starting video on client load to make it feel more "live"
        setCurrentIndex(Math.floor(Math.random() * videos.length))
    }, [])

    const handleVideoEnded = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length)
    }

    const currentVideo = videos[currentIndex]
    const nextVideo = videos[(currentIndex + 1) % videos.length]

    if (!isClient) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col">
                <TyphoonHeader />
                <main className="flex-grow pt-20 flex flex-col container mx-auto px-4 items-center justify-center">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin mb-4" />
                        <div className="text-xl font-bold">Tuning in...</div>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <TyphoonHeader />

            <main className="flex-grow pt-20 flex flex-col container mx-auto px-4">
                <div className="flex items-center gap-3 mb-6 animate-pulse">
                    <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                        LIVE
                    </div>
                    <span className="text-xl font-bold tracking-tight">TYPHOON TV</span>
                </div>

                <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10 mb-8">
                    <TyphoonVideoPlayer
                        key={currentVideo.id} // Key ensures component remounts on video change
                        videoPath={currentVideo.firebaseStoragePath}
                        title={currentVideo.title}
                        autoplay={true}
                        onEnded={handleVideoEnded}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-4">
                        <h1 className="text-3xl font-bold">{currentVideo.title}</h1>
                        <p className="text-gray-400 text-lg">{currentVideo.description}</p>
                        <div className="flex items-center gap-2 text-sm text-[#3aa7ff]">
                            <Radio className="w-4 h-4" />
                            <span>Broadcasting Now</span>
                        </div>
                    </div>

                    <div className="bg-[#19232d] p-6 rounded-xl border border-white/10 h-fit">
                        <h3 className="text-lg font-bold mb-4 text-gray-300 uppercase tracking-widest text-xs">Up Next</h3>
                        <div className="flex gap-4 items-start group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors" onClick={handleVideoEnded}>
                            <div className="w-24 aspect-video bg-black rounded-md overflow-hidden relative border border-white/10">
                                {/* Next video preview */}
                                {nextVideo.thumbnail && (
                                    <AsyncThumbnail
                                        src={nextVideo.thumbnail}
                                        alt={nextVideo.title}
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                    />
                                )}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm line-clamp-2 group-hover:text-[#3aa7ff] transition-colors">{nextVideo.title}</h4>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{nextVideo.category}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <TyphoonFooter />
        </div>
    )
}
