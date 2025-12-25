"use client"

import { TyphoonHeader } from "@/components/typhoon-header"
import { TyphoonFooter } from "@/components/typhoon-footer"
import { Film } from "lucide-react"

export default function RentalsPage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <TyphoonHeader />
            <main className="flex-grow pt-32 container mx-auto px-4 text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                        <Film className="w-10 h-10 text-primary" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Rental Films</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Premium independent films available for rent. Support creators directly.
                </p>
                <div className="mt-12 p-12 border border-white/10 rounded-lg bg-white/5">
                    <p className="text-lg">Coming Soon</p>
                </div>
            </main>
            <TyphoonFooter />
        </div>
    )
}
