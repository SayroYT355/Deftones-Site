const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { promisify } = require('node:util');

const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 4173);
const dataDir = path.join(root, 'data');
const dataFile = path.join(dataDir, 'local-store.json');
const commentsFile = path.join(dataDir, 'comments.json');
const postsFile = path.join(dataDir, 'posts.json');
const scrypt = promisify(crypto.scrypt);
const sessions = new Map();
const SESSION_TTL = 7 * 24 * 60 * 60 * 1000;
const BODY_LIMIT = 80 * 1024;
let store = { users: [], comments: [], posts: [] };
let saveQueue = Promise.resolve();

const types = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.jfif': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

function json(response, status, payload, extraHeaders = {}) {
    response.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        ...extraHeaders
    });
    response.end(JSON.stringify(payload));
}

function readBody(request) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let size = 0;
        request.on('data', chunk => {
            size += chunk.length;
            if (size > BODY_LIMIT) {
                const error = new Error('El formulario es demasiado grande.');
                error.status = 413;
                reject(error);
                request.resume();
                return;
            }
            chunks.push(chunk);
        });
        request.on('end', () => {
            if (size > BODY_LIMIT) return;
            try {
                const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
                resolve(parsed);
            } catch {
                const error = new Error('El formato de la solicitud no es válido.');
                error.status = 400;
                reject(error);
            }
        });
        request.on('error', reject);
    });
}

function cookieValue(request, name) {
    const cookies = (request.headers.cookie || '').split(';');
    for (const cookie of cookies) {
        const separator = cookie.indexOf('=');
        if (separator < 0) continue;
        if (cookie.slice(0, separator).trim() === name) {
            return decodeURIComponent(cookie.slice(separator + 1).trim());
        }
    }
    return '';
}

function sessionUser(request) {
    const token = cookieValue(request, 'deftones_session');
    const session = sessions.get(token);
    if (!session) return null;
    if (session.expiresAt < Date.now()) {
        sessions.delete(token);
        return null;
    }
    return store.users.find(user => user.id === session.userId) || null;
}

function createSession(user, response) {
    const token = crypto.randomBytes(32).toString('base64url');
    sessions.set(token, { userId: user.id, expiresAt: Date.now() + SESSION_TTL });
    response.setHeader('Set-Cookie', `deftones_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${Math.floor(SESSION_TTL / 1000)}`);
}

async function writeJson(file, value) {
    const snapshot = JSON.stringify(value, null, 2);
    saveQueue = saveQueue.then(async () => {
        const temporaryFile = `${file}.tmp`;
        await fs.promises.writeFile(temporaryFile, snapshot, 'utf8');
        await fs.promises.rename(temporaryFile, file);
    });
    await saveQueue;
}

async function saveStore() {
    await writeJson(dataFile, { users: store.users });
}

async function saveComments() {
    await writeJson(commentsFile, { comments: store.comments });
}

async function savePosts() {
    await writeJson(postsFile, { posts: store.posts });
}

function normalizeUsername(value) {
    return String(value || '').normalize('NFKC').trim().toLocaleLowerCase('es');
}

async function handleApi(request, response, pathname) {
    if (request.method === 'GET' && pathname === '/api/session') {
        const user = sessionUser(request);
        json(response, 200, { user: user ? { id: user.id, username: user.username } : null });
        return true;
    }

    if (request.method === 'POST' && pathname === '/api/register') {
        try {
            const body = await readBody(request);
            const username = String(body.username || '').normalize('NFKC').trim();
            const password = String(body.password || '');
            if (!/^[\p{L}\p{N}_.-]{3,24}$/u.test(username)) {
                json(response, 400, { error: 'El usuario debe tener entre 3 y 24 caracteres (letras, números, punto, guion o guion bajo).' });
                return true;
            }
            if (password.length < 8 || password.length > 128) {
                json(response, 400, { error: 'La contraseña debe tener entre 8 y 128 caracteres.' });
                return true;
            }
            if (store.users.some(user => normalizeUsername(user.username) === normalizeUsername(username))) {
                json(response, 409, { error: 'Ese nombre de usuario ya está registrado.' });
                return true;
            }
            const salt = crypto.randomBytes(16).toString('hex');
            const passwordHash = (await scrypt(password, salt, 64)).toString('hex');
            if (store.users.some(user => normalizeUsername(user.username) === normalizeUsername(username))) {
                json(response, 409, { error: 'Ese nombre de usuario ya está registrado. Elegí otro.' });
                return true;
            }
            const user = { id: crypto.randomUUID(), username, salt, passwordHash, createdAt: new Date().toISOString() };
            store.users.push(user);
            await saveStore();
            createSession(user, response);
            json(response, 201, { user: { id: user.id, username: user.username } });
        } catch (error) {
            json(response, error.status || 500, { error: error.status ? error.message : 'No se pudo crear la cuenta.' });
        }
        return true;
    }

    if (request.method === 'POST' && pathname === '/api/login') {
        try {
            const body = await readBody(request);
            const username = String(body.username || '').normalize('NFKC').trim();
            const password = String(body.password || '');
            const user = store.users.find(candidate => normalizeUsername(candidate.username) === normalizeUsername(username));
            if (!user) {
                json(response, 401, { error: 'Usuario o contraseña incorrectos.' });
                return true;
            }
            const candidate = await scrypt(password, user.salt, 64);
            const stored = Buffer.from(user.passwordHash, 'hex');
            if (candidate.length !== stored.length || !crypto.timingSafeEqual(candidate, stored)) {
                json(response, 401, { error: 'Usuario o contraseña incorrectos.' });
                return true;
            }
            createSession(user, response);
            json(response, 200, { user: { id: user.id, username: user.username } });
        } catch (error) {
            json(response, error.status || 500, { error: error.status ? error.message : 'No se pudo iniciar sesión.' });
        }
        return true;
    }

    if (request.method === 'POST' && pathname === '/api/logout') {
        const token = cookieValue(request, 'deftones_session');
        sessions.delete(token);
        json(response, 200, { ok: true }, { 'Set-Cookie': 'deftones_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0' });
        return true;
    }

    if (request.method === 'GET' && pathname === '/api/comments') {
        const comments = [...store.comments].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        json(response, 200, { comments });
        return true;
    }

    if (request.method === 'POST' && pathname === '/api/comments') {
        const user = sessionUser(request);
        if (!user) {
            json(response, 401, { error: 'Iniciá sesión para publicar un comentario.' });
            return true;
        }
        try {
            const body = await readBody(request);
            const text = String(body.text || '').trim();
            if (text.length < 2 || text.length > 1000) {
                json(response, 400, { error: 'El comentario debe tener entre 2 y 1000 caracteres.' });
                return true;
            }
            const comment = {
                id: crypto.randomUUID(),
                userId: user.id,
                username: user.username,
                text,
                createdAt: new Date().toISOString()
            };
            store.comments.push(comment);
            await saveComments();
            json(response, 201, { comment });
        } catch (error) {
            json(response, error.status || 500, { error: error.status ? error.message : 'No se pudo guardar el comentario.' });
        }
        return true;
    }

    if (request.method === 'GET' && pathname === '/api/posts') {
        const posts = [...store.posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        json(response, 200, { posts });
        return true;
    }

    if (request.method === 'POST' && pathname === '/api/posts') {
        const user = sessionUser(request);
        if (!user) {
            json(response, 401, { error: 'Iniciá sesión para publicar tu blog.' });
            return true;
        }
        try {
            const body = await readBody(request);
            const title = String(body.title || '').trim();
            const text = String(body.text || '').trim();
            if (title.length < 4 || title.length > 120) {
                json(response, 400, { error: 'El título debe tener entre 4 y 120 caracteres.' });
                return true;
            }
            if (text.length < 20 || text.length > 10000) {
                json(response, 400, { error: 'La publicación debe tener entre 20 y 10.000 caracteres.' });
                return true;
            }
            const post = {
                id: crypto.randomUUID(),
                userId: user.id,
                username: user.username,
                title,
                text,
                createdAt: new Date().toISOString()
            };
            store.posts.push(post);
            await savePosts();
            json(response, 201, { post });
        } catch (error) {
            json(response, error.status || 500, { error: error.status ? error.message : 'No se pudo guardar la publicación.' });
        }
        return true;
    }

    if (pathname.startsWith('/api/')) {
        json(response, 404, { error: 'Ruta de API inexistente.' });
        return true;
    }
    return false;
}

async function serveStatic(request, response, pathname) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
        response.writeHead(405, { 'Allow': 'GET, HEAD' }).end();
        return;
    }
    if (pathname === '/') pathname = '/index.html';
    const file = path.resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(root + path.sep)) {
        response.writeHead(403).end('Forbidden');
        return;
    }
    try {
        const stat = await fs.promises.stat(file);
        if (!stat.isFile()) throw new Error('Not a file');
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
    } catch {
        response.writeHead(404).end('Not found');
    }
}

async function start() {
    await fs.promises.mkdir(dataDir, { recursive: true });
    let legacyComments = [];
    let hasUsersFile = true;
    try {
        const saved = JSON.parse(await fs.promises.readFile(dataFile, 'utf8'));
        store.users = Array.isArray(saved.users) ? saved.users : [];
        legacyComments = Array.isArray(saved.comments) ? saved.comments : [];
    } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        hasUsersFile = false;
    }
    try {
        const savedComments = JSON.parse(await fs.promises.readFile(commentsFile, 'utf8'));
        store.comments = Array.isArray(savedComments.comments) ? savedComments.comments : [];
    } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        store.comments = legacyComments;
        await saveComments();
    }
    try {
        const savedPosts = JSON.parse(await fs.promises.readFile(postsFile, 'utf8'));
        store.posts = Array.isArray(savedPosts.posts) ? savedPosts.posts : [];
    } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        store.posts = [];
        await savePosts();
    }
    if (!hasUsersFile) await saveStore();

    http.createServer(async (request, response) => {
        let pathname;
        try {
            pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
        } catch {
            response.writeHead(400).end('Bad request');
            return;
        }
        if (pathname.startsWith('/api/') && request.method !== 'GET' && request.method !== 'POST') {
            json(response, 405, { error: 'Método no permitido.' }, { Allow: 'GET, POST' });
            return;
        }
        if (await handleApi(request, response, pathname)) return;
        await serveStatic(request, response, pathname);
    }).listen(port, '127.0.0.1', () => {
        console.log(`Deftones site available at http://localhost:${port}/`);
        console.log('Local accounts are stored in data/local-store.json; shared comments are in data/comments.json.');
    });
}

start().catch(error => {
    console.error('Could not start Deftones site:', error);
    process.exitCode = 1;
});
