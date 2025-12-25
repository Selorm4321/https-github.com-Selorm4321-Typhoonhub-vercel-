const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

console.log('Checking Firebase Environment Variables...');
console.log(`Reading from: ${envPath}`);

try {
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const envVars = {};
        envContent.split('\n').forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                // Mask the value for security in logs, but indicate length/presence
                const value = parts.slice(1).join('=').trim();
                envVars[key] = value;
            }
        });

        const requiredKeys = [
            'NEXT_PUBLIC_FIREBASE_API_KEY',
            'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
            'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
            'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
            'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
            'NEXT_PUBLIC_FIREBASE_APP_ID'
        ];

        let missing = false;
        requiredKeys.forEach(key => {
            if (envVars[key]) {
                console.log(`[OK] ${key} is present (Length: ${envVars[key].length})`);
            } else {
                console.error(`[MISSING] ${key} is NOT found in .env.local`);
                missing = true;
            }
        });

        if (missing) {
            console.log('\n❌ Some required Firebase environment variables are missing.');
        } else {
            console.log('\n✅ All required Firebase environment variables seem to be present.');
        }

    } else {
        console.error(`\n❌ .env.local file not found at ${envPath}`);
    }
} catch (err) {
    console.error('\n❌ Error reading .env.local:', err);
}
