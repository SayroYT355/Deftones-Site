<?php
declare(strict_types=1);

const DATA_DIR = __DIR__ . DIRECTORY_SEPARATOR . 'data';
const USERS_FILE = DATA_DIR . DIRECTORY_SEPARATOR . 'local-store.json';
const COMMENTS_FILE = DATA_DIR . DIRECTORY_SEPARATOR . 'comments.json';
const POSTS_FILE = DATA_DIR . DIRECTORY_SEPARATOR . 'posts.json';
const BODY_LIMIT = 81920;

function respond(int $status, array $payload): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
function body(): array {
    $contentType = strtolower((string)($_SERVER['CONTENT_TYPE'] ?? ''));
    if (str_starts_with($contentType, 'application/x-www-form-urlencoded') || str_starts_with($contentType, 'multipart/form-data')) {
        return $_POST;
    }
    if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > BODY_LIMIT) respond(413, ['error' => 'El formulario es demasiado grande.']);
    $raw = file_get_contents('php://input', false, null, 0, BODY_LIMIT + 1);
    if ($raw === false || strlen($raw) > BODY_LIMIT) respond(413, ['error' => 'El formulario es demasiado grande.']);
    $data = json_decode($raw ?: '{}', true);
    if (!is_array($data) || json_last_error() !== JSON_ERROR_NONE) respond(400, ['error' => 'El formato de la solicitud no es válido.']);
    return $data;
}
function finishAuth(int $status, array $user): never {
    if (str_starts_with(strtolower((string)($_SERVER['CONTENT_TYPE'] ?? '')), 'application/x-www-form-urlencoded')) {
        header('Location: /html/blog.php', true, 303);
        exit;
    }
    respond($status, ['user' => safeUser($user)]);
}
function readRows(string $file, string $key): array {
    if (!is_file($file)) return [];
    $h = fopen($file, 'rb');
    if (!$h) throw new RuntimeException('No se pudo leer un archivo de datos.');
    flock($h, LOCK_SH);
    $raw = stream_get_contents($h);
    flock($h, LOCK_UN);
    fclose($h);
    $json = json_decode($raw ?: '{}', true);
    if (!is_array($json) || json_last_error() !== JSON_ERROR_NONE) throw new RuntimeException('Un archivo de datos contiene JSON inválido.');
    return is_array($json[$key] ?? null) ? $json[$key] : [];
}
function writeRows(string $file, string $key, array $rows): void {
    if (!is_dir(DATA_DIR)) mkdir(DATA_DIR, 0777, true);
    $h = fopen($file, 'c+b');
    if (!$h) throw new RuntimeException('No se pudo abrir un archivo para guardar datos.');
    flock($h, LOCK_EX);
    $json = json_encode([$key => array_values($rows)], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) { flock($h, LOCK_UN); fclose($h); throw new RuntimeException('No se pudieron codificar los datos.'); }
    rewind($h); ftruncate($h, 0); fwrite($h, $json . PHP_EOL); fflush($h);
    flock($h, LOCK_UN); fclose($h);
}
function usernameKey(string $name): string {
    if (class_exists('Normalizer')) {
        $n = Normalizer::normalize($name, Normalizer::FORM_KC);
        if (is_string($n)) $name = $n;
    }
    return function_exists('mb_strtolower') ? mb_strtolower(trim($name), 'UTF-8') : strtolower(trim($name));
}
function lengthOf(string $value): int { return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value); }
function startSession(): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    session_name('deftones_php_session');
    ini_set('session.gc_maxlifetime', '604800');
    session_set_cookie_params(['lifetime'=>604800, 'path'=>'/', 'secure'=>false, 'httponly'=>true, 'samesite'=>'Lax']);
    session_start();
}
function getUser(array $users): ?array {
    $id = (string)($_SESSION['user_id'] ?? '');
    foreach ($users as $u) if (is_array($u) && isset($u['id']) && hash_equals((string)$u['id'], $id)) return $u;
    return null;
}
function safeUser(?array $user): ?array { return $user ? ['id'=>$user['id'], 'username'=>$user['username']] : null; }
function verifyStoredPassword(array $user, string $password): ?bool {
    $stored = (string)($user['passwordHash'] ?? '');
    if (str_starts_with($stored, '$')) return password_verify($password, $stored);
    // Accounts from the Node version stored a 64-byte scrypt key and a 32-character salt string.
    if (preg_match('/^[a-f0-9]{128}$/i', $stored) && strlen((string)($user['salt'] ?? '')) === 32) {
        if (!function_exists('sodium_crypto_pwhash_scryptsalsa208sha256')) return null;
        $derived = sodium_crypto_pwhash_scryptsalsa208sha256(
            64,
            $password,
            (string)$user['salt'],
            SODIUM_CRYPTO_PWHASH_SCRYPTSALSA208SHA256_OPSLIMIT_INTERACTIVE,
            SODIUM_CRYPTO_PWHASH_SCRYPTSALSA208SHA256_MEMLIMIT_INTERACTIVE
        );
        return hash_equals(hex2bin($stored), $derived);
    }
    return false;
}

function api(string $path): void {
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if (!in_array($method, ['GET','POST'], true)) { header('Allow: GET, POST'); respond(405,['error'=>'Método no permitido.']); }
    startSession();
    $users = readRows(USERS_FILE, 'users');

    if ($path === '/api/session' && $method === 'GET') respond(200,['user'=>safeUser(getUser($users))]);

    if ($path === '/api/register' && $method === 'POST') {
        $in = body(); $name = trim((string)($in['username'] ?? '')); $pass = (string)($in['password'] ?? '');
        if (!preg_match('/^[\p{L}\p{N}_.-]{3,24}$/u',$name)) respond(400,['error'=>'El usuario debe tener entre 3 y 24 caracteres (letras, números, punto, guion o guion bajo).']);
        if (lengthOf($pass)<8 || lengthOf($pass)>128) respond(400,['error'=>'La contraseña debe tener entre 8 y 128 caracteres.']);
        foreach ($users as $u) if (usernameKey((string)($u['username'] ?? ''))===usernameKey($name)) respond(409,['error'=>'Ese nombre de usuario ya está registrado.']);
        $user=['id'=>bin2hex(random_bytes(16)),'username'=>$name,'passwordHash'=>password_hash($pass,PASSWORD_DEFAULT),'createdAt'=>gmdate('c')];
        $users[]=$user; writeRows(USERS_FILE,'users',$users); session_regenerate_id(true); $_SESSION['user_id']=$user['id'];
        finishAuth(201,$user);
    }
    if ($path === '/api/login' && $method === 'POST') {
        $in=body(); $name=trim((string)($in['username'] ?? '')); $pass=(string)($in['password'] ?? ''); $user=null;
        foreach($users as $u) if(is_array($u) && usernameKey((string)($u['username'] ?? ''))===usernameKey($name)) { $user=$u; break; }
        $verified = $user ? verifyStoredPassword($user, $pass) : false;
        if ($verified === null) respond(503,['error'=>'Para validar cuentas anteriores activá la extensión sodium de PHP.']);
        if (!$user || !$verified) respond(401,['error'=>'Usuario o contraseña incorrectos.']);
        if (!str_starts_with((string)$user['passwordHash'], '$')) {
            foreach ($users as &$savedUser) {
                if (($savedUser['id'] ?? null) === $user['id']) {
                    $savedUser['passwordHash'] = password_hash($pass, PASSWORD_DEFAULT);
                    unset($savedUser['salt']);
                    $user = $savedUser;
                    break;
                }
            }
            unset($savedUser);
            writeRows(USERS_FILE, 'users', $users);
        }
        session_regenerate_id(true); $_SESSION['user_id']=$user['id']; finishAuth(200,$user);
    }
    if ($path === '/api/logout' && $method === 'POST') {
        $_SESSION=[];
        if (ini_get('session.use_cookies')) { $p=session_get_cookie_params(); setcookie(session_name(),'', ['expires'=>time()-42000,'path'=>$p['path'],'secure'=>$p['secure'],'httponly'=>$p['httponly'],'samesite'=>$p['samesite'] ?? 'Lax']); }
        session_destroy(); respond(200,['ok'=>true]);
    }
    if ($path === '/api/comments' && $method === 'GET') {
        $rows=readRows(COMMENTS_FILE,'comments'); usort($rows,static fn($a,$b)=>strcmp((string)($b['createdAt']??''),(string)($a['createdAt']??''))); respond(200,['comments'=>$rows]);
    }
    if ($path === '/api/comments' && $method === 'POST') {
        $user=getUser($users); if(!$user) respond(401,['error'=>'Iniciá sesión para publicar un comentario.']);
        $in=body(); $text=trim((string)($in['text']??'')); if(lengthOf($text)<2||lengthOf($text)>1000) respond(400,['error'=>'El comentario debe tener entre 2 y 1000 caracteres.']);
        $rows=readRows(COMMENTS_FILE,'comments'); $item=['id'=>bin2hex(random_bytes(16)),'userId'=>$user['id'],'username'=>$user['username'],'text'=>$text,'createdAt'=>gmdate('c')]; $rows[]=$item; writeRows(COMMENTS_FILE,'comments',$rows); respond(201,['comment'=>$item]);
    }
    if ($path === '/api/posts' && $method === 'GET') {
        $rows=readRows(POSTS_FILE,'posts'); usort($rows,static fn($a,$b)=>strcmp((string)($b['createdAt']??''),(string)($a['createdAt']??''))); respond(200,['posts'=>$rows]);
    }
    if ($path === '/api/posts' && $method === 'POST') {
        $user=getUser($users); if(!$user) respond(401,['error'=>'Iniciá sesión para publicar tu blog.']);
        $in=body(); $title=trim((string)($in['title']??'')); $text=trim((string)($in['text']??''));
        if(lengthOf($title)<4||lengthOf($title)>120) respond(400,['error'=>'El título debe tener entre 4 y 120 caracteres.']);
        if(lengthOf($text)<20||lengthOf($text)>10000) respond(400,['error'=>'La publicación debe tener entre 20 y 10.000 caracteres.']);
        $rows=readRows(POSTS_FILE,'posts'); $item=['id'=>bin2hex(random_bytes(16)),'userId'=>$user['id'],'username'=>$user['username'],'title'=>$title,'text'=>$text,'createdAt'=>gmdate('c')]; $rows[]=$item; writeRows(POSTS_FILE,'posts',$rows); respond(201,['post'=>$item]);
    }
    respond(404,['error'=>'Ruta de API inexistente.']);
}

if (PHP_SAPI === 'cli-server') {
    $path=parse_url($_SERVER['REQUEST_URI']??'/',PHP_URL_PATH)?:'/';
    if(str_starts_with($path,'/api/')) {
        try { api($path); } catch(Throwable $e) { error_log('API PHP local: '.$e->getMessage()); respond(500,['error'=>'Ocurrió un error al procesar la solicitud.']); }
    }
    $decoded=rawurldecode($path);
    if ($decoded === '/') return false;
    $phpPages = [
        '/index.php',
        '/html/biografia.php',
        '/html/blog.php',
        '/html/contacto.php',
        '/html/curso.php',
        '/html/discografia.php',
        '/html/faq.php',
        '/html/galeria.php',
        '/html/index.php',
        '/html/integrantes.php',
        '/html/nosotros.php',
        '/html/noticias.php',
        '/html/tienda.php',
        '/html/tours.php',
        '/html/videoclips.php',
    ];
    if (in_array($decoded, $phpPages, true)) return false;
    if(str_contains($decoded,"\0")||preg_match('#(^|/)(\.git|data)(/|$)#i',$decoded)||preg_match('/\.php(?:$|\/)/i',$decoded)) { http_response_code(404); exit('Not found'); }
    $candidate=realpath(__DIR__.DIRECTORY_SEPARATOR.ltrim(str_replace(['/','\\'],DIRECTORY_SEPARATOR,$decoded),DIRECTORY_SEPARATOR));
    if($candidate!==false&&str_starts_with($candidate,__DIR__.DIRECTORY_SEPARATOR)&&is_file($candidate)) {
        if (strtolower(pathinfo($candidate, PATHINFO_EXTENSION)) === 'mp4' && isset($_SERVER['HTTP_RANGE'])) {
            $size = filesize($candidate);
            if (!preg_match('/^bytes=(\d*)-(\d*)$/', trim($_SERVER['HTTP_RANGE']), $range) || ($range[1] === '' && $range[2] === '')) {
                http_response_code(416);
                header('Content-Range: bytes */' . $size);
                exit;
            }
            if ($range[1] === '') {
                $start = max(0, $size - (int)$range[2]);
                $end = $size - 1;
            } else {
                $start = (int)$range[1];
                $end = $range[2] === '' ? $size - 1 : min((int)$range[2], $size - 1);
            }
            if ($start >= $size || $start > $end) {
                http_response_code(416);
                header('Content-Range: bytes */' . $size);
                exit;
            }
            http_response_code(206);
            header('Content-Type: video/mp4');
            header('Accept-Ranges: bytes');
            header('Content-Range: bytes ' . $start . '-' . $end . '/' . $size);
            header('Content-Length: ' . ($end - $start + 1));
            header('Cache-Control: no-store');
            if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'HEAD') {
                $stream = fopen($candidate, 'rb');
                fseek($stream, $start);
                $remaining = $end - $start + 1;
                while ($remaining > 0 && !feof($stream)) {
                    $chunk = fread($stream, min(8192, $remaining));
                    if ($chunk === false || $chunk === '') break;
                    echo $chunk;
                    $remaining -= strlen($chunk);
                }
                fclose($stream);
            }
            exit;
        }
        return false;
    }
}
http_response_code(404); echo 'Not found';
