"use client"

import { TyphoonHeader } from "@/components/typhoon-header"
import { BrowseContent } from "@/components/browse-content"
import { TyphoonFooter } from "@/components/typhoon-footer"
import { NewsletterSignup } from "@/components/newsletter-signup"

export default function Home() {
    return (
        <div className="min-h-screen bg-black text-white">
            <TyphoonHeader />
            <NewsletterSignup />
            <div className="-mt-12 relative z-0">
                <BrowseContent />
            </div>
            <TyphoonFooter />
        </div>
    )
}
