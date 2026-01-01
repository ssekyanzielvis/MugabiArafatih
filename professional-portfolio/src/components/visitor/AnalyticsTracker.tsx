'use client'

import { useEffect, useRef } from 'react'
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
                        url: response.url
                    }
                    
                    try {
                        const errorJson = await response.json()
                        errorDetails = { ...errorDetails, ...errorJson }
                    } catch (jsonError) {
                        // If response isn't JSON, get text
                        try {
                            errorDetails.responseText = await response.text()
                        } catch (textError) {
                            errorDetails.parseError = 'Could not read response body'
                        }
                    }
                    
                    console.error('❌ Analytics tracking failed:', errorDetails)
                    console.error('📍 Failed tracking data:', analyticsData)
                } else {
                    console.log('✅ Page view tracked successfully')
                }
            } catch (error: any) {
                // Capture detailed error information
                console.error('❌ Analytics tracking error:', {
                    message: error?.message || 'Unknown error',
                    name: error?.name || 'Error',
                    stack: error?.stack,
                    error: error
                })
                console.error('📍 Failed tracking data:', analyticsData)
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

    // This component doesn't render anything
    return null
}
