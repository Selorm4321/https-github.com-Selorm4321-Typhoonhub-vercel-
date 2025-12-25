"use client"

import { TyphoonHeader } from "@/components/typhoon-header"
import { TyphoonFooter } from "@/components/typhoon-footer"
import Image from "next/image"

export default function SeriesPage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <TyphoonHeader />
            <main className="flex-grow pt-20">
                <div className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                    {/* Background Image with Overlay */}
                    <Image
                        src="/images/thumbnails/typhoonhub-film-generic.png"
                        alt="Series Coming Soon"
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                    {/* Content */}
                    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
                            SERIES <span className="text-[#3aa7ff]">COMING SOON</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                            We are curating an exclusive lineup of independent series, documentaries, and episodic content. Stay tuned.
                        </p>
                    </div>
                </div>

                {/* Newsletter/Notify Section could go here */}
                <div className="container mx-auto px-4 py-20 text-center">
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 max-w-2xl mx-auto backdrop-blur-sm">
                        <h3 className="text-2xl font-bold mb-4">Be the first to know</h3>
                        <p className="text-gray-400 mb-6">Get notified when we launch our first series.</p>
                        <button className="px-8 py-3 bg-[#3aa7ff] hover:bg-[#3aa7ff]/90 text-white font-bold rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-[#3aa7ff]/25">
                            Join the Waitlist
                        </button>
                    </div>
                </div>
            </main>
            <TyphoonFooter />
        </div>
    )
}
