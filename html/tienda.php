<?php
$titulo_pagina = 'Merchandising de Deftones: tienda de fans';
$descripcion_pagina = 'Explorá una selección de merchandising de Deftones, con camisetas, vinilos, pósters y otros artículos para fans.';
$pagina_actual = 'tienda';
require_once __DIR__ . "/../includes/header.php";
?>

    <main>
        <h2>Tienda de merchandising de Deftones</h2>

        <div class="article-container">
            <p>Encuentra el merchandise oficial de Deftones: camisetas, vinilos, posters y más.</p>

            <h3>Artículos Destacados</h3>
            <ul>
                <li><strong>Vinilo White Pony (Edición Limitada)</strong> - $45.00</li>
                <li><strong>Camiseta Crosses Logo</strong> - $25.00</li>
                <li><strong>Poster Koi No Yokan</strong> - $15.00</li>
                <li><strong>Gorra Deftones Verde Neón</strong> - $20.00</li>
            </ul>

            <a href="./discografia.php" class="btn">Volver a Discografía</a>
            <a href="./contacto.php" class="btn">Comprar Ahora</a>
        </div>
    </main>


<?php require_once __DIR__ . '/../includes/footer.php'; ?>
