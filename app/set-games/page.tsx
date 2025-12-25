import { Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SetGamesPage() {
    return (
        <div className="min-h-screen bg-[#0f171e] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">

            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-5 pointer-events-none"></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3aa7ff]/20 rounded-full blur-[128px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] pointer-events-none"></div>

            <div className="max-w-2xl mx-auto text-center space-y-8 z-10">
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-[#3aa7ff] blur-2xl opacity-25 rounded-full"></div>
                    <div className="relative bg-[#19232d] p-8 rounded-2xl border border-white/10 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                        <Gamepad2 className="w-24 h-24 text-[#3aa7ff]" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
                        SET <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3aa7ff] to-[#00E0FF]">GAMES</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-lg mx-auto leading-relaxed">
                        Play exclusive behind-the-scenes games, trivia, and challenges related to your favorite TyphoonHub films.
                    </p>
                </div>

                <div className="inline-block px-6 py-2 rounded-full bg-[#3aa7ff]/10 border border-[#3aa7ff]/30 text-[#3aa7ff] font-bold tracking-widest uppercase text-sm animate-pulse">
                    Coming Soon
                </div>

                <div className="pt-8">
                    <Button
                        asChild
                        className="bg-white text-black hover:bg-gray-200 font-bold px-8 py-6 rounded-full text-lg"
                    >
                        <a href="/">Back to Home</a>
                    </Button>
                </div>
            </div>
        </div>
    )
}
