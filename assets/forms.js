/* Yamine site forms: waitlist + contact.
   Backed by the company's own Apps Script web app (Google Workspace);
   fields: kind=waitlist|message, email, name, message, honeypot "website".
   The endpoint 302s to a login-walled page even on success, so the client
   never judges by the response - a completed no-cors fetch is treated as
   sent, and delivery is proven at the sheet. The two Google Forms remain
   as a dormant fallback (see the fleet wiring file). If ENDPOINT is ever
   emptied, forms hide and the mailto fallbacks return - the site never
   shows a control that does not work. */
(function () {
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbzs29NVi16hfKV8BI6-RZ-lXvBW_KsComsVEhYo_RyvcW8C1B253rvxUK-94hbYG8iOPg/exec';

  if (!ENDPOINT) return;

  document.querySelectorAll('[data-form]').forEach(function (form) {
    /* querySelectorAll: the same kind of form can appear more than once on a
       page (waitlist: hero + status card), each with its own fallback row */
    document.querySelectorAll('[data-fallback-for="' + form.dataset.form + '"]')
      .forEach(function (el) { el.hidden = true; });
    form.hidden = false;

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var note = form.querySelector('.form-note');
      var hp = form.querySelector('.hp');

      var done = function () {
        form.querySelectorAll('input, textarea, button').forEach(function (el) { el.disabled = true; });
        btn.textContent = form.dataset.doneCta || 'Done';
        if (note) { note.textContent = form.dataset.done; note.classList.add('form-done'); }
      };

      /* honeypot: filled means a bot - pretend success, send nothing
         (the endpoint carries its own server-side guard as well) */
      if (hp && hp.value) { done(); return; }

      btn.disabled = true;
      btn.textContent = form.dataset.busy || 'Sending…';

      var body = new URLSearchParams(new FormData(form));
      body.append('kind', form.dataset.form === 'waitlist' ? 'waitlist' : 'message');

      fetch(ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
      }).then(done).catch(function () {
        btn.disabled = false;
        btn.textContent = form.dataset.cta;
        if (note) note.textContent = 'That did not go through - please email us instead: ' + form.dataset.mail;
      });
    });
  });
})();
