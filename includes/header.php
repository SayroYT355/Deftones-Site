<?php $config = require __DIR__ . '/../config/env.php'; ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($titulo_pagina, ENT_QUOTES, 'UTF-8') ?></title>
    <meta name="description" content="<?= htmlspecialchars($descripcion_pagina, ENT_QUOTES, 'UTF-8') ?>">
    <meta name="application-name" content="<?= htmlspecialchars($config['APP_NAME'], ENT_QUOTES, 'UTF-8') ?>">
    <link rel="canonical" href="https://deftonesfansite.vercel.app/html/<?= rawurlencode($pagina_actual) ?>.php">
    <link rel="icon" type="image/png" href="../images/icon (1).png">
    <link rel="stylesheet" href="../css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@700;900&family=Segoe+UI:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body<?= isset($clase_body) && $clase_body !== '' ? ' class="' . htmlspecialchars($clase_body, ENT_QUOTES, 'UTF-8') . '"' : '' ?>>
    <header>
        <h1>Deftones</h1>
        <?php require_once __DIR__ . '/nav.php'; ?>
    </header>
