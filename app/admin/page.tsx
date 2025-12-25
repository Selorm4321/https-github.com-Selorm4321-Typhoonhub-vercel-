"use client"

import { useState, useEffect } from "react"
import { Check, X, Eye, ShieldAlert, Film, Search, LayoutDashboard, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, doc, updateDoc, orderBy, type Timestamp } from "firebase/firestore"
import { AdminGuard } from "@/components/admin-guard"

interface VideoContent {
    id: string
    title: string
    creatorName: string
    createdAt: Timestamp
    genre: string
    status: "pending" | "active" | "rejected"
    thumbnailUrl: string
    videoPath: string
    description?: string
    creatorPaypal?: string
    // ... other fields
}

interface Transaction {
    id: string
    date: Timestamp
    userEmail: string
    amount: number
    type: string
    recipient: string
    status: string
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<"approvals" | "transactions">("approvals")
    const [content, setContent] = useState<VideoContent[]>([])
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    // Fetch Content
    useEffect(() => {
        const fetchContent = async () => {
            setIsLoading(true)
            try {
                if (activeTab === "approvals") {
                    const q = query(
                        collection(db, "videos"),
                        where("status", "==", "pending")
                    )
                    const snapshot = await getDocs(q)
                    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as VideoContent))
                    setContent(data)
                } else {
                    const q = query(
                        collection(db, "transactions"),
                        // orderBy("date", "desc") // Limit or order
                    )
                    const snapshot = await getDocs(q)
                    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Transaction))
                    setTransactions(data)
                }
            } catch (error) {
                console.error("Error fetching admin data:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchContent()
    }, [activeTab])

    const handleApprove = async (id: string) => {
        try {
            await updateDoc(doc(db, "videos", id), {
                status: "active"
            })
            setContent(prev => prev.filter(item => item.id !== id))
            // alert(`Content ${id} Approved!`) 
        } catch (error) {
            console.error("Error approving content:", error)
            alert("Failed to approve content")
        }
    }

    const handleReject = async (id: string) => {
        const reason = prompt("Enter rejection reason:")
        if (reason) {
            try {
                await updateDoc(doc(db, "videos", id), {
                    status: "rejected",
                    rejectionReason: reason
                })
                setContent(prev => prev.filter(item => item.id !== id))
            } catch (error) {
                console.error("Error rejecting content:", error)
                alert("Failed to reject content")
            }
        }
    }

    return (
        <AdminGuard>
            <div className="min-h-screen bg-black text-gray-100 flex flex-col md:flex-row">

                {/* Sidebar Navigation */}
                <aside className="w-full md:w-64 bg-[#0a0a0a] border-b md:border-r border-[#2a2a2a] flex flex-col">
                    <div className="p-6 border-b border-[#2a2a2a]">
                        <div className="flex items-center gap-2 text-[#E50914]">
                            <ShieldAlert className="w-6 h-6" />
                            <span className="font-bold text-lg tracking-wider">ADMIN</span>
                        </div>
                    </div>
                    <nav className="flex-1 p-4 space-y-1">
                        <button
                            onClick={() => setActiveTab("approvals")}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "approvals"
                                ? "bg-[#E50914]/10 text-[#E50914] font-medium"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            Approvals
                            {activeTab === 'approvals' && content.length > 0 && <span className="ml-auto bg-[#E50914] text-white text-xs px-2 py-0.5 rounded-full">{content.length}</span>}
                        </button>

                        <button
                            onClick={() => setActiveTab("transactions")}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "transactions"
                                ? "bg-[#E50914]/10 text-[#E50914] font-medium"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <Receipt className="w-5 h-5" />
                            Transactions
                        </button>
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl font-bold">
                            {activeTab === "approvals" ? "Content Approvals" : "Transaction Ledger"}
                        </h1>
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <Input
                                placeholder={activeTab === "approvals" ? "Search content..." : "Search transactions..."}
                                className="pl-9 bg-[#141414] border-[#2a2a2a]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-20">
                            <p className="text-gray-500">Loading data...</p>
                        </div>
                    ) : (
                        <>
                            {/* APPROVALS VIEW */}
                            {activeTab === "approvals" && (
                                content.length === 0 ? (
                                    <div className="text-center py-20 bg-[#141414] border border-[#2a2a2a] rounded-xl border-dashed">
                                        <Film className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                                        <h3 className="text-xl font-medium text-gray-400">No pending content</h3>
                                        <p className="text-gray-600 mt-2">All submissions have been reviewed.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-6">
                                        {content.map((item) => (
                                            <div key={item.id} className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6 hover:border-gray-700 transition-colors">
                                                <div className="w-full md:w-64 aspect-video bg-gray-900 rounded-lg flex-shrink-0 relative overflow-hidden group cursor-pointer">
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Eye className="w-8 h-8 text-white" />
                                                    </div>
                                                    <div className="flex items-center justify-center h-full text-gray-700">
                                                        <Film className="w-8 h-8" />
                                                    </div>
                                                    {/* <span className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-xs font-medium">
                                                    {item.duration}
                                                </span> */}
                                                </div>

                                                <div className="flex-1 min-w-0 space-y-2">
                                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                                            {item.genre}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            Uploaded {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-xl font-bold truncate">{item.title}</h3>
                                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                                        <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-xs">
                                                            {item.creatorName?.charAt(0) || "U"}
                                                        </div>
                                                        <span>{item.creatorName || "Unknown Creator"}</span>
                                                        {item.creatorPaypal && (
                                                            <span className="text-xs text-[#3aa7ff] bg-[#3aa7ff]/10 px-2 py-0.5 rounded border border-[#3aa7ff]/20">
                                                                PayPal: {item.creatorPaypal}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
                                                    <Button
                                                        className="flex-1 md:w-32 bg-green-600 hover:bg-green-700 text-white"
                                                        onClick={() => handleApprove(item.id)}
                                                    >
                                                        <Check className="w-4 h-4 mr-2" />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        className="flex-1 md:w-32"
                                                        onClick={() => handleReject(item.id)}
                                                    >
                                                        <X className="w-4 h-4 mr-2" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            )}

                            {/* TRANSACTIONS VIEW */}
                            {activeTab === "transactions" && (
                                <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm text-gray-400">
                                            <thead className="bg-[#0a0a0a] text-gray-200">
                                                <tr>
                                                    <th className="px-6 py-4 font-medium">Date</th>
                                                    <th className="px-6 py-4 font-medium">User</th>
                                                    <th className="px-6 py-4 font-medium">Type</th>
                                                    <th className="px-6 py-4 font-medium">Recipient</th>
                                                    <th className="px-6 py-4 font-medium text-right">Amount</th>
                                                    <th className="px-6 py-4 font-medium text-right">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#2a2a2a]">
                                                {transactions.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                                            No transactions found.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    transactions.map((txn) => (
                                                        <tr key={txn.id} className="hover:bg-white/5 transition-colors">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                {txn.date ? new Date(txn.date.seconds * 1000).toLocaleDateString() : 'N/A'}
                                                            </td>
                                                            <td className="px-6 py-4">{txn.userEmail}</td>
                                                            <td className="px-6 py-4 text-white font-medium">{txn.type}</td>
                                                            <td className="px-6 py-4 flex items-center gap-2">
                                                                {txn.recipient.includes("Platform") ? (
                                                                    <span className="text-[#E50914] font-medium">Platform</span>
                                                                ) : (
                                                                    <span className="text-blue-400">{txn.recipient}</span>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 text-right font-medium text-white">
                                                                ${txn.amount.toFixed(2)}
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                                                                    {txn.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                </main>
            </div >
        </AdminGuard>
    )
}
