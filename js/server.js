const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 4173);
const types = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.jfif': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

http.createServer((request, response) => {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
        response.writeHead(405, { 'Allow': 'GET, HEAD' }).end();
        return;
    }

    let pathname;
    try {
        pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    } catch {
        response.writeHead(400).end('Bad request');
        return;
    }

    if (pathname === '/') pathname = '/index.html';
    const file = path.resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(root + path.sep)) {
        response.writeHead(403).end('Forbidden');
        return;
    }

    fs.stat(file, (statError, stat) => {
        if (statError || !stat.isFile()) {
            response.writeHead(404).end('Not found');
            return;
        }
        const headers = {
            'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Cache-Control': 'no-store',
            'X-Content-Type-Options': 'nosniff',
            'Accept-Ranges': 'bytes'
        };

        const range = request.headers.range;
        if (range && path.extname(file).toLowerCase() === '.mp4') {
            const match = /^bytes=(\d*)-(\d*)$/.exec(range);
            if (!match) {
                response.writeHead(416, { 'Content-Range': `bytes */${stat.size}` }).end();
                return;
            }

            const start = match[1] ? Number(match[1]) : Math.max(0, stat.size - Number(match[2]));
            const end = match[1] && match[2] ? Math.min(Number(match[2]), stat.size - 1) : stat.size - 1;
            if (start >= stat.size || start > end) {
                response.writeHead(416, { 'Content-Range': `bytes */${stat.size}` }).end();
                return;
            }

            headers['Content-Range'] = `bytes ${start}-${end}/${stat.size}`;
            headers['Content-Length'] = end - start + 1;
            response.writeHead(206, headers);
            if (request.method === 'HEAD') response.end();
            else fs.createReadStream(file, { start, end }).pipe(response);
            return;
        }

        headers['Content-Length'] = stat.size;
        response.writeHead(200, headers);
        if (request.method === 'HEAD') response.end();
        else fs.createReadStream(file).pipe(response);
    });
}).listen(port, '127.0.0.1', () => {
    console.log(`Deftones site available at http://localhost:${port}/`);
});
