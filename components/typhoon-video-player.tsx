"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize,
    Minimize,
    Settings,
    PictureInPicture,
    Loader2,
    RotateCcw,
    Home,
    X,
    Lock,
    CreditCard
} from "lucide-react"
import Link from "next/link"
import { getStorageUrl, db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { useAuth } from "./auth-context"
import { PayPalButtons } from "@paypal/react-paypal-js"

interface TyphoonVideoPlayerProps {
    videoPath: string
    posterUrl?: string
    title?: string
    autoplay?: boolean
    className?: string
    onClose?: () => void
    onEnded?: () => void
    // Monetization Props
    isLocked?: boolean
    price?: number
    rentalPrice?: number
    creatorPaypal?: string
    contentId?: string
}

export default function TyphoonVideoPlayer({
    videoPath,
    posterUrl,
    title = "TyphoonHub Video",
    autoplay = false,
    className = "",
    onClose,
    onEnded,
    isLocked = false,
    price = 0,
    rentalPrice = 0,
    creatorPaypal = "creator@typhoonhub.com",
    contentId = "demo-id",
}: TyphoonVideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const progressBarRef = useRef<HTMLDivElement>(null)
    const volumeSliderRef = useRef<HTMLInputElement>(null)

    const { user } = useAuth()

    // Video URL state
    const [videoUrl, setVideoUrl] = useState("")
    const [posterSrc, setPosterSrc] = useState(posterUrl || "")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Ad State
    const [isAdPlaying, setIsAdPlaying] = useState(false)
    const [adTimeLeft, setAdTimeLeft] = useState(5) // 5 second ad
    const [adSkipped, setAdSkipped] = useState(false)

    // Playback state
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [buffered, setBuffered] = useState(0)

    // Control state
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [playbackRate, setPlaybackRate] = useState(1)
    const [showControls, setShowControls] = useState(true)
    const [showSpeedMenu, setShowSpeedMenu] = useState(false)
    const [isHovering, setIsHovering] = useState(false)

    // Monetization State
    const [isUnlocked, setIsUnlocked] = useState(!isLocked)
    const [isProcessingPayment, setIsProcessingPayment] = useState(false)
    const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null)

    const hideControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Prepare Ad
    useEffect(() => {
        // Simple logic: If it's a paid video or specific condition, maybe don't show ad?
        // For now, let's show an ad for EVERY video to demonstrate the feature.
        // In reality, checking `if (!isPremium)` or similar would be better.
        if (!adSkipped && !isAdPlaying && isUnlocked) {
            setIsAdPlaying(true)
            setAdTimeLeft(5)
        }
    }, [isUnlocked, adSkipped])

    // Ad Timer
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isAdPlaying && adTimeLeft > 0) {
            interval = setInterval(() => {
                setAdTimeLeft((prev) => prev - 1)
            }, 1000)
        } else if (isAdPlaying && adTimeLeft === 0) {
            // Ad finished naturally
            setIsAdPlaying(false)
        }
        return () => clearInterval(interval)
    }, [isAdPlaying, adTimeLeft])

    useEffect(() => {
        const fetchVideoAndPoster = async () => {
            // ... (existing resolution logic) ...

            // Resolve Poster URL
            if (posterUrl) {
                try {
                    const resolvedPoster = await getStorageUrl(posterUrl)
                    setPosterSrc(resolvedPoster)
                } catch (err) {
                    console.error("Error resolving poster:", err)
                }
            }

            // If locked and not paid, don't load full video yet
            if (!isUnlocked) {
                setLoading(false)
                return
            }

            // If Ad is playing, we don't load the main video yet, OR we load it in background.
            // For simplicity, let's wait until ad is done to "show" the video, 
            // but we can start resolving the URL now.

            if (!videoPath) {
                setError("No video path provided")
                setLoading(false)
                return
            }

            try {
                // ... (existing fetch logic) ...
                console.log("[v0] Loading video:", videoPath)
                setLoading(true)
                setError(null)

                if (!videoPath) {
                    throw new Error("No video path provided")
                }

                if (videoPath.startsWith("http") || videoPath.startsWith("blob")) {
                    setVideoUrl(videoPath)
                    setLoading(false)
                    return
                }

                const url = await getStorageUrl(videoPath)
                console.log("[Player] Resolved video URL:", url)

                setVideoUrl(url)
                setLoading(false)
            } catch (err: any) {
                console.error("[v0] Failed to load video:", err)
                setError(`Failed to load video from storage`)
                setLoading(false)
            }
        }

        fetchVideoAndPoster()
    }, [videoPath, posterUrl, isUnlocked]) // Re-run when unlocked

    // Mock Payment Handler
    // Payment Handler
    const handlePayment = async (type: 'rent' | 'buy') => {
        if (!user) {
            alert("Please login to purchase")
            return
        }

        setIsProcessingPayment(true)

        // Use the creatorPaypal prop if available, otherwise fallback to platform
        const recipientEmail = creatorPaypal || "platform@typhoonhub.ca"
        const amount = type === 'rent' ? rentalPrice : price

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500))

            // Log transaction in Firestore
            await addDoc(collection(db, "transactions"), {
                userId: user.id,
                userEmail: user.email,
                videoId: videoPath, // ideally actual ID
                amount: amount || 2.99,
                type: type,
                date: serverTimestamp(),
                status: "completed",
                recipient: recipientEmail // Track who got the money
            })

            setIsUnlocked(true)
            setPaymentSuccessMsg(`Payment successful! Sent to ${recipientEmail}`)
            setTimeout(() => setPaymentSuccessMsg(null), 3000)
        } catch (error) {
            console.error("Payment failed:", error)
            alert("Payment failed")
        } finally {
            setIsProcessingPayment(false)
        }
    }

    // Auto-hide controls after 3 seconds of inactivity
    useEffect(() => {
        if (isPlaying && !isHovering) {
            hideControlsTimeoutRef.current = setTimeout(() => {
                setShowControls(false)
            }, 3000)
        } else {
            setShowControls(true)
        }

        return () => {
            if (hideControlsTimeoutRef.current) {
                clearTimeout(hideControlsTimeoutRef.current)
            }
        }
    }, [isPlaying, isHovering])

    // Video event handlers
    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration)
            if (autoplay && isUnlocked) {
                videoRef.current.play()
                setIsPlaying(true)
            }
        }
    }

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime)
        }
    }

    const handleProgress = () => {
        if (videoRef.current && videoRef.current.buffered.length > 0) {
            const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1)
            setBuffered((bufferedEnd / duration) * 100)
        }
    }

    const handleEnded = () => {
        setIsPlaying(false)
        if (onEnded) {
            onEnded()
        }
    }

    // Playback controls
    const togglePlayPause = () => {
        if (!isUnlocked) return

        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause()
            } else {
                videoRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isUnlocked) return
        if (progressBarRef.current && videoRef.current) {
            const rect = progressBarRef.current.getBoundingClientRect()
            const pos = (e.clientX - rect.left) / rect.width
            videoRef.current.currentTime = pos * duration
        }
    }

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = Number.parseFloat(e.target.value)
        setVolume(newVolume)
        setIsMuted(newVolume === 0)
        if (videoRef.current) {
            videoRef.current.volume = newVolume
        }
    }

    const toggleMute = () => {
        if (videoRef.current) {
            const newMutedState = !isMuted
            setIsMuted(newMutedState)
            videoRef.current.muted = newMutedState
            if (newMutedState) {
                setVolume(0)
            } else {
                setVolume(videoRef.current.volume || 1)
            }
        }
    }

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen()
            setIsFullscreen(true)
        } else {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
    }

    const changePlaybackRate = (rate: number) => {
        if (videoRef.current) {
            videoRef.current.playbackRate = rate
            setPlaybackRate(rate)
            setShowSpeedMenu(false)
        }
    }

    const togglePictureInPicture = async () => {
        if (videoRef.current) {
            try {
                if (document.pictureInPictureElement) {
                    await document.exitPictureInPicture()
                } else {
                    await videoRef.current.requestPictureInPicture()
                }
            } catch (err) {
                console.error("PiP error:", err)
            }
        }
    }

    const handleRetry = async () => {
        setError(null)
        setLoading(true)
        try {
            const url = await getStorageUrl(videoPath)
            setVideoUrl(url)
        } catch (err) {
            console.error("Retry failed:", err)
            setError("Failed to retry loading video")
        }
        setLoading(false)
    }

    // Keyboard shortcuts
    useEffect(() => {
        if (!isUnlocked) return

        const handleKeyPress = (e: KeyboardEvent) => {
            if (!videoRef.current) return

            switch (e.key) {
                case " ":
                    e.preventDefault()
                    togglePlayPause()
                    break
                case "m":
                case "M":
                    toggleMute()
                    break
                case "f":
                case "F":
                    toggleFullscreen()
                    break
                case "ArrowLeft":
                    videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5)
                    break
                case "ArrowRight":
                    videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 5)
                    break
                case "ArrowUp":
                    e.preventDefault()
                    setVolume((prev) => Math.min(1, prev + 0.1))
                    if (videoRef.current) videoRef.current.volume = Math.min(1, volume + 0.1)
                    break
                case "ArrowDown":
                    e.preventDefault()
                    setVolume((prev) => Math.max(0, prev - 0.1))
                    if (videoRef.current) videoRef.current.volume = Math.max(0, volume - 0.1)
                    break
            }
        }

        window.addEventListener("keydown", handleKeyPress)
        return () => window.removeEventListener("keydown", handleKeyPress)
    }, [isPlaying, volume, duration, isUnlocked])

    // Format time helper
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    // Locked / Payment Overlay
    if (!isUnlocked) {
        return (
            <div className={`relative w-full aspect-video bg-[#0B0B10] rounded-lg overflow-hidden flex flex-col items-center justify-center ${className}`}>
                {/* Background Image/Blur would go here */}
                {posterUrl && (
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm"
                        style={{ backgroundImage: `url(${posterUrl})` }}
                    />
                )}

                <div className="z-10 bg-black/80 p-8 rounded-xl border border-[#2a2a2a] max-w-md w-full text-center relative">
                    <div className="absolute top-4 right-4 text-gray-400 cursor-pointer" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </div>

                    <Lock className="w-12 h-12 text-[#E50914] mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                    <p className="text-gray-400 mb-6">Support the creator directly to watch this film.</p>

                    {isProcessingPayment ? (
                        <div className="py-8">
                            <Loader2 className="w-10 h-10 text-[#E50914] animate-spin mx-auto mb-2" />
                            <p className="text-sm text-gray-300">Processing PayPal Transaction...</p>
                        </div>
                    ) : (
                        <>
                            <div className="w-full max-w-[300px] mx-auto space-y-4">
                                {(rentalPrice > 0 || price > 0) && (
                                    <div className="relative z-0">
                                        <PayPalButtons
                                            style={{ layout: "vertical", shape: "rect" }}
                                            createOrder={(data, actions) => {
                                                const recipientInfo = creatorPaypal ? {
                                                    email_address: creatorPaypal
                                                } : undefined

                                                return actions.order.create({
                                                    intent: "CAPTURE",
                                                    purchase_units: [
                                                        {
                                                            description: rentalPrice > 0 ? `Rent: ${title}` : `Buy: ${title}`,
                                                            amount: {
                                                                value: (rentalPrice > 0 ? rentalPrice : price).toString(),
                                                                currency_code: "USD"
                                                            },
                                                            ...(recipientInfo && { payee: recipientInfo }),
                                                        },
                                                    ],
                                                })
                                            }}
                                            onApprove={async (data, actions) => {
                                                if (actions.order) {
                                                    const details = await actions.order.capture()
                                                    console.log("Transaction completed by " + details.payer.name?.given_name)

                                                    // Handle success logic
                                                    const type = rentalPrice > 0 ? 'rent' : 'buy'
                                                    const recipientEmail = creatorPaypal || "platform@typhoonhub.ca"
                                                    const amount = rentalPrice > 0 ? rentalPrice : price

                                                    // Log transaction in Firestore
                                                    await addDoc(collection(db, "transactions"), {
                                                        userId: user?.id || "anonymous",
                                                        userEmail: user?.email || "anonymous",
                                                        videoId: videoPath,
                                                        amount: amount,
                                                        type: type,
                                                        date: serverTimestamp(),
                                                        status: "completed",
                                                        recipient: recipientEmail,
                                                        paypalOrderId: data.orderID
                                                    })

                                                    setIsUnlocked(true)
                                                    setPaymentSuccessMsg(`Payment successful!`)
                                                    setTimeout(() => setPaymentSuccessMsg(null), 3000)
                                                }
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="pt-2 flex items-center justify-center gap-2 text-xs text-gray-500">
                                <CreditCard className="w-3 h-3" />
                                <span>Secured by PayPal</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        )
    }

    // Loading state
    if (loading) {
        return (
            <div className={`relative w-full aspect-video bg-[#0B0B10] rounded-lg overflow-hidden flex items-center justify-center ${className}`}>
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-[#E50914] animate-spin mx-auto mb-4" />
                    <div className="text-white text-lg font-medium">Loading Video...</div>
                    <div className="text-gray-400 text-sm mt-2">
                        {paymentSuccessMsg ? (
                            <span className="text-green-500 font-bold">{paymentSuccessMsg}</span>
                        ) : (
                            "Preparing your viewing experience"
                        )}
                    </div>
                </div>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div
                className={`relative w-full aspect-video bg-[#0B0B10] rounded-lg overflow-hidden flex items-center justify-center ${className}`}
            >
                <div className="text-center px-8">
                    <div className="text-[#E50914] text-6xl mb-4">⚠</div>
                    <h3 className="text-white text-xl font-semibold mb-2">Video Unavailable</h3>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={handleRetry}
                        className="bg-[#E50914] hover:bg-[#c40812] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
                    >
                        <RotateCcw className="w-5 h-5" />
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    // Video error and canplay handlers for debugging
    const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
        const video = e.currentTarget
        const errorCode = video.error?.code
        const errorMessage = video.error?.message || "Unknown video error"

        console.error("[v0] Video playback error code:", errorCode)
        console.error("[v0] Video playback error message:", errorMessage)

        const fileExtension = videoPath.split(".").pop()?.toLowerCase()
        const isUnsupportedFormat = ["mov", "avi", "wmv", "mkv", "flv"].includes(fileExtension || "")

        // Map error codes to user-friendly messages
        let userMessage = ""
        switch (errorCode) {
            case 1: // MEDIA_ERR_ABORTED
                userMessage = "Video playback was aborted"
                break
            case 2: // MEDIA_ERR_NETWORK
                userMessage = "Network error while loading video"
                break
            case 3: // MEDIA_ERR_DECODE
                userMessage = "Video decode error - file may be corrupted"
                break
            case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
                if (isUnsupportedFormat) {
                    userMessage = `This video format (.${fileExtension}) is not supported by your browser. Please convert to MP4 for playback.`
                } else {
                    userMessage = "Video format not supported or file not found"
                }
                break
            default:
                userMessage = "Unknown video error"
        }

        setError(userMessage)
    }

    return (
        <div
            ref={containerRef}
            className={`relative w-full aspect-video bg-black rounded-lg overflow-hidden group ${className}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={() => {
                setShowControls(true)
                if (hideControlsTimeoutRef.current) {
                    clearTimeout(hideControlsTimeoutRef.current)
                }
            }}
        >
            {/* Video element */}
            {!isAdPlaying && (
                <video
                    ref={videoRef}
                    className="w-full h-full object-contain"
                    src={videoUrl}
                    poster={posterSrc}
                    onLoadedMetadata={handleLoadedMetadata}
                    onTimeUpdate={handleTimeUpdate}
                    onProgress={handleProgress}
                    onEnded={handleEnded}
                    onError={handleVideoError}
                    onClick={togglePlayPause}
                    playsInline
                >
                    Your browser does not support the video tag.
                </video>
            )}

            {/* Ad Overlay */}
            {isAdPlaying && isUnlocked && (
                <div className="absolute inset-0 bg-black z-20 flex flex-col items-center justify-center">
                    <div className="absolute top-4 left-4 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                        AD
                    </div>
                    <div className="text-center space-y-4">
                        <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00E0FF] to-[#FF00E0]">
                            TYPHOON PREMIERES
                        </h3>
                        <p className="text-gray-400">Discover the world's best independent films.</p>
                        <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto mt-4">
                            <div
                                className="h-full bg-[#3aa7ff] transition-all duration-1000 ease-linear"
                                style={{ width: `${((5 - adTimeLeft) / 5) * 100}%` }}
                            />
                        </div>
                    </div>
                    <div className="absolute bottom-8 right-8">
                        {adTimeLeft > 0 ? (
                            <div className="bg-white/10 backdrop-blur px-4 py-2 rounded text-sm text-white">
                                Ad ends in {adTimeLeft}s
                            </div>
                        ) : (
                            <Button
                                onClick={() => setIsAdPlaying(false)}
                                className="bg-white text-black hover:bg-gray-200"
                            >
                                Skip Ad
                                <Play className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                    </div>
                </div>
            )}

            <div
                className={`absolute top-4 left-4 right-4 flex justify-between items-center transition-opacity duration-200 z-10 ${showControls ? "opacity-100" : "opacity-0"
                    }`}
            >
                {/* Home button */}
                <Link
                    href="/"
                    className="flex items-center gap-2 bg-black/70 hover:bg-[#E50914] text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors duration-200"
                >
                    <Home className="w-5 h-5" />
                    <span className="text-sm font-medium hidden sm:inline">Home</span>
                </Link>

                {/* Close button - only show if onClose is provided */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 bg-black/70 hover:bg-[#E50914] text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors duration-200"
                        aria-label="Close video"
                    >
                        <X className="w-5 h-5" />
                        <span className="text-sm font-medium hidden sm:inline">Close</span>
                    </button>
                )}
            </div>

            {/* TyphoonHub watermark */}
            <div className="absolute bottom-20 right-4 opacity-15 pointer-events-none">
                <div className="text-white font-bold text-xl">TyphoonHub</div>
            </div>

            {/* Center play/pause button */}
            <div
                className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200 ${showControls && !isPlaying ? "opacity-100" : "opacity-0"
                    }`}
            >
                <button
                    onClick={togglePlayPause}
                    className="pointer-events-auto bg-[#E50914] hover:bg-[#c40812] rounded-full p-6 transition-all duration-200 hover:scale-110"
                    aria-label="Play video"
                >
                    <Play className="w-12 h-12 text-white fill-white" />
                </button>
            </div>

            {/* Controls overlay */}
            <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-200 ${showControls ? "opacity-100" : "opacity-0"
                    }`}
            >
                {/* Progress bar */}
                <div className="px-4 pt-8 pb-2">
                    <div
                        ref={progressBarRef}
                        className="relative h-1 bg-gray-600 rounded-full cursor-pointer hover:h-2 transition-all group/progress"
                        onClick={handleProgressClick}
                    >
                        {/* Buffered progress */}
                        <div className="absolute top-0 left-0 h-full bg-gray-500 rounded-full" style={{ width: `${buffered}%` }} />
                        {/* Current progress */}
                        <div
                            className="absolute top-0 left-0 h-full bg-[#E50914] rounded-full"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                        />
                        {/* Progress handle */}
                        <div
                            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#E50914] rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity"
                            style={{ left: `${(currentTime / duration) * 100}%` }}
                        />
                    </div>
                    {/* Time display */}
                    <div className="flex justify-between text-xs text-gray-300 mt-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Control buttons */}
                <div className="flex items-center justify-between px-4 pb-4">
                    {/* Left controls */}
                    <div className="flex items-center gap-3">
                        {/* Play/Pause */}
                        <button
                            onClick={togglePlayPause}
                            className="text-white hover:text-[#E50914] transition-colors"
                            aria-label={isPlaying ? "Pause" : "Play"}
                        >
                            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                        </button>

                        {/* Volume */}
                        <div className="flex items-center gap-2 group/volume">
                            <button
                                onClick={toggleMute}
                                className="text-white hover:text-[#E50914] transition-colors"
                                aria-label={isMuted ? "Unmute" : "Mute"}
                            >
                                {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                            </button>
                            <input
                                ref={volumeSliderRef}
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="w-0 group-hover/volume:w-20 transition-all duration-200 accent-[#E50914]"
                                aria-label="Volume"
                            />
                        </div>

                        {/* Title */}
                        <span className="text-white text-sm font-medium ml-2 hidden md:block">{title}</span>
                    </div>

                    {/* Right controls */}
                    <div className="flex items-center gap-3">
                        {/* Playback speed */}
                        <div className="relative">
                            <button
                                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                                className="text-white hover:text-[#E50914] transition-colors flex items-center gap-1"
                                aria-label="Playback speed"
                            >
                                <Settings className="w-5 h-5" />
                                <span className="text-xs">{playbackRate}x</span>
                            </button>
                            {showSpeedMenu && (
                                <div className="absolute bottom-full right-0 mb-2 bg-[#0B0B10] border border-gray-700 rounded-lg overflow-hidden shadow-xl">
                                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                                        <button
                                            key={rate}
                                            onClick={() => changePlaybackRate(rate)}
                                            className={`block w-full px-4 py-2 text-sm text-left hover:bg-[#E50914] transition-colors ${playbackRate === rate ? "bg-[#E50914] text-white" : "text-gray-300"
                                                }`}
                                        >
                                            {rate}x
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Picture-in-Picture */}
                        <button
                            onClick={togglePictureInPicture}
                            className="text-white hover:text-[#E50914] transition-colors hidden md:block"
                            aria-label="Picture in Picture"
                        >
                            <PictureInPicture className="w-5 h-5" />
                        </button>

                        {/* Fullscreen */}
                        <button
                            onClick={toggleFullscreen}
                            className="text-white hover:text-[#E50914] transition-colors"
                            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                        >
                            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
