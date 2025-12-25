import { useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "./auth-context"
import { useRouter } from "next/navigation"

export function SignupModal({ isOpen, onClose, onSwitchToLogin }: { isOpen: boolean; onClose: () => void; onSwitchToLogin: () => void }) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isCreator, setIsCreator] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const { signup, isLoading } = useAuth()
    const router = useRouter()

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        try {
            const success = await signup(name, email, password, isCreator)
            if (success) {
                onClose()
                if (isCreator) {
                    router.push("/creator-onboarding/payment")
                } else {
                    router.push("/dashboard")
                }
            } else {
                setError("Failed to create account. Please try again.")
            }
        } catch (err: any) {
            console.error(err)
            let msg = "An error occurred. Please try again."
            if (err.code === 'auth/email-already-in-use') {
                msg = "This email is already in use."
            } else if (err.code === 'auth/weak-password') {
                msg = "Password should be at least 6 characters."
            } else if (err.code === 'auth/invalid-email') {
                msg = "Please enter a valid email address."
            } else if (err.message) {
                msg = err.message
            }
            setError(msg)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#141414] border border-[#2a2a2a] w-full max-w-md rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                    <p className="text-gray-400 mb-6">Join TyphoonHub to watch or create content.</p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-[#1a1a1a] border-[#2a2a2a] text-white h-12"
                                required
                            />
                        </div>
                        <div>
                            <Input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-[#1a1a1a] border-[#2a2a2a] text-white h-12"
                                required
                            />
                        </div>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-[#1a1a1a] border-[#2a2a2a] text-white h-12 pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <div className="flex items-center space-x-2 p-3 bg-[#1a1a1a] rounded border border-[#2a2a2a]">
                            <input
                                type="checkbox"
                                id="isCreator"
                                checked={isCreator}
                                onChange={(e) => setIsCreator(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-600 bg-[#2a2a2a] text-primary focus:ring-primary/50"
                            />
                            <label htmlFor="isCreator" className="text-sm text-gray-300 font-medium cursor-pointer">
                                Sign up as a Creator
                                <span className="block text-xs text-gray-500 font-normal">
                                    Sell films, earn from ads, and grow your audience
                                </span>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-[#E50914] hover:bg-[#c40812] text-white font-semibold text-lg"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        Already have an account?{" "}
                        <button onClick={onSwitchToLogin} className="text-white hover:underline font-medium">
                            Log in
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
