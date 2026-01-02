'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Advanced Visitor Analytics Tracker
 * Captures: device type, location (IP geolocation), session duration, page views, referrer
 * Automatically tracks all visitor page views with detailed metrics
 */
export default function AnalyticsTracker() {
    const pathname = usePathname()
    const sessionStartTime = useRef<number>(Date.now())
    const visitorId = useRef<string>('')
    const lastPagePath = useRef<string>('')
    const hasTrackedInitial = useRef<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [showError, setShowError] = useState<boolean>(false)

    useEffect(() => {
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
            // Declare analyticsData so it's accessible in both try and catch blocks
            let analyticsData: any = undefined;
            try {
                // Get device information
                const userAgent = navigator.userAgent
                const deviceType = getDeviceType(userAgent)
                const referrer = document.referrer || 'direct'
                
                // Get approximate location using IP geolocation API
                let locationData: any = null
                try {
                    const geoResponse = await fetch('https://ipapi.co/json/', {
                        signal: AbortSignal.timeout(3000) // 3 second timeout
                    })
                    if (geoResponse.ok) {
                        locationData = await geoResponse.json()
                    }
                } catch (geoError) {
                    console.warn('Geolocation fetch failed (non-critical):', geoError)
                }

                // Calculate session duration
                const sessionDuration = Math.floor((Date.now() - sessionStartTime.current) / 1000)

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
                    let errorDetails: any = {
                        status: response.status,
                        statusText: response.statusText,
                        url: response.url,
                        headers: {
                            contentType: response.headers.get('content-type')
                        }
                    }
                    
                    // Try to parse error response
                    const contentType = response.headers.get('content-type')
                    try {
                        if (contentType?.includes('application/json')) {
                            const errorJson = await response.json()
                            errorDetails = { ...errorDetails, ...errorJson }
                        } else {
                            const errorText = await response.text()
                            errorDetails.responseText = errorText
                        }
                    } catch (parseError: any) {
                        errorDetails.parseError = parseError?.message || 'Could not read response'
                    }
                    
                    console.error('❌ Analytics tracking failed:', errorDetails)
                    console.error('📍 Failed tracking data:', analyticsData)
                    
                    // Show visible error message
                    const errorMsg = errorDetails.message 
                        || errorDetails.error 
                        || errorDetails.responseText 
                        || `HTTP ${response.status}: ${response.statusText}`
                    
                    setErrorMessage(`Analytics Error: ${errorMsg}`)
                    setShowError(true)
                    setTimeout(() => setShowError(false), 10000) // Hide after 10 seconds
                } else {
                    console.log('✅ Page view tracked successfully')
                    setShowError(false)
                }
            } catch (error: any) {
                // Capture detailed error information
                const errorInfo = {
                    message: error?.message || 'Unknown error',
                    name: error?.name || 'Error',
                    stack: error?.stack,
                    cause: error?.cause,
                    type: typeof error,
                    error: error
                }
                
                console.error('❌ Analytics tracking error:', errorInfo)
                console.error('📍 Failed tracking data:', analyticsData)
                
                // Show visible error message
                const errorMsg = error?.message || 'Network or system error'
                setErrorMessage(`Analytics Error: ${errorMsg}`)
                setShowError(true)
                setTimeout(() => setShowError(false), 10000) // Hide after 10 seconds
            }
        }

        // Track immediately
        trackPageView()

        // Track when user leaves the page (session duration update)
        const handleBeforeUnload = () => {
            const sessionDuration = Math.floor((Date.now() - sessionStartTime.current) / 1000)
            
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

    // Detect device type with enhanced accuracy
    const getDeviceType = (ua: string): 'Desktop' | 'Mobile' | 'Tablet' => {
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return 'Tablet'
        }
        if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return 'Mobile'
        }
        return 'Desktop'
    }

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
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    border: '2px solid #dc2626',
                    animation: 'slideIn 0.3s ease-out'
                }}
            >
                <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>
                    ⚠️ Analytics Tracking Error
                </div>
                <div style={{ marginBottom: '12px', lineHeight: '1.5' }}>
                    {errorMessage}
                </div>
                <div style={{ 
                    fontSize: '12px', 
                    opacity: 0.9,
                    borderTop: '1px solid rgba(255,255,255,0.3)',
                    paddingTop: '8px',
                    marginTop: '8px'
                }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Troubleshooting:</div>
                    <div>1. Check browser console (F12) for details</div>
                    <div>2. Verify database setup in Supabase</div>
                    <div>3. Run supabase-setup.sql script</div>
                </div>
                <button
                    onClick={() => setShowError(false)}
                    style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        fontSize: '20px',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        lineHeight: '1'
                    }}
                >
                    ×
                </button>
            </div>
        )
    }

    return null
}
