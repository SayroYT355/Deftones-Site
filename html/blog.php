<?php
$titulo_pagina = 'Blog de Deftones: artículos y comunidad';
$descripcion_pagina = 'Leé artículos sobre Deftones, comentá el análisis de sus discos y publicá entradas en el blog de la comunidad.';
$pagina_actual = 'blog';
$scripts_adicionales = ["../js/blog.js"];
require_once __DIR__ . "/../includes/header.php";
?>

    <main>
        <h2>Blog de Deftones: entradas recientes</h2>

        <section class="article-container personal-blog" aria-labelledby="personal-blog-title">
            <h3 id="personal-blog-title">Tu blog personal</h3>
            <p>Escribí tus propias entradas con tu cuenta. Tus publicaciones quedan identificadas con tu usuario y también aparecen en el espacio de la comunidad.</p>
            <p id="community-blog-login" class="comments-intro">Para empezar, <a href="#register-form">creá una cuenta</a> o <a href="#login-form">iniciá sesión</a>. Después vas a poder escribir y ver tus entradas acá.</p>
            <form id="community-blog-form" class="blog-form community-blog-form" aria-labelledby="personal-blog-title" hidden>
                <label for="community-blog-title">Título de tu entrada
                    <input id="community-blog-title" name="title" type="text" minlength="4" maxlength="120" required placeholder="Un título para tu idea">
                </label>
                <label for="community-blog-text">Escribí tu entrada
                    <textarea id="community-blog-text" name="text" rows="7" minlength="20" maxlength="10000" required placeholder="Escribí acá tu entrada..."></textarea>
                </label>
                <button class="btn" type="submit">Publicar en mi blog</button>
            </form>
            <h4 class="personal-blog-subtitle">Mis entradas</h4>
            <div id="my-blog-list" class="community-blog-list" aria-live="polite">
                <p>Comprobando tu sesión…</p>
            </div>
        </section>

        <article class="article-container">
            <h3>El impacto de 'White Pony' 26 años después</h3>
            <p>Escrito por Angel el 18 de junio de 2026</p>
            <p>Cuando <span class="album-name white-pony">White Pony</span> salió en el año 2000, Deftones ya tenía una identidad propia, pero su tercer álbum abrió nuevas puertas. La banda amplió su sonido con capas electrónicas, climas envolventes y cambios de dinámica que conviven con riffs pesados y una base rítmica firme.</p>

            <h4>Un sonido que respira y sorprende</h4>
            <p>En canciones como <em>Digital Bath</em>, la producción combina guitarras aireadas, detalles electrónicos y una interpretación vocal que pasa de la intimidad a la intensidad. <em>Change (In the House of Flies)</em> crece de a poco: cada elemento encuentra su espacio y la tensión se construye sin apurarse. Esa atención al clima hace que el disco se sienta inmersivo incluso cuando baja el volumen.</p>
            <p>El contraste es una de las claves del álbum. <em>Elite</em> descarga una energía abrasiva, mientras que <em>Teenager</em> se apoya en una textura más frágil y minimalista. Entre esos extremos aparecen canciones que no siguen una fórmula fija: las guitarras pueden ser densas o casi desaparecer, y la voz cambia de registro para acompañar cada escena.</p>

            <h4>Una influencia que sigue presente</h4>
            <p>El impacto de <span class="album-name white-pony">White Pony</span> no depende solamente de sus canciones más conocidas. También está en cómo organiza el espacio: el bajo y la batería sostienen el peso, las guitarras alternan entre pared y atmósfera, y los arreglos electrónicos aportan profundidad sin ocupar siempre el primer plano. Esa combinación ayudó a que el disco cruzara etiquetas y llegara a oyentes de escenas distintas.</p>
            <p>Veintiséis años después, sigue sonando como una obra de transición y, al mismo tiempo, como un mundo propio. Su mezcla de fuerza, sensibilidad y experimentación anticipó caminos que la banda continuaría explorando en los discos siguientes.</p>

            <section class="article-comments" aria-labelledby="comments-title">
                <h4 id="comments-title">Comentarios del artículo</h4>
                <p class="comments-intro">Podés leer los comentarios sin cuenta. Creá una cuenta o iniciá sesión para publicar.</p>
                <div class="blog-auth-forms">
                    <form id="register-form" class="blog-form" action="/api/register" method="post" autocomplete="on" aria-labelledby="register-form-title">
                        <h5 id="register-form-title">Crear cuenta</h5>
                        <label for="register-username">Nombre de usuario
                            <input id="register-username" name="username" type="text" minlength="3" maxlength="24" autocomplete="username" autocapitalize="none" spellcheck="false" required>
                        </label>
                        <label for="register-password">Contraseña
                            <input id="register-password" name="password" type="password" minlength="8" maxlength="128" autocomplete="new-password" required>
                        </label>
                        <button class="btn" type="submit">Crear cuenta</button>
                    </form>
                    <form id="login-form" class="blog-form" action="/api/login" method="post" autocomplete="on" aria-labelledby="login-form-title">
                        <h5 id="login-form-title">Iniciar sesión</h5>
                        <label for="login-username">Nombre de usuario
                            <input id="login-username" name="username" type="text" autocomplete="username" autocapitalize="none" spellcheck="false" required>
                        </label>
                        <label for="login-password">Contraseña
                            <input id="login-password" name="password" type="password" autocomplete="current-password" required>
                        </label>
                        <button class="btn" type="submit">Iniciar sesión</button>
                    </form>
                </div>
                <div id="account-panel" class="account-panel" hidden>
                    <p id="account-status"></p>
                    <button id="logout-button" class="btn btn-secondary" type="button">Cerrar sesión</button>
                </div>
                <p id="blog-feedback" class="blog-feedback" role="status" aria-live="polite"></p>
                <form id="comment-form" class="blog-form comment-form" aria-labelledby="comments-title" hidden>
                    <label for="comment-text">Dejá tu comentario</label>
                    <textarea id="comment-text" name="text" rows="4" minlength="2" maxlength="1000" required placeholder="¿Qué te parece el álbum?"></textarea>
                    <button class="btn" type="submit">Publicar comentario</button>
                </form>
                <div id="comment-list" class="comment-list" aria-live="polite">
                    <p>Cargando comentarios…</p>
                </div>
            </section>

            <a href="./curso.php" class="btn">Volver a la Academia</a>
            <a href="./faq.php" class="btn">Preguntas Frecuentes</a>
        </article>

        <section class="article-container community-blogs" aria-labelledby="community-blogs-title">
            <h3 id="community-blogs-title">Blogs de la comunidad</h3>
            <p>Leé las entradas públicas de otros usuarios y las tuyas.</p>
            <div id="community-blog-list" class="community-blog-list" aria-live="polite">
                <p>Cargando publicaciones…</p>
            </div>
        </section>
    </main>


<?php require_once __DIR__ . '/../includes/footer.php'; ?>
