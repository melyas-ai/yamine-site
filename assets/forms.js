/* Yamine site forms: waitlist + contact.
   Backed by two publicly-respondable Google Forms owned by the company's
   own Workspace account; the post URLs and entry ids below are public by
   nature (any visitor's browser sees them). A form with no config here
   stays hidden and its mailto fallback remains - the site never shows a
   control that does not work. */
(function () {
  var FORMS = {
    waitlist: {
      post: 'https://docs.google.com/forms/d/e/1FAIpQLSc-zb0pomBGfBPz-o5r8oy2MSdqgJaWW7Pyl8m76XqumD4FAQ/formResponse',
      map: { email: 'entry.1991170500' }
    },
    message: {
      post: 'https://docs.google.com/forms/d/e/1FAIpQLSd7pkoMUPHGfru-AoheG-i5pJiyM_zwOV43MQlGnsDoTsuzYw/formResponse',
      map: { name: 'entry.1678477959', email: 'entry.1233805790', message: 'entry.363002019' }
    }
  };

  document.querySelectorAll('[data-form]').forEach(function (form) {
    var cfg = FORMS[form.dataset.form];
    if (!cfg || !cfg.post) return;
    var fallback = document.querySelector('[data-fallback-for="' + form.dataset.form + '"]');
    form.hidden = false;
    if (fallback) fallback.hidden = true;

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

      /* honeypot: filled means a bot - pretend success, send nothing */
      if (hp && hp.value) { done(); return; }

      btn.disabled = true;
      btn.textContent = form.dataset.busy || 'Sending…';

      var body = new URLSearchParams();
      Object.keys(cfg.map).forEach(function (k) {
        var el = form.querySelector('[name="' + k + '"]');
        body.append(cfg.map[k], el ? el.value : '');
      });

      fetch(cfg.post, {
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
