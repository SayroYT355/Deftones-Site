(function () {
    const registerForm = document.querySelector('#register-form');
    const loginForm = document.querySelector('#login-form');
    const accountPanel = document.querySelector('#account-panel');
    const accountStatus = document.querySelector('#account-status');
    const logoutButton = document.querySelector('#logout-button');
    const commentForm = document.querySelector('#comment-form');
    const commentList = document.querySelector('#comment-list');
    const feedback = document.querySelector('#blog-feedback');
    if (!registerForm || !loginForm || !commentForm || !commentList) return;

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
        if (user) accountStatus.textContent = 'Sesión iniciada como ' + user.username + '.';
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
            heading.textContent = comment.username;
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
        handleAuth(event, '/api/register', registerForm, 'Cuenta creada. Ya podés comentar.');
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

    Promise.all([api('/api/session'), loadComments()])
        .then(([session]) => updateAccount(session.user))
        .catch(error => setFeedback(error.message + ' Asegurate de abrir el sitio desde el servidor local.', true));
})();
