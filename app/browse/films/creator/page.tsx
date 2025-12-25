"use client"

import { TyphoonHeader } from "@/components/typhoon-header"
import { TyphoonFooter } from "@/components/typhoon-footer"
import { Users } from "lucide-react"

export default function CreatorFilmsPage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <TyphoonHeader />
            <main className="flex-grow pt-32 container mx-auto px-4 text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-[#3aa7ff]/20 rounded-full flex items-center justify-center">
                        <Users className="w-10 h-10 text-[#3aa7ff]" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Creator Community Films</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Films uploaded by our community of independent creators.
                </p>
                <div className="mt-12 p-12 border border-white/10 rounded-lg bg-white/5">
                    <p className="text-lg">Coming Soon</p>
                </div>
            </main>
            <TyphoonFooter />
        </div>
    )
}
