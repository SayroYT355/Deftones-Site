<?php
$titulo_pagina = 'Giras de Deftones: fechas y conciertos';
$descripcion_pagina = 'Revisá información sobre las giras y conciertos de Deftones, con fechas, ciudades y lugares de presentación.';
$pagina_actual = 'tours';
require_once __DIR__ . "/../includes/header.php";
?>

    <main>
        <h2>Giras y fechas de Deftones</h2>

        <div class="article-container">
            <p>Mantente al tanto de las próximas presentaciones en vivo de Deftones. Las entradas suelen agotarse rápidamente.</p>

            <h3>Calendario de Conciertos 2026</h3>
            <ul>
                <li><strong>15 de Julio - Buenos Aires, Argentina</strong> - Estadio Obras</li>
                <li><strong>22 de Julio - Santiago, Chile</strong> - Movistar Arena</li>
                <li><strong>05 de Agosto - México DF</strong> - Palacio de los Deportes</li>
                <li><strong>18 de Agosto - Los Ángeles, USA</strong> - Hollywood Bowl</li>
            </ul>

            <a href="./galeria.php" class="btn">Ver Galería de Conciertos</a>
            <a href="./contacto.php" class="btn">Comprar Entradas</a>
        </div>
    </main>


<?php require_once __DIR__ . '/../includes/footer.php'; ?>
