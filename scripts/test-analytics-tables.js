// Test if analytics tables exist and check data
const SUPABASE_URL = 'https://bqlvprmmtmobobyygnba.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxbHZwcm1tdG1vYm9ieXlnbmJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyMDQzOTMsImV4cCI6MjA4Mjc4MDM5M30.855ipDTO8Ne97TIcqLe8o847PEs3jLFwfR6SV6Qassk'

async function testAnalyticsTables() {
    console.log('═══════════════════════════════════════════════════')
    console.log('  TESTING ANALYTICS TABLES')
    console.log('═══════════════════════════════════════════════════\n')

    try {
        // Test analytics table
        console.log('Testing analytics table...')
        const analyticsResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/analytics?select=*&limit=1`,
            {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                }
            }
        )

        if (!analyticsResponse.ok) {
            const error = await analyticsResponse.text()
            console.log('❌ Analytics table error:', analyticsResponse.status, error)
        } else {
            const data = await analyticsResponse.json()
            console.log('✅ Analytics table exists - Rows:', data.length)
        }

        // Test daily_visits table
        console.log('\nTesting daily_visits table...')
        const visitsResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/daily_visits?select=*&limit=1`,
            {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                }
            }
        )

        if (!visitsResponse.ok) {
            const error = await visitsResponse.text()
            console.log('❌ Daily visits table error:', visitsResponse.status, error)
        } else {
            const data = await visitsResponse.json()
            console.log('✅ Daily visits table exists - Rows:', data.length)
        }

        console.log('\n═══════════════════════════════════════════════════')
        console.log('  DIAGNOSIS')
        console.log('═══════════════════════════════════════════════════')
        
        if (!analyticsResponse.ok || !visitsResponse.ok) {
            console.log('\n⚠️  TABLES DO NOT EXIST OR HAVE PERMISSION ISSUES')
            console.log('\nREQUIRED ACTIONS:')
            console.log('1. Go to Supabase Dashboard: https://supabase.com/dashboard')
            console.log('2. Select your project: bqlvprmmtmobobyygnba')
            console.log('3. Click "SQL Editor" in the sidebar')
            console.log('4. Click "New Query"')
            console.log('5. Copy the ENTIRE content of supabase-setup.sql')
            console.log('6. Paste and click "Run"')
            console.log('7. Then run fix-rls-policies.sql the same way')
            console.log('8. Refresh your admin dashboard')
        } else {
            console.log('\n✅ Tables exist! The issue might be:')
            console.log('   - RLS policies blocking access')
            console.log('   - Run fix-rls-policies.sql to fix permissions')
        }

    } catch (error) {
        console.log('\n❌ CONNECTION ERROR:', error.message)
        console.log('\nPossible causes:')
        console.log('   - Check your internet connection')
        console.log('   - Verify Supabase project is active')
        console.log('   - Confirm credentials are correct')
    }
}

testAnalyticsTables()
