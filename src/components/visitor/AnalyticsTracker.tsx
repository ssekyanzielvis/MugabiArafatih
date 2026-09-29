'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

interface AnalyticsPayload {
    visitorId: string
    pagePath: string
    referrer: string
    userAgent: string
    deviceType: 'Desktop' | 'Mobile' | 'Tablet'
    country: string | null
    city: string | null
    ipAddress: string | null
    sessionDuration: number
}

// Detect device type with enhanced accuracy
function getDeviceType(ua: string): 'Desktop' | 'Mobile' | 'Tablet' {
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return 'Tablet'
    }
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return 'Mobile'
    }
    return 'Desktop'
}

/**
 * Advanced Visitor Analytics Tracker
 * Captures: device type, location (IP geolocation), session duration, page views, referrer
 * Automatically tracks all visitor page views with detailed metrics
 */
export default function AnalyticsTracker() {
    const pathname = usePathname()
    const sessionStartTime = useRef<number | null>(null)
    const visitorId = useRef<string>('')
    const lastPagePath = useRef<string>('')
    const hasTrackedInitial = useRef<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [showError, setShowError] = useState<boolean>(false)

    useEffect(() => {
        if (!sessionStartTime.current) {
            sessionStartTime.current = Date.now()
        }

        // Generate or retrieve visitor ID on mount
        const getVisitorId = () => {
            let id = localStorage.getItem('visitor_id')
            if (!id) {
                id = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                localStorage.setItem('visitor_id', id)
            }
            return id
        }

        visitorId.current = getVisitorId()
        hasTrackedInitial.current = false
    }, [])

    useEffect(() => {
        if (!pathname) return

        // Avoid tracking the same page twice in a row
        if (pathname === lastPagePath.current && hasTrackedInitial.current) return
        lastPagePath.current = pathname
        hasTrackedInitial.current = true

        const trackPageView = async () => {
            let analyticsData: AnalyticsPayload | undefined = undefined
            try {
                // Get device information
                const userAgent = navigator.userAgent
                const deviceType = getDeviceType(userAgent)
                const referrer = document.referrer || 'direct'
                
                // Get approximate location using IP geolocation API with fallback
                let locationData: { country_name?: string; city?: string; ip?: string } | null = null
                try {
                    const geoResponse = await fetch('https://ipapi.co/json/', {
                        signal: AbortSignal.timeout(2500)
                    })
                    if (geoResponse.ok) {
                        locationData = await geoResponse.json()
                    }
                } catch {
                    // Fallback to ipwho.is if ipapi is blocked by ad-blocker / rate-limited
                    try {
                        const fallbackResponse = await fetch('https://ipwho.is/', {
                            signal: AbortSignal.timeout(2500)
                        })
                        if (fallbackResponse.ok) {
                            const data = await fallbackResponse.json()
                            if (data.success !== false) {
                                locationData = {
                                    country_name: data.country,
                                    city: data.city,
                                    ip: data.ip
                                }
                            }
                        }
                    } catch {
                        // Non-critical: location data optional
                    }
                }

                // Calculate session duration
                const start = sessionStartTime.current || Date.now()
                const sessionDuration = Math.floor((Date.now() - start) / 1000)

                // Prepare analytics data
                analyticsData = {
                    visitorId: visitorId.current,
                    pagePath: pathname,
                    referrer,
                    userAgent,
                    deviceType,
                    country: locationData?.country_name || null,
                    city: locationData?.city || null,
                    ipAddress: locationData?.ip || null,
                    sessionDuration,
                }

                console.log('📊 Tracking page view:', { 
                    page: pathname, 
                    device: deviceType,
                    location: locationData ? `${locationData.city}, ${locationData.country_name}` : 'Unknown'
                })

                // Send to analytics API
                const response = await fetch('/api/analytics', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(analyticsData),
                })

                if (!response.ok) {
                    const contentType = response.headers.get('content-type')
                    let responseMsg = `HTTP ${response.status}: ${response.statusText}`
                    try {
                        if (contentType?.includes('application/json')) {
                            const errorJson = await response.json()
                            responseMsg = errorJson.message || errorJson.error || responseMsg
                        } else {
                            const errorText = await response.text()
                            if (errorText) responseMsg = errorText
                        }
                    } catch {
                        // Ignore parse error
                    }
                    
                    console.error('❌ Analytics tracking failed:', responseMsg)
                    setErrorMessage(`Analytics Error: ${responseMsg}`)
                    setShowError(true)
                    setTimeout(() => setShowError(false), 10000)
                } else {
                    setShowError(false)
                }
            } catch (error: unknown) {
                const errorMsg = error instanceof Error ? error.message : 'Network or system error'
                console.error('❌ Analytics tracking error:', errorMsg)
                setErrorMessage(`Analytics Error: ${errorMsg}`)
                setShowError(true)
                setTimeout(() => setShowError(false), 10000)
            }
        }

        // Track immediately
        trackPageView()

        // Track when user leaves the page (session duration update)
        const handleBeforeUnload = () => {
            const start = sessionStartTime.current || Date.now()
            const sessionDuration = Math.floor((Date.now() - start) / 1000)
            
            // Use sendBeacon for reliable tracking on page unload
            const data = JSON.stringify({
                visitorId: visitorId.current,
                pagePath: pathname,
                sessionDuration,
                userAgent: navigator.userAgent,
                deviceType: getDeviceType(navigator.userAgent),
            })

            // sendBeacon is more reliable for page unload events
            if (navigator.sendBeacon) {
                navigator.sendBeacon('/api/analytics', data)
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [pathname])

    // Render error notification if tracking fails
    if (showError && errorMessage) {
        return (
            <div 
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    maxWidth: '400px',
                    backgroundColor: '#991b1b',
                    color: 'white',
                    padding: '16px 20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    zIndex: 9999,
                    fontSize: '14px',
                    border: '2px solid #ef4444',
                    animation: 'slideIn 0.3s ease-out'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>⚠️</span>
                        <span>Analytics Tracking Error</span>
                    </div>
                    <button 
                        onClick={() => setShowError(false)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '18px',
                            lineHeight: 1,
                            padding: '0 4px'
                        }}
                    >
                        ✕
                    </button>
                </div>
                <div style={{ fontSize: '13px', opacity: 0.95, lineHeight: 1.4 }}>
                    {errorMessage}
                </div>
                <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '6px' }}>
                    Check browser console for details. This does not affect site functionality.
                </div>
            </div>
        )
    }

    // Component doesn't render anything when working normally
    return null
}
