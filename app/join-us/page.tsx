"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clapperboard, Users, Heart, Star, CheckCircle } from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export default function JoinUsPage() {
    const [email, setEmail] = useState("")
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

    const handleSubscribe = async () => {
        if (!email || !email.includes("@")) {
            alert("Please enter a valid email")
            return
        }

        setStatus("loading")
        try {
            await addDoc(collection(db, "subscribers"), {
                email,
                subscribedAt: serverTimestamp(),
                source: "join-us-page"
            })
            setStatus("success")
            setEmail("")
        } catch (error) {
            console.error("Error subscribing:", error)
            setStatus("error")
        }
    }

    return (
        <div className="min-h-screen bg-[#0f171e] text-white pt-20">
            {/* Hero Section */}
            <section className="relative py-20 px-4 md:px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#3aa7ff]/10 to-transparent pointer-events-none" />
                <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
                        JOIN THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] to-[#FF00E0]">REVOLUTION</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        TyphoonHub is more than a streaming service. It's a movement to give power back to independent storytellers.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
                        <Button className="bg-[#3aa7ff] hover:bg-[#3aa7ff]/90 text-white px-8 py-6 text-xl font-bold rounded-full">
                            Join Community
                        </Button>
                        <Link href="/submit">
                            <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white px-8 py-6 text-xl font-bold rounded-full">
                                I'm a Creator
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Two Paths Section */}
            <section className="py-20 px-4 md:px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12">

                    {/* For Viewers */}
                    <div className="bg-[#19232d] border border-white/10 rounded-2xl p-8 hover:border-[#3aa7ff]/50 transition-colors group">
                        <div className="w-16 h-16 bg-[#3aa7ff]/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Users className="w-8 h-8 text-[#3aa7ff]" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">For Movie Lovers</h2>
                        <ul className="space-y-4 text-gray-300 mb-8">
                            <li className="flex items-start gap-3">
                                <Star className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                                <span>Access thousands of exclusive independent films found nowhere else.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Heart className="w-6 h-6 text-red-500 flex-shrink-0" />
                                <span>Support creators directly—100% of your rental fee goes to the filmmaker.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Clapperboard className="w-6 h-6 text-purple-400 flex-shrink-0" />
                                <span>Experience cinema without corporate gatekeepers.</span>
                            </li>
                        </ul>
                        <Button className="w-full bg-white/5 hover:bg-white/10 text-white py-6 text-lg font-semibold">
                            Start Watching Free <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>

                    {/* For Creators */}
                    <div className="bg-[#19232d] border border-white/10 rounded-2xl p-8 hover:border-[#FF00E0]/50 transition-colors group">
                        <div className="w-16 h-16 bg-[#FF00E0]/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Clapperboard className="w-8 h-8 text-[#FF00E0]" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">For Creators</h2>
                        <ul className="space-y-4 text-gray-300 mb-8">
                            <li className="flex items-start gap-3">
                                <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">100%</span>
                                <span>Keep 100% of rental & purchase revenue. We take 0% commission.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Users className="w-6 h-6 text-blue-400 flex-shrink-0" />
                                <span>Reach a global audience instantly. No exclusive contracts.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Star className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                                <span>Get discovered on our Live TV and Featured playlists.</span>
                            </li>
                        </ul>
                        <Link href="/submit">
                            <Button className="w-full bg-gradient-to-r from-[#00E0FF] to-[#FF00E0] hover:opacity-90 text-white py-6 text-lg font-semibold">
                                Submit Your Film <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>

                </div>
            </section>

            {/* Newsletter / CTA */}
            <section className="py-20 px-4 text-center bg-[#0a0f14]">
                <div className="max-w-2xl mx-auto space-y-6">
                    <h2 className="text-3xl font-bold">Stay Updated</h2>
                    <p className="text-gray-400">
                        Get the latest indie film releases, creator interviews, and platform updates delivered to your inbox.
                    </p>

                    {status === "success" ? (
                        <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl flex items-center justify-center gap-2">
                            <CheckCircle className="w-6 h-6" />
                            <span className="font-bold">You're subscribed! Watch your inbox.</span>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3 focus:outline-none focus:border-[#3aa7ff]"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={status === "loading"}
                            />
                            <Button
                                className="bg-[#3aa7ff] hover:bg-[#3aa7ff]/90 text-white rounded-full px-8 py-3"
                                onClick={handleSubscribe}
                                disabled={status === "loading"}
                            >
                                {status === "loading" ? "..." : "Subscribe"}
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
