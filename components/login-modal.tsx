import { useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "./auth-context"
import { useRouter } from "next/navigation"

export function LoginModal({ isOpen, onClose, onSwitchToSignup }: { isOpen: boolean; onClose: () => void; onSwitchToSignup: () => void }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [isResetting, setIsResetting] = useState(false)
    const { login, resetPassword, isLoading } = useAuth()
    const router = useRouter()

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccessMessage("")

        if (isResetting) {
            try {
                await resetPassword(email)
                setSuccessMessage("Password reset link sent! Check your email.")
            } catch (err: any) {
                console.error(err)
                setError("Failed to send reset link. Please check the email address.")
            }
            return
        }

        try {
            const success = await login(email, password)
            if (success) {
                onClose()
                router.refresh() // Refresh to update UI state
            } else {
                setError("Invalid email or password.")
            }
        } catch (err) {
            setError("An error occurred. Please try again.")
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#141414] border border-[#2a2a2a] w-full max-w-md rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {isResetting ? "Reset Password" : "Welcome Back"}
                    </h2>
                    <p className="text-gray-400 mb-6">
                        {isResetting ? "Enter your email to receive a reset link." : "Log in to your TyphoonHub account."}
                    </p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="bg-green-500/10 border border-green-500/20 text-green-500 text-sm p-3 rounded mb-4">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
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

                        {!isResetting && (
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
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 bg-[#3aa7ff] hover:bg-[#3aa7ff]/90 text-white font-semibold text-lg"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isResetting ? "Send Reset Link" : "Sign In")}
                        </Button>
                    </form>

                    <div className="mt-6 flex flex-col space-y-2 text-center text-sm text-gray-400">
                        {/* Toggle Reset Mode */}
                        <button
                            type="button"
                            onClick={() => {
                                setIsResetting(!isResetting)
                                setError("")
                                setSuccessMessage("")
                            }}
                            className="text-[#3aa7ff] hover:underline"
                        >
                            {isResetting ? "Back to Login" : "Forgot Password?"}
                        </button>

                        {!isResetting && (
                            <div>
                                Don't have an account?{" "}
                                <button onClick={onSwitchToSignup} className="text-white hover:underline font-medium">
                                    Sign up
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Click outside to close */}
            <div className="absolute inset-0 -z-10" onClick={onClose} />
        </div>
    )
}
