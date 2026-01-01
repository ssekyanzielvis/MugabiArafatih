'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogIn } from 'lucide-react'

export default function AdminLoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (signInError) throw signInError

            // Check if user is admin
            const { data: userData } = await supabase
                .from('users')
                .select('role')
                .eq('id', data.user.id)
                .single()

            if (userData?.role !== 'admin' && userData?.role !== 'editor') {
                await supabase.auth.signOut()
                throw new Error('Unauthorized: Admin access required')
            }

            router.push('/admin/dashboard')
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Failed to login')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white border-4 border-white p-10 shadow-[20px_20px_0_0_rgba(255,255,255,0.1)]">
                    {/* Logo */}
                    <div className="flex justify-center mb-10">
                        <div className="w-24 h-24 border-8 border-black flex items-center justify-center">
                            <span className="text-black font-black text-4xl italic tracking-tighter">MA</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl font-black text-center text-black mb-2 uppercase tracking-tighter">
                        Terminal Access
                    </h1>
                    <p className="text-center text-black opacity-60 mb-10 text-xs font-bold uppercase tracking-widest">
                        Administrative Protocol Required
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-8 p-4 border-2 border-red-600 bg-red-50">
                            <p className="text-red-600 text-xs font-bold uppercase tracking-tight">{error}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-8">
                        <div>
                            <label htmlFor="email" className="block text-xs font-black text-black mb-3 uppercase tracking-widest">
                                Identification (Email)
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-4 border-4 border-black text-black font-bold focus:outline-none focus:bg-black focus:text-white transition-all placeholder:opacity-30"
                                placeholder="ADMIN@CORE.SYSTEM"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-black text-black mb-3 uppercase tracking-widest">
                                Authorization Code
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-4 border-4 border-black text-black font-bold focus:outline-none focus:bg-black focus:text-white transition-all placeholder:opacity-30"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white font-black py-5 px-8 hover:bg-white hover:text-black border-4 border-black transition-all duration-300 flex items-center justify-center space-x-3 uppercase tracking-widest"
                        >
                            {loading ? (
                                <>
                                    <div className="w-6 h-6 border-4 border-white border-t-transparent animate-spin"></div>
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn size={24} />
                                    <span>Initialize Session</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-10 text-center border-t-2 border-black pt-6">
                        <a
                            href="/"
                            className="text-xs font-black text-black hover:opacity-50 transition-opacity uppercase tracking-widest"
                        >
                            ← Return to Public Portal
                        </a>
                    </div>
                </div>

                {/* Info */}
                <p className="text-center text-white opacity-40 text-[10px] font-bold mt-8 uppercase tracking-[0.2em]">
                    Encrypted Connection // Level 4 Authentication Active
                </p>
            </div>
        </div>
    )
}
