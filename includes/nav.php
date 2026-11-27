<nav aria-label="Navegación principal">
    <ul>
        <?php
        $enlaces_navegacion = [
            'index' => 'Inicio',
            'biografia' => 'Biografía',
            'discografia' => 'Discografía',
            'integrantes' => 'Integrantes',
            'tours' => 'Tours',
            'galeria' => 'Galería',
            'videoclips' => 'Videoclips',
            'tienda' => 'Tienda',
            'noticias' => 'Noticias',
            'contacto' => 'Contacto',
            'curso' => 'Academia',
            'blog' => 'Blog',
            'faq' => 'Preguntas Frecuentes',
            'nosotros' => 'Quiénes Somos',
        ];
        foreach ($enlaces_navegacion as $ruta => $etiqueta):
            $atributo_activo = $pagina_actual === $ruta ? ' class="active" aria-current="page"' : '';
        ?>
            <li><a href="./<?= htmlspecialchars($ruta, ENT_QUOTES, 'UTF-8') ?>.php"<?= $atributo_activo ?>><?= htmlspecialchars($etiqueta, ENT_QUOTES, 'UTF-8') ?></a></li>
        <?php endforeach; ?>
    </ul>
</nav>
