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
            className="p-2 md:p-3"
            style={{ border: '2px solid var(--theme-fg)' }}
            role="form"
            aria-label="Contact form"
        >

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 md:space-y-3">
                {/* Full Name */}
                <div>
                    <label 
                        htmlFor="full_name" 
                        className="block text-[10px] font-semibold mb-1 tracking-wide"
                    >
                        Full name <span className="text-red-500">*</span>
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
                            className="mt-1 text-xs font-medium"
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
                        className="block text-[10px] font-semibold mb-1 tracking-wide"
                    >
                        Email address <span className="text-red-500">*</span>
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
                            className="mt-1 text-xs font-medium"
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
                        className="block text-[10px] font-semibold mb-1 tracking-wide"
                    >
                        WhatsApp number
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
                            className="mt-1 text-xs font-medium"
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
                        className="block text-[10px] font-semibold mb-1 tracking-wide"
                    >
                        Message
                    </label>
                    <textarea
                        {...register('message')}
                        id="message"
                        rows={3}
                        className="visitor-input w-full resize-none text-xs"
                        placeholder="Tell me about your project or how we can collaborate..."
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="visitor-button w-full flex items-center justify-center gap-2 text-xs py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>Sending...</span>
                        </>
                    ) : (
                        <>
                            <Send size={14} />
                            <span>Send message</span>
                        </>
                    )}
                </button>

                <p className="text-[10px] text-center opacity-70">
                    Fields marked with <span className="text-red-500">*</span> are required
                </p>
            </form>
        </div>
    )
}
