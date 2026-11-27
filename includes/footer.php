    <footer>
        <hr>
        <p>&copy; 2026 Deftones Fan Site. Desarrollado por Angel De Piero - 4°3ra CS TT Informática.</p>
    </footer>
    <?php foreach (($scripts_adicionales ?? []) as $script): ?>
        <script src="<?= htmlspecialchars($script, ENT_QUOTES, 'UTF-8') ?>" defer></script>
    <?php endforeach; ?>
    <script src="../js/site.js"></script>
</body>
</html>
