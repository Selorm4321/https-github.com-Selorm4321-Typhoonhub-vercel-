"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function NewsletterSignup() {
    return (
        <section className="py-16 bg-muted/30 border-t border-border">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-4 text-foreground">Stay in the Loop</h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                    Get the latest updates on new indie films, exclusive screenings, and creator opportunities delivered to your inbox.
                </p>
                <div className="max-w-md mx-auto flex gap-2">
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        className="bg-background border-input text-foreground"
                    />
                    <Button>Subscribe</Button>
                </div>
            </div>
        </section>
    )
}
