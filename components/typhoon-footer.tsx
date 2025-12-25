import { Facebook, Instagram, Music, Youtube } from "lucide-react"

export function TyphoonFooter() {
    return (
        <footer className="border-t border-border bg-background">
            <div className="flex items-center justify-between px-6 py-6">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                        <div className="w-4 h-3 bg-primary-foreground rounded-sm"></div>
                    </div>
                    <span className="text-sm text-muted-foreground">© Typhoonhub. All Rights Reserved.</span>
                </div>

                <div className="flex items-center space-x-4">
                    <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                        <Facebook className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                        <Instagram className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                        <Music className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                        <Youtube className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default TyphoonFooter
