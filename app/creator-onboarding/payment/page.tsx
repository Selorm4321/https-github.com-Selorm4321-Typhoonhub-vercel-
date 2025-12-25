"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ShieldCheck, CreditCard, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"

const BENEFITS = [
    "Upload unlimited independent films and series",
    "Monetize your content via rentals and sales",
    "Earn revenue from platform advertisements",
    "Access to Creator Studio analytics dashboard",
    "Build your own community of film lovers",
]

export default function CreatorPaymentPage() {
    const [isProcessing, setIsProcessing] = useState(false)
    const router = useRouter()
    const { user, completeCreatorPayment } = useAuth()

    const handlePayment = async () => {
        setIsProcessing(true)
        const success = await completeCreatorPayment()
        if (success) {
            router.push("/creator-studio")
        } else {
            setIsProcessing(false)
            // Show error (prototype simplification)
            alert("Payment failed. Please try again.")
        }
    }

    if (!user || user.userType !== "creator") {
        // In a real app, redirect or show error if not logged in as pending creator
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">

                {/* Value Proposition */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-[#E50914] mb-2">
                        <ShieldCheck className="w-8 h-8" />
                        <span className="font-bold tracking-wider">TYPHOON CREATOR</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                        Start your journey as an <span className="text-[#E50914]">Independent Creator</span>.
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Join the TyphoonHub marketplace to distribute your films to a global audience and start earning today.
                    </p>

                    <ul className="space-y-4 pt-4">
                        {BENEFITS.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <div className="mt-1 bg-white/10 p-1 rounded-full">
                                    <Check className="w-4 h-4 text-[#E50914]" />
                                </div>
                                <span className="text-gray-300">{benefit}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Payment Card */}
                <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E50914] to-orange-600" />

                    <div className="text-center mb-8">
                        <h3 className="text-xl font-medium text-gray-300 mb-2">Lifetime Creator Access</h3>
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-5xl font-bold text-white">$19.99</span>
                            <span className="text-gray-500">/ once</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">One-time payment. No monthly fees.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-[#0a0a0a] border border-[#333] p-4 rounded-lg flex items-center gap-4 cursor-pointer hover:border-[#E50914] transition-colors">
                            <div className="bg-white p-2 rounded">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-white">Pay with PayPal</div>
                                <div className="text-xs text-gray-500">Safe, secure, and instant</div>
                            </div>
                            <div className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center">
                                <div className="w-3 h-3 bg-[#E50914] rounded-full" />
                            </div>
                        </div>

                        <div className="bg-[#0a0a0a] border border-[#333] p-4 rounded-lg flex items-center gap-4 opacity-50 cursor-not-allowed">
                            <CreditCard className="w-10 h-10 text-gray-500 p-2 bg-[#1a1a1a] rounded" />
                            <div className="flex-1">
                                <div className="font-medium text-gray-400">Credit Card</div>
                                <div className="text-xs text-gray-600">Coming soon</div>
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full mt-8 h-14 text-lg font-bold bg-[#E50914] hover:bg-[#c40812] text-white shadow-lg shadow-red-900/20"
                    >
                        {isProcessing ? "Processing..." : "Complete Payment"}
                    </Button>

                    <p className="text-xs text-gray-500 text-center mt-4">
                        By continuing, you agree to our Terms of Service and Creator Policy.
                    </p>
                </div>
            </div>
        </div>
    )
}
