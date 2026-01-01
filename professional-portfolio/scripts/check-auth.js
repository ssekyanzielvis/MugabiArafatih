const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Basic .env parser
function parseEnv() {
    const envPath = path.join(__dirname, '../.env');
    if (!fs.existsSync(envPath)) {
        console.error('.env file not found');
        process.exit(1);
    }
    const content = fs.readFileSync(envPath, 'utf8');
    const config = {};
    content.split(/\r?\n/).forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join('=').trim().replace(/^["'](.*)["']$/, '$1');
            if (key) config[key] = value;
        }
    });
    return config;
}

async function run() {
    const config = parseEnv();
    const supabaseUrl = config.NEXT_PUBLIC_SUPABASE_URL || config.SUPABASE_URL;
    const supabaseServiceKey = config.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.log('Keys found in .env:', Object.keys(config));
        console.error('Missing Supabase configuration in .env');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // If "create" argument is passed, create an admin user
    if (process.argv.includes('create')) {
        const email = 'admin@core.system';
        const password = 'AdminPassword123!';

        console.log(`Attempting to create admin user: ${email}`);
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true
        });

        if (authError) {
            console.error('Error creating auth user:', authError.message);
        } else {
            console.log('Auth user created successfully:', authUser.user.id);

            // Create in public.users
            const { error: publicError } = await supabase
                .from('users')
                .upsert({
                    id: authUser.user.id,
                    email,
                    role: 'admin',
                    full_name: 'System Administrator'
                });

            if (publicError) {
                console.error('Error creating public user:', publicError.message);
            } else {
                console.log('Public user record created/updated.');
                console.log('\n--- CREDENTIALS ---');
                console.log(`Email: ${email}`);
                console.log(`Password: ${password}`);
                console.log('-------------------\n');
            }
        }
    }

    console.log('Checking for users in public.users...');
    const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*');

    if (usersError) {
        console.error('Error fetching users:', usersError);
        return;
    }

    if (users && users.length > 0) {
        console.log('Found users:');
        users.forEach(u => console.log(`- ${u.email} (${u.role})`));
    } else {
        console.log('No users found in public.users.');
    }

    console.log('\nChecking for users in auth.users...');
    const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
        console.error('Error fetching auth users:', authError);
    } else {
        if (authUsers && authUsers.length > 0) {
            console.log('Found auth users:');
            authUsers.forEach(u => console.log(`- ${u.email} (ID: ${u.id})`));
        } else {
            console.log('No users found in auth.users.');
        }
    }
}

run();
