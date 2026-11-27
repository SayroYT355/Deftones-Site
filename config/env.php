<?php
declare(strict_types=1);

$envPath = dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env';
if (!is_file($envPath)) {
    throw new RuntimeException('No se puede leer .env. Copiá .env.example a .env en la carpeta principal del proyecto.');
}

$requiredKeys = ['APP_NAME', 'APP_EMAIL', 'APP_ENV'];
$settings = [];
$lines = file($envPath, FILE_IGNORE_NEW_LINES);
if ($lines === false) {
    throw new RuntimeException('No se pudo leer el archivo .env.');
}

foreach ($lines as $index => $line) {
    $line = trim($line);
    if ($line === '' || str_starts_with($line, '#')) {
        continue;
    }

    $separator = strpos($line, '=');
    if ($separator === false) {
        throw new RuntimeException('Formato inválido en .env, línea ' . ($index + 1) . '.');
    }

    $key = trim(substr($line, 0, $separator));
    $value = trim(substr($line, $separator + 1));
    if (!in_array($key, $requiredKeys, true) || $value === '' || array_key_exists($key, $settings)) {
        throw new RuntimeException('Clave desconocida, vacía o repetida en .env, línea ' . ($index + 1) . '.');
    }

    $firstCharacter = $value[0];
    $lastCharacter = $value[strlen($value) - 1];
    if (($firstCharacter === '"' && $lastCharacter === '"') || ($firstCharacter === "'" && $lastCharacter === "'")) {
        $value = substr($value, 1, -1);
    }
    if ($value === '') {
        throw new RuntimeException('El valor de ' . $key . ' no puede estar vacío.');
    }

    $settings[$key] = $value;
}

foreach ($requiredKeys as $key) {
    if (!array_key_exists($key, $settings)) {
        throw new RuntimeException('Falta la variable ' . $key . ' en .env.');
    }
}

if (filter_var($settings['APP_EMAIL'], FILTER_VALIDATE_EMAIL) === false) {
    throw new RuntimeException('APP_EMAIL debe contener una dirección de correo válida.');
}
if (!in_array($settings['APP_ENV'], ['local', 'production'], true)) {
    throw new RuntimeException('APP_ENV debe ser local o production.');
}

return $settings;
