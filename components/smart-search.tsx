import { Search } from "lucide-react"

export function SmartSearch({ isMobile, onClose }: { isMobile?: boolean; onClose?: () => void }) {
    if (isMobile) {
        if (onClose) return null; // Simplified logic for mobile search overlay
        return null;
    }
    return (
        <div className="flex items-center bg-muted rounded px-3 py-2">
            <Search className="w-4 h-4 text-muted-foreground mr-2" />
            <input type="text" placeholder="Search..." className="bg-transparent border-none focus:outline-none text-sm" />
        </div>
    )
}
