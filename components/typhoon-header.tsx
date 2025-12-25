"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, X, Bell, ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "./auth-context"
import { LoginModal } from "./login-modal"
import { SignupModal } from "./signup-modal"
import { SmartSearch } from "./smart-search"
import { UserProfileDropdown } from "./user-profile-dropdown"
import { usePathname } from "next/navigation"
import { TyphoonLogo } from "./typhoon-logo"

export default TyphoonHeader

function TyphoonHeader() {
    const [showLogin, setShowLogin] = useState(false)
    const [showSignup, setShowSignup] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [browseDropdownOpen, setBrowseDropdownOpen] = useState(false)
    const [notificationCount] = useState(3)
    const { user, logout } = useAuth()
    const pathname = usePathname()
    const browseRef = useRef<HTMLDivElement>(null)
    const mobileMenuRef = useRef<HTMLDivElement>(null)

    const isCreator = user?.userType === "creator"
    const uploadProgress = user?.creatorStats?.uploadProgress

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (browseRef.current && !browseRef.current.contains(event.target as Node)) {
                setBrowseDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSwitchToSignup = () => {
        setShowLogin(false)
        setShowSignup(true)
    }

    const handleSwitchToLogin = () => {
        setShowSignup(false)
        setShowLogin(true)
    }

    const closeMobileMenu = () => {
        setMobileMenuOpen(false)
    }

    const navLinks = [
        { name: "Home", href: "/" },
        {
            name: "Films",
            href: "/browse/films",
            subItems: [
                { name: "All Films", href: "/browse/films" },
                { name: "Rentals", href: "/browse/films/rentals" },
                { name: "Creator Films", href: "/browse/films/creator" },
            ]
        },
        { name: "Series", href: "/browse/series" }, // TV Shows -> Series
        { name: "Live TV", href: "/live" },
        { name: "Typhoonpod", href: "/typhoonhubpods" },
        { name: "Set Games", href: "/set-games" },
        { name: "Submit Film", href: "/submit" },
        { name: "Join Us", href: "/join-us" },
        // "Invest" removed as requested
    ]

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 bg-[#0f171e] text-white border-b border-white/10`}
                role="banner"
            >
                <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16">
                    <div className="flex items-center justify-between h-full gap-4">

                        {/* LEFT: Logo & Main Nav */}
                        <div className="flex items-center gap-8">
                            <a href="/" className="flex items-center gap-3 flex-shrink-0 group" aria-label="TyphoonHub Home">
                                <TyphoonLogo className="h-12 w-auto group-hover:scale-105 transition-transform duration-300" />
                                <span className="text-xl md:text-2xl font-black italic tracking-tighter text-white hidden sm:inline-block">
                                    TYPHOON<span className="text-[#3aa7ff]">HUB</span>
                                </span>
                            </a>

                            <nav className="hidden lg:flex items-center space-x-1" role="navigation" aria-label="Main navigation">
                                {navLinks.map((link) => {
                                    const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href))

                                    if (link.subItems) {
                                        return (
                                            <div key={link.name} className="relative group">
                                                <a
                                                    href={link.href}
                                                    className={`flex items-center gap-1 px-3 py-2 text-sm font-bold transition-colors duration-200 rounded-md ${isActive
                                                        ? "text-white bg-white/10"
                                                        : "text-gray-300 hover:text-white hover:bg-white/5"
                                                        }`}
                                                >
                                                    {link.name}
                                                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-white transition-transform duration-200 group-hover:rotate-180" />
                                                </a>

                                                {/* Dropdown Menu */}
                                                <div className="absolute left-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 ease-in-out w-48 z-50">
                                                    <div className="bg-[#19232d] border border-white/10 rounded-md shadow-xl overflow-hidden py-1">
                                                        {link.subItems.map((subItem) => (
                                                            <a
                                                                key={subItem.name}
                                                                href={subItem.href}
                                                                className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                                                            >
                                                                {subItem.name}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }

                                    return (
                                        <a
                                            key={link.name}
                                            href={link.href}
                                            className={`px-3 py-2 text-sm font-bold transition-colors duration-200 rounded-md ${isActive
                                                ? "text-white bg-white/10"
                                                : "text-gray-300 hover:text-white hover:bg-white/5"
                                                }`}
                                        >
                                            {link.name}
                                        </a>
                                    )
                                })}

                                {isCreator && (
                                    <a
                                        href="/creator-studio"
                                        className={`ml-2 px-3 py-2 text-sm font-bold text-[#3aa7ff] hover:text-white hover:bg-[#3aa7ff]/10 rounded-md transition-colors ${pathname === "/creator-studio" ? "bg-[#3aa7ff]/10" : ""
                                            }`}
                                    >
                                        Creator Studio
                                    </a>
                                )}
                            </nav>
                        </div>

                        {/* RIGHT: Search, Notifications, Profile */}
                        <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
                            <div className="hidden md:block w-full max-w-xs">
                                <SmartSearch />
                            </div>

                            {/* Mobile Search Toggle */}
                            <button
                                className="md:hidden p-2 text-gray-300 hover:text-white"
                                onClick={() => setMobileSearchOpen(true)}
                            >
                                <Search className="w-6 h-6" />
                            </button>

                            <button
                                className="hidden md:block relative p-2 text-gray-300 hover:text-white transition-colors"
                            >
                                <Bell className="w-5 h-5" />
                                {notificationCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#3aa7ff] rounded-full" />}
                            </button>

                            <div className="hidden md:flex items-center">
                                {user ? (
                                    <UserProfileDropdown user={user} onLogout={logout} />
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            className="text-gray-300 hover:text-white hover:bg-white/10 font-bold"
                                            onClick={() => setShowLogin(true)}
                                        >
                                            Sign In
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <button
                                className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                                aria-expanded={mobileMenuOpen}
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Search Overlay */}
            <SmartSearch isMobile={true} onClose={() => setMobileSearchOpen(false)} />

            {/* Mobile Menu */}
            <div
                className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            >
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeMobileMenu} />

                <div
                    ref={mobileMenuRef}
                    className={`absolute right-0 top-0 bottom-0 w-[280px] bg-[#19232d] shadow-2xl transform transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    <div className="flex flex-col h-full text-white">
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <span className="text-lg font-bold">Menu</span>
                            <button
                                onClick={closeMobileMenu}
                                className="p-2 text-gray-300 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <nav className="flex-1 overflow-y-auto py-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={closeMobileMenu}
                                    className={`block px-6 py-3 text-base font-semibold hover:bg-white/5 transition-colors ${pathname === link.href ? "text-[#3aa7ff] border-l-4 border-[#3aa7ff]" : "text-gray-300"
                                        }`}
                                >
                                    {link.name}
                                </a>
                            ))}

                            {isCreator && (
                                <a
                                    href="/creator-studio"
                                    onClick={closeMobileMenu}
                                    className="block px-6 py-3 text-base font-semibold text-[#3aa7ff] hover:bg-white/5"
                                >
                                    Creator Studio
                                </a>
                            )}
                        </nav>

                        <div className="p-4 border-t border-white/10">
                            {user ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 px-2">
                                        <div className="w-10 h-10 rounded-full bg-[#3aa7ff] flex items-center justify-center font-bold text-white">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold">{user.name}</div>
                                            <div className="text-xs text-gray-400">{user.email}</div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-white/5"
                                        onClick={() => {
                                            logout()
                                            closeMobileMenu()
                                        }}
                                    >
                                        Sign Out
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Button
                                        className="w-full bg-[#3aa7ff] hover:bg-[#3aa7ff]/90 text-white font-bold"
                                        onClick={() => {
                                            setShowLogin(true)
                                            closeMobileMenu()
                                        }}
                                    >
                                        Sign In
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full border-white/20 text-white hover:bg-white/10"
                                        onClick={() => {
                                            setShowSignup(true)
                                            closeMobileMenu()
                                        }}
                                    >
                                        Sign Up
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onSwitchToSignup={handleSwitchToSignup} />
            <SignupModal isOpen={showSignup} onClose={() => setShowSignup(false)} onSwitchToLogin={handleSwitchToLogin} />
        </>
    )
}

export { TyphoonHeader }
