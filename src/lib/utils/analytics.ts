export interface AnalyticsData {
    date: string
    visits: number
    unique: number
}

export interface PredictionData {
    date: string
    predicted: number
}

/**
 * Calculate linear regression for trend prediction
 */
export function calculateLinearRegression(data: AnalyticsData[]): { slope: number; intercept: number } {
    const n = data.length
    if (n === 0) return { slope: 0, intercept: 0 }

    let sumX = 0
    let sumY = 0
    let sumXY = 0
    let sumXX = 0

    data.forEach((point, index) => {
        const x = index
        const y = point.visits
        sumX += x
        sumY += y
        sumXY += x * y
        sumXX += x * x
    })

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    return { slope, intercept }
}

/**
 * Predict future visits based on historical data
 */
export function predictFutureVisits(historicalData: AnalyticsData[], daysToPredict: number = 7): PredictionData[] {
    const { slope, intercept } = calculateLinearRegression(historicalData)
    const predictions: PredictionData[] = []
    const startIndex = historicalData.length

    for (let i = 0; i < daysToPredict; i++) {
        const x = startIndex + i
        const predicted = Math.max(0, Math.round(slope * x + intercept))

        const futureDate = new Date()
        futureDate.setDate(futureDate.getDate() + i + 1)

        predictions.push({
            date: futureDate.toISOString().split('T')[0],
            predicted
        })
    }

    return predictions
}

/**
 * Calculate growth rate
 */
export function calculateGrowthRate(current: number, previous: number): number {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
}

/**
 * Detect device type from user agent
 */
export function detectDeviceType(userAgent: string): string {
    const ua = userAgent.toLowerCase()

    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return 'Tablet'
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return 'Mobile'
    }
    return 'Desktop'
}

/**
 * Track page view
 */
export async function trackPageView(pagePath: string, supabase: any) {
    try {
        const visitorId = getOrCreateVisitorId()
        const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : ''
        const deviceType = detectDeviceType(userAgent)

        await supabase.from('analytics').insert({
            visitor_id: visitorId,
            page_path: pagePath,
            referrer: typeof document !== 'undefined' ? document.referrer : '',
            user_agent: userAgent,
            device_type: deviceType,
        })
    } catch (error) {
        console.error('Error tracking page view:', error)
    }
}

/**
 * Get or create visitor ID (stored in localStorage)
 */
function getOrCreateVisitorId(): string {
    if (typeof window === 'undefined') return 'server'

    let visitorId = localStorage.getItem('visitor_id')

    if (!visitorId) {
        visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem('visitor_id', visitorId)
    }

    return visitorId
}
