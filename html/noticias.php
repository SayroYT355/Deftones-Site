<?php
$titulo_pagina = 'Noticias de Deftones: novedades y actualidad';
$descripcion_pagina = 'Consultá noticias y novedades relacionadas con Deftones, sus lanzamientos, actividades y próximas presentaciones.';
$pagina_actual = 'noticias';
require_once __DIR__ . "/../includes/header.php";
?>

    <main>
        <h2>Noticias y novedades de Deftones</h2>

        <div class="article-container">
            <h3>Nuevo Álbum en 2026</h3>
            <p>La banda está trabajando en nuevo material que se espera para finales de año.</p>

            <h3>Tour Mundial Confirmado</h3>
            <p>Se han confirmado fechas en América del Sur, Europa y Norteamérica para el segundo semestre.</p>

            <a href="./tours.php" class="btn">Ver Fechas de Gira</a>
            <a href="./blog.php" class="btn">Leer Blog</a>
        </div>
    </main>


<?php require_once __DIR__ . '/../includes/footer.php'; ?>
