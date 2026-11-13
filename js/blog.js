(function () {
    const registerForm = document.querySelector('#register-form');
    const loginForm = document.querySelector('#login-form');
    const accountPanel = document.querySelector('#account-panel');
    const accountStatus = document.querySelector('#account-status');
    const logoutButton = document.querySelector('#logout-button');
    const commentForm = document.querySelector('#comment-form');
    const commentList = document.querySelector('#comment-list');
    const communityBlogForm = document.querySelector('#community-blog-form');
    const communityBlogLogin = document.querySelector('#community-blog-login');
    const communityBlogList = document.querySelector('#community-blog-list');
    const myBlogList = document.querySelector('#my-blog-list');
    const feedback = document.querySelector('#blog-feedback');
    if (!registerForm || !loginForm || !commentForm || !commentList || !communityBlogForm || !communityBlogList || !myBlogList) return;

    let currentUser = null;

    async function api(url, options) {
        const response = await fetch(url, {
            credentials: 'same-origin',
            ...options,
            headers: { 'Content-Type': 'application/json', ...(options && options.headers) }
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || 'Ocurrió un error.');
        return data;
    }

    function setFeedback(message, isError) {
        feedback.textContent = message || '';
        feedback.classList.toggle('is-error', !!isError);
    }

    function updateAccount(user) {
        currentUser = user;
        registerForm.hidden = !!user;
        loginForm.hidden = !!user;
        accountPanel.hidden = !user;
        commentForm.hidden = !user;
        communityBlogForm.hidden = !user;
        communityBlogLogin.hidden = !!user;
        if (user) {
            accountStatus.textContent = 'Sesión iniciada como @' + user.username + '.';
            loadMyPosts().catch(error => showListError(myBlogList, error));
        } else {
            accountStatus.textContent = '';
            renderPosts(myBlogList, []);
        }
    }

    function renderComments(comments) {
        commentList.replaceChildren();
        if (!comments.length) {
            const empty = document.createElement('p');
            empty.className = 'comments-empty';
            empty.textContent = 'Todavía no hay comentarios. ¡Podés iniciar la conversación!';
            commentList.append(empty);
            return;
        }
        comments.forEach(comment => {
            const article = document.createElement('article');
            article.className = 'comment-item';
            const heading = document.createElement('h5');
            heading.textContent = '@' + comment.username;
            const date = document.createElement('time');
            date.dateTime = comment.createdAt;
            date.textContent = new Date(comment.createdAt).toLocaleString('es-AR', {
                dateStyle: 'medium', timeStyle: 'short'
            });
            const text = document.createElement('p');
            text.textContent = comment.text;
            article.append(heading, date, text);
            commentList.append(article);
        });
    }

    async function loadComments() {
        const data = await api('/api/comments');
        renderComments(data.comments);
    }

    function renderPosts(list, posts, emptyMessage = 'Todavía no hay publicaciones.') {
        list.replaceChildren();
        if (!posts.length) {
            const empty = document.createElement('p');
            empty.className = 'comments-empty';
            empty.textContent = emptyMessage;
            list.append(empty);
            return;
        }
        posts.forEach(post => {
            const article = document.createElement('article');
            article.className = 'community-blog-post';
            const title = document.createElement('h4');
            title.textContent = post.title;
            const meta = document.createElement('p');
            meta.className = 'community-blog-meta';
            const author = document.createElement('span');
            author.textContent = '@' + post.username;
            const date = document.createElement('time');
            date.dateTime = post.createdAt;
            date.textContent = new Date(post.createdAt).toLocaleString('es-AR', {
                dateStyle: 'medium', timeStyle: 'short'
            });
            meta.append(author, document.createTextNode(' · '), date);
            const text = document.createElement('p');
            text.className = 'community-blog-post-text';
            text.textContent = post.text;
            article.append(title, meta, text);
            list.append(article);
        });
    }

    function showListError(list, error) {
        list.replaceChildren();
        const message = document.createElement('p');
        message.className = 'blog-feedback is-error';
        message.textContent = error.message;
        list.append(message);
    }

    async function loadPosts() {
        const data = await api('/api/posts');
        renderPosts(communityBlogList, data.posts, 'Todavía no hay publicaciones de la comunidad.');
        renderPosts(myBlogList, currentUser ? data.posts.filter(post => post.userId === currentUser.id) : [], 'Todavía no publicaste en tu blog.');
    }

    async function loadMyPosts() {
        const data = await api('/api/posts');
        renderPosts(myBlogList, data.posts.filter(post => post.userId === currentUser.id), 'Todavía no publicaste en tu blog.');
    }

    async function handleAuth(event, endpoint, form, successMessage) {
        event.preventDefault();
        const submit = form.querySelector('button[type="submit"]');
        submit.disabled = true;
        setFeedback('Procesando…', false);
        try {
            const body = Object.fromEntries(new FormData(form).entries());
            const data = await api(endpoint, {
                method: 'POST', body: JSON.stringify(body)
            });
            updateAccount(data.user);
            form.reset();
            setFeedback(successMessage, false);
        } catch (error) {
            setFeedback(error.message, true);
        } finally {
            submit.disabled = false;
        }
    }

    registerForm.addEventListener('submit', event => {
        handleAuth(event, '/api/register', registerForm, 'Cuenta creada. Ya podés comentar y escribir en tu blog.');
    });
    loginForm.addEventListener('submit', event => {
        handleAuth(event, '/api/login', loginForm, 'Sesión iniciada.');
    });

    logoutButton.addEventListener('click', async () => {
        try {
            await api('/api/logout', { method: 'POST', body: '{}' });
            updateAccount(null);
            setFeedback('Cerraste sesión.', false);
        } catch (error) {
            setFeedback(error.message, true);
        }
    });

    commentForm.addEventListener('submit', async event => {
        event.preventDefault();
        if (!currentUser) return;
        const submit = commentForm.querySelector('button[type="submit"]');
        submit.disabled = true;
        try {
            const body = Object.fromEntries(new FormData(commentForm).entries());
            await api('/api/comments', { method: 'POST', body: JSON.stringify(body) });
            commentForm.reset();
            await loadComments();
            setFeedback('Comentario publicado.', false);
        } catch (error) {
            setFeedback(error.message, true);
        } finally {
            submit.disabled = false;
        }
    });

    communityBlogForm.addEventListener('submit', async event => {
        event.preventDefault();
        if (!currentUser) return;
        const submit = communityBlogForm.querySelector('button[type="submit"]');
        submit.disabled = true;
        try {
            const body = Object.fromEntries(new FormData(communityBlogForm).entries());
            await api('/api/posts', { method: 'POST', body: JSON.stringify(body) });
            communityBlogForm.reset();
            await loadPosts();
            setFeedback('La entrada quedó guardada en tu blog y ya aparece en la comunidad.', false);
        } catch (error) {
            setFeedback(error.message, true);
        } finally {
            submit.disabled = false;
        }
    });

    api('/api/session')
        .then(session => updateAccount(session.user))
        .catch(error => setFeedback(error.message + ' Asegurate de abrir el sitio desde el servidor local.', true));
    loadComments().catch(error => showListError(commentList, error));
    loadPosts().catch(error => showListError(communityBlogList, error));
})();
