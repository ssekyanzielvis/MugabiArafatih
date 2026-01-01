// Test Supabase Connection and Database Setup
// Run this with: node scripts/test-supabase-connection.js

const fs = require('fs');
const path = require('path');

// Read .env.local file manually
let SUPABASE_URL = '';
let SUPABASE_ANON_KEY = '';

try {
    const envPath = path.join(__dirname, '..', '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    envContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=').trim();
        
        if (key.trim() === 'NEXT_PUBLIC_SUPABASE_URL') {
            SUPABASE_URL = value;
        } else if (key.trim() === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
            SUPABASE_ANON_KEY = value;
        }
    });
} catch (error) {
    console.log('Error reading .env.local file:', error.message);
}

console.log('='.repeat(60));
console.log('SUPABASE CONNECTION TEST');
console.log('='.repeat(60));
console.log('');

// Check environment variables
console.log('1. Checking Environment Variables:');
if (!SUPABASE_URL || SUPABASE_URL === 'your-project-url-here') {
    console.log('   ❌ NEXT_PUBLIC_SUPABASE_URL is not configured');
    console.log('   → Please add your Supabase URL to .env.local');
    console.log('');
    console.log('How to get your credentials:');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Go to Settings > API');
    console.log('4. Copy "Project URL" and "anon public" key');
    console.log('5. Add them to .env.local file');
    process.exit(1);
} else {
    console.log('   ✅ NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL);
}

if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === 'your-anon-key-here') {
    console.log('   ❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured');
    console.log('   → Please add your Supabase anon key to .env.local');
    process.exit(1);
} else {
    console.log('   ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY.substring(0, 20) + '...');
}

console.log('');

// Test connection
console.log('2. Testing Connection:');
fetch(`${SUPABASE_URL}/rest/v1/`, {
    headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
})
.then(response => {
    if (response.ok) {
        console.log('   ✅ Connected to Supabase successfully!');
        console.log('');
        return testTables();
    } else {
        console.log('   ❌ Failed to connect to Supabase');
        console.log('   Status:', response.status);
        console.log('   → Check if your URL and key are correct');
        process.exit(1);
    }
})
.catch(error => {
    console.log('   ❌ Connection error:', error.message);
    process.exit(1);
});

async function testTables() {
    console.log('3. Testing Database Tables:');
    
    const tables = ['home_content', 'kinsmen_content', 'collaborate_content', 'social_links'];
    
    for (const table of tables) {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=count`, {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Prefer': 'count=exact'
                }
            });
            
            if (response.ok) {
                const count = response.headers.get('content-range')?.split('/')[1] || '0';
                console.log(`   ✅ ${table}: ${count} rows`);
            } else if (response.status === 404) {
                console.log(`   ❌ ${table}: Table does not exist`);
            } else if (response.status === 401 || response.status === 403) {
                console.log(`   ⚠️  ${table}: RLS policy blocking (run supabase-setup.sql)`);
            } else {
                console.log(`   ❌ ${table}: Error ${response.status}`);
            }
        } catch (error) {
            console.log(`   ❌ ${table}: ${error.message}`);
        }
    }
    
    console.log('');
    console.log('='.repeat(60));
    console.log('NEXT STEPS:');
    console.log('='.repeat(60));
    console.log('');
    console.log('If tables do not exist or RLS is blocking:');
    console.log('1. Open Supabase Dashboard > SQL Editor');
    console.log('2. Create a new query');
    console.log('3. Copy entire supabase-setup.sql file');
    console.log('4. Paste and run the script');
    console.log('5. Run this test again: node scripts/test-supabase-connection.js');
    console.log('');
}
