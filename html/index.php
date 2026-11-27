<?php
$titulo_pagina = 'Deftones: música, historia y discografía | Fan Site';
$descripcion_pagina = 'Explorá la historia de Deftones, su discografía, integrantes y videoclips en español. Un recorrido por el sonido de la banda de Sacramento.';
$pagina_actual = 'index';
$clase_body = 'home-page';
require_once __DIR__ . "/../includes/header.php";
?>

    <main>
        <h2>Bienvenidos al universo sonoro de Deftones</h2>

        <div class="home-intro">
            <p style="margin-top: 1.5rem; font-size: 1.1rem;">
                Descubrí la historia, los discos y el sonido de Deftones, desde Sacramento hasta los escenarios de todo el mundo.
                Explorá sus etapas, conocé a sus integrantes y reviví sus canciones más emblemáticas.
            </p>

            <a href="./biografia.php" class="btn">Descubrir la Historia</a>
            <a href="./discografia.php" class="btn">Ver Discografía</a>
        </div>
    </main>


<?php require_once __DIR__ . '/../includes/footer.php'; ?>
