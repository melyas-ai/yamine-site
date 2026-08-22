/* Yamine site forms: waitlist + contact.
   ENDPOINT is the Apps Script web-app /exec URL. While it is empty the
   forms stay hidden and the mailto fallbacks remain - the site never
   shows a control that does not work. */
(function () {
  var ENDPOINT = '';

  if (!ENDPOINT) return;

  document.querySelectorAll('[data-form]').forEach(function (form) {
    var fallback = document.querySelector('[data-fallback-for="' + form.dataset.form + '"]');
    form.hidden = false;
    if (fallback) fallback.hidden = true;

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var note = form.querySelector('.form-note');
      btn.disabled = true;
      btn.textContent = btn.dataset.busy || 'Sending…';

      var body = new URLSearchParams(new FormData(form)).toString();
      fetch(ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
      }).then(function () {
        form.querySelectorAll('input, textarea, button').forEach(function (el) { el.disabled = true; });
        if (note) { note.textContent = form.dataset.done; note.classList.add('form-done'); }
      }).catch(function () {
        btn.disabled = false;
        btn.textContent = form.dataset.cta;
        if (note) note.textContent = 'That did not go through - please email us instead: ' + form.dataset.mail;
      });
    });
  });
})();
