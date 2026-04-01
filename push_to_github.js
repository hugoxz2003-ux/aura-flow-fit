const fs = require('fs');
const https = require('https');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const OWNER = 'hugoxz2003-ux';
const REPO = 'aura-flow-fit';
const BRANCH = 'main';

const FILES_TO_PUSH = [
    'vercel.json',
    'dashboard/index.html',
    'dashboard/dashboard.js',
    'client-app/client.js',
    'client-app/index.html',
    'client-app/client.css',
    'supabase-config.js',
    'SEED_DEMO_DATA.sql',
    'EXTRAS_SYNC.sql'
];

async function githubRequest(method, path, body) {
    return new Promise((resolve, reject) => {
        const data = body ? JSON.stringify(body) : '';
        const options = {
            hostname: 'api.github.com',
            path: `/repos/${OWNER}/${REPO}/contents/${path}`,
            method: method,
            headers: {
                'User-Agent': 'AuraFlowFit-deploy',
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };
        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', chunk => responseData += chunk);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, body: JSON.parse(responseData) }); }
                catch(e) { resolve({ status: res.statusCode, body: responseData }); }
            });
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

async function getFileSHA(filePath) {
    const res = await githubRequest('GET', filePath, null);
    if (res.status === 200) return res.body.sha;
    return null;
}

async function pushFile(filePath) {
    let content;
    try {
        content = fs.readFileSync(filePath, 'utf8');
    } catch(e) {
        console.log(`SKIP ${filePath}: file not found`);
        return;
    }
    
    const encoded = Buffer.from(content, 'utf8').toString('base64');
    const sha = await getFileSHA(filePath);
    
    const body = {
        message: `[auto] Update ${filePath} - Vercel deploy + responsive + demo data`,
        content: encoded,
        branch: BRANCH
    };
    if (sha) body.sha = sha;
    
    const res = await githubRequest('PUT', filePath, body);
    if (res.status === 200 || res.status === 201) {
        console.log(`✅ ${filePath}`);
    } else {
        console.log(`❌ ${filePath}: ${res.status} - ${JSON.stringify(res.body).substring(0, 200)}`);
    }
}

async function main() {
    console.log('Pushing files to GitHub...\n');
    for (const file of FILES_TO_PUSH) {
        await pushFile(file);
        await new Promise(r => setTimeout(r, 500)); // Rate limit
    }
    console.log('\nDone!');
}

main().catch(console.error);
