'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, type ContactFormData } from '@/lib/schemas/contact'
import { createClient } from '@/lib/supabase/client'
import { Send, Loader2 } from 'lucide-react'
import { showToast } from '@/components/ui/toaster'

export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    })

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true)

        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('contact_submissions')
                .insert([data])

            if (error) throw error

            showToast('success', 'Message sent successfully! I\'ll get back to you soon.')
            reset()
        } catch (error) {
            console.error('Error submitting form:', error)
            showToast('error', 'Failed to send message. Please try again or contact me directly.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div 
            className="visitor-card"
            role="form"
            aria-label="Contact form"
        >
            <h3 className="text-2xl md:text-3xl font-bold mb-8">Send Me a Message</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Full Name */}
                <div>
                    <label 
                        htmlFor="full_name" 
                        className="block text-sm font-semibold mb-3 uppercase tracking-wide"
                    >
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register('full_name')}
                        type="text"
                        id="full_name"
                        className="visitor-input w-full"
                        placeholder="John Doe"
                        aria-required="true"
                        aria-invalid={errors.full_name ? 'true' : 'false'}
                        aria-describedby={errors.full_name ? 'full_name-error' : undefined}
                    />
                    {errors.full_name && (
                        <p 
                            id="full_name-error" 
                            className="mt-2 text-sm font-medium"
                            role="alert"
                            style={{ color: 'var(--theme-fg)' }}
                        >
                            {errors.full_name.message}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label 
                        htmlFor="email" 
                        className="block text-sm font-semibold mb-3 uppercase tracking-wide"
                    >
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register('email')}
                        type="email"
                        id="email"
                        className="visitor-input w-full"
                        placeholder="john@example.com"
                        aria-required="true"
                        aria-invalid={errors.email ? 'true' : 'false'}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                        <p 
                            id="email-error" 
                            className="mt-2 text-sm font-medium"
                            role="alert"
                            style={{ color: 'var(--theme-fg)' }}
                        >
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* WhatsApp Number */}
                <div>
                    <label 
                        htmlFor="whatsapp_number" 
                        className="block text-sm font-semibold mb-3 uppercase tracking-wide"
                    >
                        WhatsApp Number
                    </label>
                    <input
                        {...register('whatsapp_number')}
                        type="tel"
                        id="whatsapp_number"
                        className="visitor-input w-full"
                        placeholder="+1234567890"
                        aria-invalid={errors.whatsapp_number ? 'true' : 'false'}
                        aria-describedby={errors.whatsapp_number ? 'whatsapp-error' : undefined}
                    />
                    {errors.whatsapp_number && (
                        <p 
                            id="whatsapp-error" 
                            className="mt-2 text-sm font-medium"
                            role="alert"
                            style={{ color: 'var(--theme-fg)' }}
                        >
                            {errors.whatsapp_number.message}
                        </p>
                    )}
                </div>

                {/* Message */}
                <div>
                    <label 
                        htmlFor="message" 
                        className="block text-sm font-semibold mb-3 uppercase tracking-wide"
                    >
                        Message
                    </label>
                    <textarea
                        {...register('message')}
                        id="message"
                        rows={5}
                        className="visitor-input w-full resize-none"
                        placeholder="Tell me about your project or how we can collaborate..."
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="visitor-button w-full flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 size={24} className="animate-spin" />
                            <span>Sending...</span>
                        </>
                    ) : (
                        <>
                            <Send size={24} />
                            <span>Send Message</span>
                        </>
                    )}
                </button>

                <p className="text-sm text-center opacity-70">
                    Fields marked with <span className="text-red-500">*</span> are required
                </p>
            </form>
        </div>
    )
}
                </div>

                {/* Message */}
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                        Message (Optional)
                    </label>
                    <textarea
                        {...register('message')}
                        id="message"
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        placeholder="Tell me about your project..."
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Sending...</span>
                        </>
                    ) : (
                        <>
                            <Send size={20} />
                            <span>Send Message</span>
                        </>
                    )}
                </button>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                    <div className="flex items-center space-x-2 text-green-400 bg-green-900/20 border border-green-700 rounded-lg p-4 animate-fadeIn">
                        <CheckCircle size={20} />
                        <span>Message sent successfully! I'll get back to you soon.</span>
                    </div>
                )}

                {submitStatus === 'error' && (
                    <div className="flex items-center space-x-2 text-red-400 bg-red-900/20 border border-red-700 rounded-lg p-4 animate-fadeIn">
                        <AlertCircle size={20} />
                        <span>Failed to send message. Please try again.</span>
                    </div>
                )}
            </form>
        </div>
    )
}
