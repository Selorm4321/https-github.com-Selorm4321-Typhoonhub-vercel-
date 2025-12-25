"use client"

import { BrowseContent } from "@/components/browse-content"
import { TyphoonHeader } from "@/components/typhoon-header"
import { TyphoonFooter } from "@/components/typhoon-footer"

export default function FilmsPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <TyphoonHeader />
            <div className="pt-20">
                <BrowseContent />
            </div>
            <TyphoonFooter />
        </div>
    )
}
