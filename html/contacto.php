<?php
$titulo_pagina = 'Contacto del Deftones Fan Site';
$descripcion_pagina = 'Contactá al creador del sitio de fans de Deftones para compartir consultas, sugerencias o propuestas de colaboración.';
$pagina_actual = 'contacto';
require_once __DIR__ . "/../includes/header.php";
?>

    <main>
        <h2>Contacto del sitio de fans de Deftones</h2>

        <div class="article-container">
            <p>Si tienes alguna pregunta, sugerencia o quieres colaborar con el sitio, no dudes en contactarnos.</p>
            <p>También podés escribir a <a href="mailto:<?= htmlspecialchars($config['APP_EMAIL'], ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars($config['APP_EMAIL'], ENT_QUOTES, 'UTF-8') ?></a>.</p>

            <h3 id="contact-form-title">Formulario de Contacto</h3>
            <form id="contact-form" class="contact-form" aria-labelledby="contact-form-title" novalidate>
                <p class="contact-field">
                    <label for="nombre">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" autocomplete="name" aria-describedby="nombre-error" required>
                    <span class="form-error" id="nombre-error" aria-live="polite"></span>
                </p>
                <p class="contact-field">
                    <label for="email">Correo Electrónico:</label>
                    <input type="email" id="email" name="email" autocomplete="email" aria-describedby="email-error" required>
                    <span class="form-error" id="email-error" aria-live="polite"></span>
                </p>
                <p class="contact-field">
                    <label for="mensaje">Consulta:</label>
                    <textarea id="mensaje" name="mensaje" rows="5" aria-describedby="mensaje-error" required></textarea>
                    <span class="form-error" id="mensaje-error" aria-live="polite"></span>
                </p>
                <button type="submit" class="btn">Revisar datos</button>
                <section id="contact-summary" class="form-summary" aria-labelledby="contact-summary-title" aria-live="polite" tabindex="-1" hidden>
                    <h4 id="contact-summary-title">Resumen de la consulta</h4>
                    <dl>
                        <dt>Nombre</dt>
                        <dd data-summary="nombre"></dd>
                        <dt>Correo electrónico</dt>
                        <dd data-summary="email"></dd>
                        <dt>Consulta</dt>
                        <dd data-summary="mensaje"></dd>
                    </dl>
                    <p class="form-preview-note">Este sitio todavía no envía ni guarda estos datos en línea. El resumen solo se muestra en esta página.</p>
                </section>
            </form>

            <a href="./index.php" class="btn">Volver al Inicio</a>
        </div>
    </main>


<?php require_once __DIR__ . '/../includes/footer.php'; ?>
