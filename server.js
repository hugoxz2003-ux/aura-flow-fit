const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3001;
const root = __dirname;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm',
    '.avif': 'image/avif',
    '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
    // Log request
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

    // Strip query parameters for file system operations
    const cleanUrl = req.url.split('?')[0];

    // Map root to aura.html if index.html is missing in root
    let url = cleanUrl === '/' ? '/aura.html' : cleanUrl;
    
    // Construct initial file path
    let filePath = path.join(root, url);

    // Basic security: stay within root
    const absoluteRoot = path.resolve(root);
    const absolutePath = path.resolve(filePath);
    
    if (!absolutePath.startsWith(absoluteRoot)) {
        res.statusCode = 403;
        res.end('Forbidden');
        return;
    }

    function serveFile(targetPath) {
        const extname = String(path.extname(targetPath)).toLowerCase();
        const contentType = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(targetPath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    res.statusCode = 404;
                    res.end('Not Found: ' + req.url);
                } else {
                    res.statusCode = 500;
                    res.end('Server Error: ' + error.code);
                }
            } else {
                res.writeHead(200, { 
                    'Content-Type': contentType,
                    'Cache-Control': 'no-cache'
                });
                res.end(content, 'utf-8');
            }
        });
    }

    // Check if path is a directory
    fs.stat(filePath, (err, stats) => {
        if (err) {
            // If file doesn't exist, try appending .html if no extension
            if (!path.extname(filePath)) {
                const htmlPath = filePath + '.html';
                fs.access(htmlPath, fs.constants.F_OK, (noHtml) => {
                    if (!noHtml) {
                        serveFile(htmlPath);
                    } else {
                        res.statusCode = 404;
                        res.end('Not Found');
                    }
                });
                return;
            }
            res.statusCode = 404;
            res.end('Not Found');
            return;
        }

        if (stats.isDirectory()) {
            // Try to serve index.html from directory
            const indexPath = path.join(filePath, 'index.html');
            fs.access(indexPath, fs.constants.F_OK, (noIndex) => {
                if (!noIndex) {
                    serveFile(indexPath);
                } else {
                    res.statusCode = 403;
                    res.end('Directory listing forbidden');
                }
            });
        } else {
            serveFile(filePath);
        }
    });
});

server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Please close the other process or use a different port.`);
    } else {
        console.error('Server error:', e);
    }
});

server.listen(port, () => {
    console.log(`========================================`);
    console.log(`CRM Aura Flow Fit Server`);
    console.log(`Running at http://localhost:${port}/`);
    console.log(`Root directory: ${root}`);
    console.log(`Press Ctrl+C to stop`);
    console.log(`========================================`);
});

