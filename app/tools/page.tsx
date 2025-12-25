import { ExternalLink, Wrench } from "lucide-react"
import Link from "next/link"

export default function ToolsPage() {
    const tools = [
        {
            title: "Typhoon Trailer Editor",
            description: "Create stunning trailers for your films with our powerful and easy-to-use editor.",
            href: "https://typhoonhub-trailer-editor.vercel.app/",
            icon: <Wrench className="w-8 h-8 text-[#3aa7ff]" />,
            buttonText: "Launch Editor",
        },
        // Add more tools here in the future
    ]

    return (
        <div className="min-h-screen bg-[#0f171e] pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white mb-4">
                        TYPHOON <span className="text-[#3aa7ff]">TOOLS</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl">
                        A collection of powerful tools designed to help creators bring their vision to life.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool, index) => (
                        <div
                            key={index}
                            className="group relative bg-[#19232d] border border-white/10 rounded-xl overflow-hidden hover:border-[#3aa7ff]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#3aa7ff]/10"
                        >
                            <div className="p-8 flex flex-col h-full">
                                <div className="mb-6 p-4 bg-[#0f171e] rounded-lg w-fit group-hover:bg-[#3aa7ff]/10 transition-colors">
                                    {tool.icon}
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#3aa7ff] transition-colors">
                                    {tool.title}
                                </h3>

                                <p className="text-gray-400 mb-8 flex-grow">
                                    {tool.description}
                                </p>

                                <a
                                    href={tool.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center w-full px-6 py-3 bg-[#3aa7ff] text-white font-bold rounded-lg hover:bg-[#3aa7ff]/90 transition-all duration-300 transform group-hover:translate-y-[-2px]"
                                >
                                    {tool.buttonText}
                                    <ExternalLink className="w-4 h-4 ml-2" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
