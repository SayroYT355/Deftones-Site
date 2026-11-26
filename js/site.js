(function () {
    if (window.location.protocol === 'file:') {
        const fileName = decodeURIComponent(window.location.pathname.split(/[\\/]/).pop() || 'index.html');
        if (/^[a-z0-9-]+\.html$/i.test(fileName)) {
            window.location.replace('http://127.0.0.1:4173/html/' + encodeURIComponent(fileName));
            return;
        }
    }

    const body = document.body;
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    let revealObserver = null;
    let navigationToken = 0;
    let pageScriptElement = null;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function closeNavigation() {
        if (!nav) return;
        nav.classList.remove('open');
        const button = header && header.querySelector('.nav-toggle');
        if (button) {
            button.setAttribute('aria-expanded', 'false');
            button.setAttribute('aria-label', 'Abrir menú de navegación');
        }
    }

    function setupNavigationToggle() {
        if (!header || !nav || header.querySelector('.nav-toggle')) return;
        if (!nav.id) nav.id = 'site-navigation';

        const button = document.createElement('button');
        button.className = 'nav-toggle';
        button.type = 'button';
        button.setAttribute('aria-controls', 'site-navigation');
        button.setAttribute('aria-label', 'Abrir menú de navegación');
        button.setAttribute('aria-expanded', 'false');
        button.innerHTML = '<span aria-hidden="true">☰</span>';
        header.appendChild(button);

        button.addEventListener('click', function () {
            const open = nav.classList.toggle('open');
            button.setAttribute('aria-expanded', String(open));
            button.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && nav.classList.contains('open')) {
                closeNavigation();
                button.focus();
            }
        });
    }

    function initializeMotion() {
        if (revealObserver) revealObserver.disconnect();
        body.classList.add('motion-ready');

        document.querySelectorAll('main .article-container:not(.gallery-container), main h2:not(.gallery-container ~ h2)').forEach(function (element) {
            element.classList.add('reveal');
        });

        document.querySelectorAll('main article, main .album-card, main .gallery-card, main .article-container > section').forEach(function (element, index) {
            element.classList.add('motion-reveal');
            element.style.transitionDelay = (index % 5) * 70 + 'ms';
        });

        const revealElements = document.querySelectorAll('.reveal, .motion-reveal');
        if ('IntersectionObserver' in window) {
            revealObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        const revealTarget = entry.target;
                        if (revealTarget.classList.contains('motion-reveal')) {
                            const clearRevealDelay = function (event) {
                                if (event.target !== revealTarget || event.propertyName !== 'opacity') return;
                                revealTarget.style.removeProperty('transition-delay');
                                revealTarget.removeEventListener('transitionend', clearRevealDelay);
                            };
                            revealTarget.addEventListener('transitionend', clearRevealDelay);
                            window.setTimeout(function () {
                                revealTarget.style.removeProperty('transition-delay');
                                revealTarget.removeEventListener('transitionend', clearRevealDelay);
                            }, 1100);
                        }
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.08 });
            revealElements.forEach(function (element) { revealObserver.observe(element); });
        } else {
            revealElements.forEach(function (element) {
                element.classList.add('visible');
                element.style.removeProperty('transition-delay');
            });
        }
    }

    function setupInteractiveCards() {
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || reducedMotion.matches) return;

        document.querySelectorAll('.album-card, .gallery-card, .video-card').forEach(function (card) {
            card.addEventListener('pointermove', function (event) {
                card.style.removeProperty('transition-delay');
                const bounds = card.getBoundingClientRect();
                const x = (event.clientX - bounds.left) / bounds.width;
                const y = (event.clientY - bounds.top) / bounds.height;
                card.style.setProperty('--spot-x', (x * 100).toFixed(1) + '%');
                card.style.setProperty('--spot-y', (y * 100).toFixed(1) + '%');
                card.style.setProperty('--tilt-x', ((.5 - y) * 4).toFixed(2) + 'deg');
                card.style.setProperty('--tilt-y', ((x - .5) * 5).toFixed(2) + 'deg');
            });
            card.addEventListener('pointerleave', function () {
                card.style.removeProperty('--tilt-x');
                card.style.removeProperty('--tilt-y');
                card.style.setProperty('--spot-x', '50%');
                card.style.setProperty('--spot-y', '50%');
            });
        });
    }

    function setupGalleryLightbox() {
        document.querySelector('.gallery-lightbox')?.remove();
        const galleryImages = Array.from(document.querySelectorAll('.gallery-card img'));
        if (!galleryImages.length || typeof HTMLDialogElement === 'undefined') return;

        const lightbox = document.createElement('dialog');
        lightbox.className = 'gallery-lightbox';
        lightbox.setAttribute('aria-label', 'Galería de imágenes');
        lightbox.innerHTML = '<button class="lightbox-close" type="button" aria-label="Cerrar imagen ampliada">×</button><button class="lightbox-previous" type="button" aria-label="Imagen anterior">←</button><figure><img alt=""><figcaption></figcaption><span class="lightbox-count" aria-live="polite"></span></figure><button class="lightbox-next" type="button" aria-label="Imagen siguiente">→</button>';
        body.appendChild(lightbox);

        const lightboxImage = lightbox.querySelector('img');
        const lightboxCaption = lightbox.querySelector('figcaption');
        const lightboxCount = lightbox.querySelector('.lightbox-count');
        const closeButton = lightbox.querySelector('.lightbox-close');
        let currentImage = 0;
        let imageOpener = null;

        function showGalleryImage(index) {
            currentImage = (index + galleryImages.length) % galleryImages.length;
            const source = galleryImages[currentImage];
            const card = source.closest('.gallery-card');
            const copy = card && card.querySelector('.gallery-copy');
            const description = copy && copy.querySelector('p');
            const credit = copy && copy.querySelector('cite');
            lightboxImage.classList.toggle('crop-bottom', !!(card && card.classList.contains('gallery-card--era-fur')));
            lightboxImage.src = source.currentSrc || source.src;
            lightboxImage.alt = source.alt || 'Fotografía de la galería de Deftones';
            lightboxCaption.textContent = [description && description.textContent.trim(), credit && credit.textContent.trim()].filter(Boolean).join(' ');
            lightboxCount.textContent = (currentImage + 1) + ' / ' + galleryImages.length;
        }

        function openGalleryImage(index, opener) {
            imageOpener = opener;
            showGalleryImage(index);
            lightbox.showModal();
            closeButton.focus();
        }

        galleryImages.forEach(function (image, index) {
            image.tabIndex = 0;
            image.setAttribute('role', 'button');
            image.setAttribute('aria-label', 'Ampliar imagen: ' + (image.alt || 'fotografía de Deftones'));
            image.addEventListener('click', function () { openGalleryImage(index, image); });
            image.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openGalleryImage(index, image);
                }
            });
        });

        lightbox.querySelector('.lightbox-previous').addEventListener('click', function () { showGalleryImage(currentImage - 1); });
        lightbox.querySelector('.lightbox-next').addEventListener('click', function () { showGalleryImage(currentImage + 1); });
        closeButton.addEventListener('click', function () { lightbox.close(); });
        lightbox.addEventListener('click', function (event) {
            if (event.target === lightbox) lightbox.close();
        });
        lightbox.addEventListener('keydown', function (event) {
            if (event.key === 'ArrowLeft') showGalleryImage(currentImage - 1);
            if (event.key === 'ArrowRight') showGalleryImage(currentImage + 1);
        });
        lightbox.addEventListener('close', function () {
            if (imageOpener) imageOpener.focus();
        });
    }

    function setupVideoPlayers() {
        document.querySelectorAll('.video-player').forEach(function (player) {
            if (player.dataset.playButtonReady) return;
            const video = player.querySelector('video');
            const button = player.querySelector('.video-play-overlay');
            if (!video || !button) return;

            const useNativeTouchControls = window.matchMedia('(pointer: coarse)').matches;
            if (useNativeTouchControls) video.controls = true;

            player.dataset.playButtonReady = 'true';
            const controls = document.createElement('div');
            controls.className = 'video-controls';
            controls.setAttribute('role', 'group');
            controls.setAttribute('aria-label', 'Controles del videoclip');
            controls.innerHTML = '<button class="video-control-toggle" type="button" aria-label="Reproducir video"></button><span class="video-time-current">0:00</span><input class="video-timeline" type="range" min="0" max="1000" value="0" aria-label="Posición del video"><span class="video-time-duration">0:00</span><button class="video-volume-toggle" type="button" aria-label="Silenciar video"></button><input class="video-volume" type="range" min="0" max="1" step="0.05" value="1" aria-label="Volumen"><button class="video-fullscreen" type="button" aria-label="Pantalla completa"></button>';
            player.appendChild(controls);

            const playPauseButton = controls.querySelector('.video-control-toggle');
            const currentTime = controls.querySelector('.video-time-current');
            const duration = controls.querySelector('.video-time-duration');
            const timeline = controls.querySelector('.video-timeline');
            const volumeButton = controls.querySelector('.video-volume-toggle');
            const volume = controls.querySelector('.video-volume');
            const fullscreenButton = controls.querySelector('.video-fullscreen');

            function showPlaybackError(playError) {
                player.classList.add('has-playback-error');
                if (player.querySelector('.video-playback-error')) return;
                const message = document.createElement('p');
                message.className = 'video-playback-error';
                message.setAttribute('role', 'status');
                const mediaErrorCode = video.error ? video.error.code : 0;
                const detail = mediaErrorCode === 2
                    ? 'Vercel no pudo entregar el archivo de video.'
                    : mediaErrorCode === 3
                        ? 'El navegador recibió el video, pero no pudo decodificarlo.'
                        : mediaErrorCode === 4
                            ? 'El navegador no reconoce la ruta o el formato del video.'
                            : playError && playError.name === 'NotAllowedError'
                                ? 'El navegador bloqueó la reproducción. Tocá reproducir otra vez.'
                                : 'No se pudo iniciar la reproducción del video.';
                message.append(document.createTextNode(detail + ' '));
                const youtubeLink = player.closest('.video-card').querySelector('.video-link');
                if (youtubeLink) {
                    const link = document.createElement('a');
                    link.href = youtubeLink.href;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.textContent = 'Ver en YouTube';
                    message.append(link);
                }
                player.append(message);
            }

            function playVideo() {
                const result = video.play();
                if (result && typeof result.catch === 'function') result.catch(function (error) { showPlaybackError(error); });
            }

            function formatTime(seconds) {
                if (!Number.isFinite(seconds)) return '0:00';
                const minutes = Math.floor(seconds / 60);
                const remainder = Math.floor(seconds % 60).toString().padStart(2, '0');
                return minutes + ':' + remainder;
            }

            function renderControls() {
                const playing = !video.paused && !video.ended;
                playPauseButton.innerHTML = playing
                    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM15 5h4v14h-4z"/></svg>'
                    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
                playPauseButton.setAttribute('aria-label', playing ? 'Pausar video' : 'Reproducir video');
                volumeButton.innerHTML = video.muted || video.volume === 0
                    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9H3zm13.5 3 4 4m0-4-4 4"/></svg>'
                    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9H3zm13-2a7 7 0 0 1 0 10m-3-7a3 3 0 0 1 0 4"/></svg>';
                volumeButton.setAttribute('aria-label', video.muted || video.volume === 0 ? 'Activar sonido' : 'Silenciar video');
                fullscreenButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/></svg>';
            }

            button.addEventListener('click', function () {
                playVideo();
                button.blur();
            });
            video.addEventListener('click', function () {
                if (video.paused || video.ended) playVideo();
                else video.pause();
            });
            playPauseButton.addEventListener('click', function () {
                if (video.paused || video.ended) playVideo();
                else video.pause();
                playPauseButton.blur();
            });
            video.addEventListener('error', showPlaybackError);
            timeline.addEventListener('input', function () {
                if (Number.isFinite(video.duration)) video.currentTime = (Number(timeline.value) / 1000) * video.duration;
            });
            volume.addEventListener('input', function () {
                video.volume = Number(volume.value);
                video.muted = video.volume === 0;
                renderControls();
            });
            volumeButton.addEventListener('click', function () {
                video.muted = !video.muted;
                renderControls();
                volumeButton.blur();
            });
            fullscreenButton.addEventListener('click', function () {
                if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
                else if (player.requestFullscreen) player.requestFullscreen().catch(function () {});
                fullscreenButton.blur();
            });
            player.addEventListener('pointerleave', function (event) {
                if (event.pointerType === 'mouse' && controls.contains(document.activeElement)) document.activeElement.blur();
            });
            video.addEventListener('loadedmetadata', function () { duration.textContent = formatTime(video.duration); });
            video.addEventListener('timeupdate', function () {
                currentTime.textContent = formatTime(video.currentTime);
                timeline.value = Number.isFinite(video.duration) && video.duration > 0
                    ? String(Math.round((video.currentTime / video.duration) * 1000))
                    : '0';
            });
            video.addEventListener('play', function () {
                player.classList.add('is-playing');
                renderControls();
            });
            video.addEventListener('pause', function () {
                player.classList.remove('is-playing');
                renderControls();
            });
            video.addEventListener('ended', function () {
                player.classList.remove('is-playing');
                renderControls();
            });
            video.addEventListener('volumechange', renderControls);
            renderControls();
        });
    }

    function initializePageContent() {
        initializeMotion();
        setupInteractiveCards();
        setupGalleryLightbox();
        setupVideoPlayers();
        document.querySelectorAll('iframe[src*="youtube"]').forEach(function (iframe) {
            iframe.addEventListener('error', function () {
                const error = iframe.parentElement.querySelector('.video-error');
                if (error) error.style.display = 'block';
            });
        });
    }

    function setupBackToTop() {
        const button = document.createElement('button');
        button.className = 'back-to-top';
        button.type = 'button';
        button.setAttribute('aria-label', 'Volver arriba');
        button.setAttribute('aria-hidden', 'true');
        button.tabIndex = -1;
        button.innerHTML = '<span aria-hidden="true">↑</span>';
        body.appendChild(button);
        button.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
        });

        function updateScrollState() {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
            document.documentElement.style.setProperty('--scroll-progress', progress + '%');
            const visible = window.scrollY > 420;
            button.classList.toggle('visible', visible);
            button.setAttribute('aria-hidden', String(!visible));
            button.tabIndex = visible ? 0 : -1;
        }

        window.addEventListener('scroll', updateScrollState, { passive: true });
        return updateScrollState;
    }

    function setupBackgroundAudio() {
        // Todas las páginas HTML viven en /html/ y el audio está en /audio/.
        const audio = new Audio(new URL('../audio/01 - Swerve City.mp3', window.location.href));
        audio.preload = 'auto';
        audio.volume = 0.3;

        // Keep playback position and state if the browser performs a full page load.
        // Normal in-site navigation keeps this same Audio instance alive.
        const playbackKey = 'deftones-background-audio';
        let savedPlayback = null;
        try {
            savedPlayback = JSON.parse(sessionStorage.getItem(playbackKey) || 'null');
        } catch (error) {
            savedPlayback = null;
        }

        function savePlayback() {
            try {
                sessionStorage.setItem(playbackKey, JSON.stringify({
                    time: Number.isFinite(audio.currentTime) ? audio.currentTime : 0,
                    playing: !audio.paused && !audio.ended
                }));
            } catch (error) {
                // Playback still works if browser storage is unavailable.
            }
        }

        if (savedPlayback) {
            audio.addEventListener('loadedmetadata', function restorePlayback() {
                if (Number.isFinite(savedPlayback.time) && savedPlayback.time > 0) {
                    audio.currentTime = Math.min(savedPlayback.time, Math.max(0, audio.duration - 0.25));
                }
                if (savedPlayback.playing) audio.play().catch(function () {});
            }, { once: true });
        }

        const button = document.createElement('button');
        button.className = 'background-audio-toggle';
        button.type = 'button';
        button.setAttribute('aria-label', 'Pausar Swerve City');
        button.setAttribute('aria-pressed', 'false');
        button.title = 'Pausar Swerve City';
        body.appendChild(button);

        function renderState(playing) {
            button.classList.toggle('is-playing', playing);
            button.setAttribute('aria-pressed', String(playing));
            button.setAttribute('aria-label', playing ? 'Pausar Swerve City' : 'Reproducir Swerve City');
            button.title = playing ? 'Pausar Swerve City' : 'Reproducir Swerve City';
            button.innerHTML = playing
                ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5h3v14H8zM15 5h3v14h-3z" fill="currentColor"/></svg>'
                : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
        }

        button.addEventListener('click', function () {
            if (audio.paused) audio.play().catch(function () { renderState(false); });
            else audio.pause();
        });

        audio.addEventListener('play', function () { renderState(true); });
        audio.addEventListener('pause', function () { renderState(false); savePlayback(); });
        audio.addEventListener('ended', function () { renderState(false); });
        audio.addEventListener('timeupdate', savePlayback);
        window.addEventListener('pagehide', savePlayback);
        audio.addEventListener('error', function () {
            button.disabled = true;
            button.classList.add('audio-unavailable');
            button.setAttribute('aria-label', 'No se pudo cargar audio/01 - Swerve City.mp3');
            button.title = 'No se pudo cargar el MP3 de Swerve City';
        });

        renderState(false);
        if (!savedPlayback) {
            audio.play().catch(function () { renderState(false); });
        }
    }

    function updateActiveNavigation(targetUrl, loadedDocument) {
        if (!nav) return;
        const newActive = loadedDocument.querySelector('nav a.active');
        const selectedPath = newActive ? new URL(newActive.getAttribute('href'), targetUrl).pathname : targetUrl.pathname;
        nav.querySelectorAll('a').forEach(function (link) {
            const active = new URL(link.href, window.location.href).pathname === selectedPath;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
        });
    }

    function loadPageScripts(loadedDocument, targetUrl) {
        if (pageScriptElement) {
            pageScriptElement.remove();
            pageScriptElement = null;
        }
        const pageScript = Array.from(loadedDocument.querySelectorAll('script[src]')).find(function (script) {
            return !/\/site\.js(?:\?|$)/i.test(script.getAttribute('src') || '');
        });
        if (!pageScript) return;
        const liveScript = document.createElement('script');
        liveScript.src = new URL(pageScript.getAttribute('src'), targetUrl).href;
        liveScript.defer = true;
        pageScriptElement = liveScript;
        body.appendChild(liveScript);
    }

    async function navigateWithinSite(targetUrl, addHistory) {
        const token = ++navigationToken;
        try {
            const response = await fetch(targetUrl.href, { headers: { 'X-Requested-With': 'fetch' } });
            if (!response.ok) throw new Error('Page request failed');
            const html = await response.text();
            const loadedDocument = new DOMParser().parseFromString(html, 'text/html');
            const nextMain = loadedDocument.querySelector('main');
            if (!nextMain || token !== navigationToken) return false;

            if (revealObserver) revealObserver.disconnect();
            document.querySelector('.gallery-lightbox')?.remove();
            document.querySelector('main').replaceWith(document.importNode(nextMain, true));
            document.title = loadedDocument.title;
            body.classList.toggle('home-page', loadedDocument.body.classList.contains('home-page'));
            updateActiveNavigation(targetUrl, loadedDocument);
            if (addHistory) history.pushState({ page: targetUrl.pathname }, '', targetUrl.href);
            loadPageScripts(loadedDocument, targetUrl);

            closeNavigation();
            window.scrollTo({ top: 0, behavior: 'auto' });
            const newMain = document.querySelector('main');
            newMain.classList.remove('page-enter');
            void newMain.offsetWidth;
            newMain.classList.add('page-enter');
            newMain.addEventListener('animationend', function () { newMain.classList.remove('page-enter'); }, { once: true });
            initializePageContent();
            window.dispatchEvent(new Event('scroll'));
            return true;
        } catch (error) {
            if (token === navigationToken) window.location.assign(targetUrl.href);
            return false;
        }
    }

    function setupPersistentNavigation() {
        document.addEventListener('click', function (event) {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            const link = event.target.closest('a[href]');
            if (!link) return;
            if (nav && nav.contains(link)) closeNavigation();
            if (link.hasAttribute('download') || (link.target && link.target !== '_self')) return;

            const targetUrl = new URL(link.href, window.location.href);
            if (targetUrl.origin !== window.location.origin || targetUrl.hash || !targetUrl.pathname.toLowerCase().endsWith('.html')) return;
            if (window.location.protocol !== 'http:' && window.location.protocol !== 'https:') return;
            event.preventDefault();

            if (targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search) {
                window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
                return;
            }
            navigateWithinSite(targetUrl, true);
        });

        window.addEventListener('popstate', function () {
            navigateWithinSite(new URL(window.location.href), false);
        });
    }

    setupNavigationToggle();
    initializePageContent();
    const updateScrollState = setupBackToTop();
    setupBackgroundAudio();
    setupPersistentNavigation();
    updateScrollState();
})();
