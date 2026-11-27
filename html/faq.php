<?php
$titulo_pagina = 'Preguntas frecuentes sobre Deftones';
$descripcion_pagina = 'Encontrá respuestas sobre la historia de Deftones, sus integrantes, álbumes y el funcionamiento de este sitio de fans.';
$pagina_actual = 'faq';
require_once __DIR__ . "/../includes/header.php";
?>

    <main>
        <h2>Preguntas frecuentes sobre Deftones</h2>

        <div class="article-container">
            <h3>¿En qué año se formó la banda Deftones?</h3>
            <p>La banda se formó en el año 1988 en Sacramento, California.</p>

            <h3>¿Este sitio web vende el merchandising de forma directa?</h3>
            <p>No, los botones de compra redirigen o simulan accesos a las tiendas oficiales del grupo.</p>

            <h3>¿La academia online de producción tiene costo?</h3>
            <p>No, la guía de estudio que está publicada en este sitio web es de acceso completamente libre y gratuito.</p>

            <a href="./curso.php" class="btn">Volver a la Academia</a>
            <a href="./blog.php" class="btn">Ir al Blog</a>
        </div>
    </main>


<?php require_once __DIR__ . '/../includes/footer.php'; ?>
