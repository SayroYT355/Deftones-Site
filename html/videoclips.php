<?php
$titulo_pagina = 'Videoclips de Deftones: videos oficiales';
$descripcion_pagina = 'Mirá una selección de videoclips de Deftones y recorré canciones clave de sus álbumes más reconocidos.';
$pagina_actual = 'videoclips';
require_once __DIR__ . "/../includes/header.php";
?>

    <main>
        <h2>Videoclips oficiales de Deftones</h2>

        <div class="article-container">
            <p>Revive los videoclips más emblemáticos de Deftones a lo largo de su carrera.</p>

            <h3>Clásicos Imprescindibles</h3>
            <div class="video-grid">
                <article class="video-card video-card--adrenaline">
                    <h3 class="video-title">Bored</h3>
                    <div class="video-player">
                        <video preload="none" playsinline poster="../images/63d0c7c98ab7e5.jpg" aria-label="Videoclip Bored de Deftones">
                            <source src="../videos/bored.mp4" type="video/mp4">
                            Tu navegador no puede reproducir este video. <a href="https://www.youtube.com/watch?v=EHGhjOEtpnc" target="_blank" rel="noopener noreferrer">Míralo en YouTube</a>.
                        </video>
                        <button class="video-play-overlay" type="button" aria-label="Reproducir Bored">
                            <span class="video-play-icon" aria-hidden="true">▶</span>
                        </button>
                    </div>
                    <a class="video-link" href="https://www.youtube.com/watch?v=EHGhjOEtpnc" target="_blank" rel="noopener noreferrer">Ver en YouTube <span aria-hidden="true">↗</span></a>
                </article>
                <article class="video-card video-card--around">
                    <h3 class="video-title">My Own Summer (Shove It)</h3>
                    <div class="video-player">
                        <video preload="none" playsinline poster="../images/593d71c1776cb4.jpg" aria-label="Videoclip My Own Summer de Deftones">
                            <source src="../videos/my-own-summer.mp4" type="video/mp4">
                            Tu navegador no puede reproducir este video.
                        </video>
                        <button class="video-play-overlay" type="button" aria-label="Reproducir My Own Summer">
                            <span class="video-play-icon" aria-hidden="true">▶</span>
                        </button>
                    </div>
                    <a class="video-link" href="https://www.youtube.com/watch?v=XOzs1FehYOA" target="_blank" rel="noopener noreferrer">Ver en YouTube <span aria-hidden="true">↗</span></a>
                </article>
                <article class="video-card video-card--white-pony">
                    <h3 class="video-title">Change (In the House of Flies)</h3>
                    <div class="video-player">
                        <video preload="none" playsinline poster="../images/3c11e925a8fb8a.jpg" aria-label="Videoclip Change de Deftones">
                            <source src="../videos/change.mp4" type="video/mp4">
                            Tu navegador no puede reproducir este video.
                        </video>
                        <button class="video-play-overlay" type="button" aria-label="Reproducir Change">
                            <span class="video-play-icon" aria-hidden="true">▶</span>
                        </button>
                    </div>
                    <a class="video-link" href="https://www.youtube.com/watch?v=WPpDyIJdasg" target="_blank" rel="noopener noreferrer">Ver en YouTube <span aria-hidden="true">↗</span></a>
                </article>
                <article class="video-card video-card--white-pony">
                    <h3 class="video-title">Back to School (Mini Maggit)</h3>
                    <div class="video-player">
                        <video preload="none" playsinline poster="../images/3c11e925a8fb8a.jpg" aria-label="Videoclip Back to School de Deftones">
                            <source src="../videos/back-to-school.mp4" type="video/mp4">
                            Tu navegador no puede reproducir este video.
                        </video>
                        <button class="video-play-overlay" type="button" aria-label="Reproducir Back to School">
                            <span class="video-play-icon" aria-hidden="true">▶</span>
                        </button>
                    </div>
                    <a class="video-link" href="https://www.youtube.com/watch?v=1gxZIL4zpIQ" target="_blank" rel="noopener noreferrer">Ver en YouTube <span aria-hidden="true">↗</span></a>
                </article>
            </div>

            <a href="./discografia.php" class="btn">Ver Discografía</a>
            <a href="./tienda.php" class="btn">Ir a la Tienda</a>
        </div>
    </main>


<?php require_once __DIR__ . '/../includes/footer.php'; ?>
