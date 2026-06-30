/* ============================================================
   ARAU · Grilled Brunch — interacciones
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Año del footer ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Badge abierto / cerrado (hora de Barcelona) ---------- */
  (function () {
    var badge = document.getElementById('open-status');
    if (!badge) return;

    // Horario en hora de Barcelona. 0=Dom … 6=Sáb. null = cerrado.
    var horario = {
      0: [9.5, 17],   // Domingo 9:30–17
      1: [9, 16],     // Lunes 9–16
      2: null,        // Martes cerrado
      3: [9, 16],     // Miércoles 9–16
      4: [9, 16],     // Jueves 9–16
      5: [9, 16],     // Viernes 9–16
      6: [9.5, 17]    // Sábado 9:30–17
    };
    var dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

    function fmt(t) {
      var hh = Math.floor(t), mm = Math.round((t - hh) * 60);
      return hh + ':' + (mm < 10 ? '0' + mm : mm);
    }

    // Día y hora actuales EN BARCELONA (no en la zona horaria del visitante)
    function ahoraBcn() {
      try {
        var p = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Europe/Madrid', weekday: 'short',
          hour: '2-digit', minute: '2-digit', hour12: false
        }).formatToParts(new Date());
        var m = {};
        p.forEach(function (x) { m[x.type] = x.value; });
        var idx = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
        return { day: idx[m.weekday], h: (parseInt(m.hour, 10) % 24) + parseInt(m.minute, 10) / 60 };
      } catch (_) {
        var n = new Date();
        return { day: n.getDay(), h: n.getHours() + n.getMinutes() / 60 };
      }
    }

    var t = ahoraBcn();
    var hoy = horario[t.day];
    var open = !!hoy && t.h >= hoy[0] && t.h < hoy[1];

    var texto;
    if (open) {
      texto = 'Abierto · cierra a las ' + fmt(hoy[1]);
    } else if (hoy && t.h < hoy[0]) {
      texto = 'Abre a las ' + fmt(hoy[0]); // abre hoy, más tarde
    } else {
      texto = 'Cerrado';
      for (var i = 1; i <= 7; i++) {
        var d = (t.day + i) % 7;
        if (horario[d]) {
          texto = 'Abre ' + (i === 1 ? 'mañana' : 'el ' + dias[d]) + ' a las ' + fmt(horario[d][0]);
          break;
        }
      }
    }

    badge.textContent = texto;
    badge.className = 'open-badge is-ready open-badge--' + (open ? 'open' : 'closed');
  })();

  /* ---------- Header: fondo al hacer scroll ---------- */
  var header = document.querySelector('.site-header');
  // Si el header está en modo overlay (sobre la foto del hero) esperamos
  // a pasar el hero antes de pintar el fondo crema; si no, umbral corto.
  var isOverlay = header && header.classList.contains('site-header--overlay');
  var scrolledThreshold = isOverlay ? 80 : 24;
  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > scrolledThreshold);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Nav móvil ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
  }
  function openNav() {
    if (!nav || !toggle) return;
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú');
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) closeNav();
      else openNav();
    });
    // Cerrar al elegir un destino
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });
    // Cerrar con Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  // Stagger generalizado: índice por hermano dentro de cada contenedor.
  revealEls.forEach(function (el) {
    var p = el.parentElement;
    if (!p) return;
    if (p.__rvl == null) p.__rvl = 0;
    el.style.setProperty('--rvl-i', Math.min(p.__rvl, 6));
    p.__rvl++;
  });
  function revealAll() {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });

    // Red de seguridad: si por alguna razón el observer no marcó nada,
    // mostramos todo para que el contenido nunca quede invisible.
    setTimeout(function () {
      if (document.querySelectorAll('.reveal.is-visible').length === 0) revealAll();
    }, 2000);
  }

  /* ---------- Form de reserva → arma un mailto ---------- */
  var form = document.getElementById('reserva-form');
  var hint = document.getElementById('rf-hint');

  // No se pueden reservar fechas pasadas
  var fechaInput = document.getElementById('rf-fecha');
  if (fechaInput) {
    try { fechaInput.min = new Date().toISOString().slice(0, 10); } catch (_) {}
  }

  function setHint(msg, state) {
    if (!hint) return;
    hint.textContent = msg;
    hint.classList.remove('is-error', 'is-ok');
    if (state) hint.classList.add(state);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validación nativa + foco al primer error
      if (!form.checkValidity()) {
        var firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        setHint('Revisá los campos marcados para completar la reserva.', 'is-error');
        return;
      }

      var data = new FormData(form);
      var nombre = (data.get('nombre') || '').toString().trim();
      var fecha = (data.get('fecha') || '').toString();
      var hora = (data.get('hora') || '').toString();
      var personas = (data.get('personas') || '').toString();
      var tel = (data.get('telefono') || '').toString().trim();
      var email = (data.get('email') || '').toString().trim();
      var notas = (data.get('notas') || '').toString().trim();

      // Fecha legible (es-ES) sin romper por zona horaria
      var fechaTxt = fecha;
      if (fecha) {
        var parts = fecha.split('-');
        if (parts.length === 3) {
          var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
          try {
            fechaTxt = new Intl.DateTimeFormat('es-ES', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            }).format(d);
          } catch (_) { fechaTxt = fecha; }
        }
      }

      var asunto = 'Reserva en ARAU · ' + nombre + ' · ' + fechaTxt + ' ' + hora;
      var cuerpo =
        '¡Hola ARAU! Quiero reservar una mesa.\n\n' +
        'Nombre: ' + nombre + '\n' +
        'Fecha: ' + fechaTxt + '\n' +
        'Hora: ' + hora + '\n' +
        'Comensales: ' + personas + '\n' +
        'Teléfono: ' + tel + '\n' +
        'Email: ' + email + '\n' +
        (notas ? 'Notas: ' + notas + '\n' : '') +
        '\n¡Gracias!';

      var mailto = 'mailto:hola@araubrunch.com'
        + '?subject=' + encodeURIComponent(asunto)
        + '&body=' + encodeURIComponent(cuerpo);

      // 1) Intentamos enviarlo por Netlify Forms (llega solo, sin abrir el mail).
      // 2) Si no estamos en Netlify (preview local), caemos al mailto de respaldo.
      setHint('Enviando tu solicitud…');
      var body = new URLSearchParams(new FormData(form)).toString();
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
      }).then(function (r) {
        if (!r.ok) throw new Error('sin-netlify');
        form.reset();
        var d = document.getElementById('rf-fecha');
        if (d) { try { d.min = new Date().toISOString().slice(0, 10); } catch (_) {} }
        if (parseInt(personas, 10) <= 4) {
          setHint('¡Reserva confirmada! Te esperamos el ' + fechaTxt + ' a las ' + hora + '. Cualquier cambio, escribinos por WhatsApp.', 'is-ok');
        } else {
          setHint('¡Recibimos tu solicitud para ' + personas + ' personas! Al ser un grupo grande, te confirmamos la disponibilidad por mail o WhatsApp en el día.', 'is-ok');
        }
      }).catch(function () {
        window.location.href = mailto;
        setHint('Abrimos tu correo con la solicitud. Si no se abre, escribinos a hola@araubrunch.com.', 'is-ok');
      });
    });
  }

  /* ---------- Lightbox (galería + platos + eventos) ---------- */
  (function () {
    var dlg = document.getElementById('lightbox');
    if (!dlg || typeof dlg.showModal !== 'function') return;
    var imgEl = document.getElementById('lightbox-img');
    var capEl = document.getElementById('lightbox-cap');
    var countEl = document.getElementById('lightbox-count');
    var items = [];
    var idx = 0;
    var lastFocus = null;

    function preload(src) { if (src) { var im = new Image(); im.src = src; } }

    function show(n) {
      if (!items.length) return;
      idx = (n + items.length) % items.length;
      var b = items[idx];
      imgEl.src = b.getAttribute('data-full');
      var innerImg = b.querySelector('img');
      imgEl.alt = innerImg ? innerImg.alt : '';
      capEl.textContent = b.getAttribute('data-caption') || '';
      countEl.textContent = (idx + 1) + ' / ' + items.length;
      // precargar vecinas
      preload(items[(idx + 1) % items.length].getAttribute('data-full'));
      preload(items[(idx - 1 + items.length) % items.length].getAttribute('data-full'));
    }

    var prevBtn = dlg.querySelector('.lightbox__prev');
    var nextBtn = dlg.querySelector('.lightbox__next');

    function openFrom(btn) {
      var g = btn.getAttribute('data-gallery');
      items = Array.prototype.slice.call(
        document.querySelectorAll('.thumb[data-gallery="' + g + '"]')
      );
      // Con una sola foto no tiene sentido mostrar flechas ni contador
      var single = items.length <= 1;
      if (prevBtn) prevBtn.style.display = single ? 'none' : '';
      if (nextBtn) nextBtn.style.display = single ? 'none' : '';
      if (countEl) countEl.style.display = single ? 'none' : '';
      lastFocus = btn;
      show(items.indexOf(btn));
      dlg.showModal();
    }

    document.querySelectorAll('.thumb').forEach(function (b) {
      b.addEventListener('click', function () { openFrom(b); });
    });

    dlg.addEventListener('click', function (e) {
      var act = e.target.closest('[data-lb]');
      if (act) {
        var a = act.getAttribute('data-lb');
        if (a === 'next') show(idx + 1);
        else if (a === 'prev') show(idx - 1);
        else if (a === 'close') dlg.close();
        return;
      }
      // clic en el fondo (fuera de la figura) cierra
      if (!e.target.closest('.lightbox__fig')) dlg.close();
    });

    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1); }
    });

    // swipe en táctil
    var sx = 0;
    dlg.addEventListener('pointerdown', function (e) { sx = e.clientX; });
    dlg.addEventListener('pointerup', function (e) {
      var d = e.clientX - sx;
      if (Math.abs(d) > 40) show(d < 0 ? idx + 1 : idx - 1);
    });

    dlg.addEventListener('close', function () {
      imgEl.src = '';
      if (lastFocus) lastFocus.focus();
    });
  })();

  /* ---------- Scroll-spy: nav activo ---------- */
  (function () {
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav__list a[href^="#"]'));
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    var sections = [];
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var sec = id && document.getElementById(id);
      if (sec) { map[id] = a; sections.push(sec); }
    });
    if (!sections.length) return;
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (a) { a.removeAttribute('aria-current'); });
          var a = map[entry.target.id];
          if (a) a.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  })();

  /* ---------- Mapa: carga diferida al hacer clic (privacidad) ---------- */
  (function () {
    var btn = document.getElementById('map-embed');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var ifr = document.createElement('iframe');
      ifr.title = 'Mapa de ARAU en Carrer de Provença 322, Barcelona';
      ifr.src = btn.getAttribute('data-map');
      ifr.loading = 'lazy';
      ifr.referrerPolicy = 'no-referrer-when-downgrade';
      ifr.setAttribute('width', '100%');
      ifr.setAttribute('height', '460');
      btn.replaceWith(ifr);
    });
  })();

  /* ---------- Barra de acción fija (móvil) ---------- */
  (function () {
    var bar = document.getElementById('cta-bar');
    if (!bar || !('IntersectionObserver' in window)) return;
    var hero = document.querySelector('.hero');
    var reservar = document.getElementById('reservar');
    var pastHero = false;
    var atForm = false;
    function update() {
      var shouldShow = pastHero && !atForm;
      bar.classList.toggle('is-visible', shouldShow);
      bar.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
    }
    if (hero) {
      new IntersectionObserver(function (e) {
        pastHero = !e[0].isIntersecting;
        update();
      }, { threshold: 0 }).observe(hero);
    }
    if (reservar) {
      new IntersectionObserver(function (e) {
        atForm = e[0].isIntersecting;
        update();
      }, { threshold: 0 }).observe(reservar);
    }
  })();

  /* ---------- Palabra cinética del hero (AR × AU) ---------- */
  (function () {
    var swap = document.getElementById('hero-swap');
    if (!swap || reduceMotion) return;
    var words = swap.querySelectorAll('.swap__w');
    if (words.length < 2) return;
    var i = 0, timer = null;
    function tick() {
      words[i].classList.remove('is-on');
      i = (i + 1) % words.length;
      words[i].classList.add('is-on');
    }
    function start() { stop(); timer = setInterval(tick, 3500); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    start();
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });
  })();

  /* ---------- Galería: carrusel continuo y centrado ---------- */
  (function () {
    var carousel = document.querySelector('.galeria__carousel');
    var track = carousel && carousel.querySelector('[data-car="track"]');
    if (!carousel || !track) return;
    var reals = Array.prototype.slice.call(track.querySelectorAll('.galeria__item'));
    var N = reals.length;
    if (N < 2) return;
    var prevBtn = carousel.querySelector('[data-car="prev"]');
    var nextBtn = carousel.querySelector('[data-car="next"]');
    var dots = Array.prototype.slice.call(document.querySelectorAll('.galeria__dots [data-car-go]'));
    var smooth = reduceMotion ? 'auto' : 'smooth';

    // Clones para loop continuo: [cloneLast, S0..S(N-1), cloneFirst]
    var cloneFirst = reals[0].cloneNode(true);
    var cloneLast = reals[N - 1].cloneNode(true);
    [cloneFirst, cloneLast].forEach(function (c) {
      c.classList.remove('thumb');
      c.classList.add('galeria__item--clone');
      c.removeAttribute('data-gallery');
      c.setAttribute('aria-hidden', 'true');
      c.setAttribute('tabindex', '-1');
    });
    track.insertBefore(cloneLast, reals[0]);
    track.appendChild(cloneFirst);
    var slides = Array.prototype.slice.call(track.querySelectorAll('.galeria__item'));
    // DOM: 0 = cloneLast · 1..N = reales · N+1 = cloneFirst

    function centeredIndex() {
      var t = track.getBoundingClientRect();
      var c = t.left + t.width / 2, best = 0, bd = Infinity;
      slides.forEach(function (s, i) {
        var r = s.getBoundingClientRect();
        var d = Math.abs((r.left + r.width / 2) - c);
        if (d < bd) { bd = d; best = i; }
      });
      return best;
    }
    function centerOn(i, behavior) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      var t = track.getBoundingClientRect();
      var r = slides[i].getBoundingClientRect();
      track.scrollTo({ left: track.scrollLeft + (r.left + r.width / 2) - (t.left + t.width / 2), behavior: behavior || smooth });
    }
    function syncDots() {
      var rd = ((centeredIndex() - 1) % N + N) % N;
      dots.forEach(function (d, k) {
        var on = k === rd;
        d.classList.toggle('is-active', on);
        if (on) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
    }
    function reposition() {
      var c = centeredIndex();
      if (c === 0) centerOn(N, 'auto');                       // cloneLast -> último real
      else if (c === slides.length - 1) centerOn(1, 'auto');  // cloneFirst -> primer real
    }

    var hovering = false, pauseUntil = 0;
    function nudge() { pauseUntil = Date.now() + 8000; }
    function go(delta) { nudge(); centerOn(centeredIndex() + delta); }

    if (prevBtn) prevBtn.addEventListener('click', function () { go(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(1); });
    dots.forEach(function (d, k) { d.addEventListener('click', function () { nudge(); centerOn(k + 1); }); });
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });

    var ticking = false, repoTimer = null;
    track.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(function () { syncDots(); ticking = false; }); }
      if (repoTimer) clearTimeout(repoTimer);
      repoTimer = setTimeout(reposition, 140);
    }, { passive: true });

    var resizeTimer = null;
    window.addEventListener('resize', function () {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { centerOn(centeredIndex(), 'auto'); syncDots(); }, 150);
    }, { passive: true });

    // Autoplay continuo (pausa con hover, foco, interacción o pestaña oculta)
    carousel.addEventListener('mouseenter', function () { hovering = true; });
    carousel.addEventListener('mouseleave', function () { hovering = false; });
    carousel.addEventListener('focusin', function () { hovering = true; });
    carousel.addEventListener('focusout', function () { hovering = false; });
    carousel.addEventListener('touchstart', nudge, { passive: true });
    if (!reduceMotion) {
      setInterval(function () {
        if (!hovering && !document.hidden && Date.now() >= pauseUntil) centerOn(centeredIndex() + 1);
      }, 4500);
    }

    // Arranque centrado en el primer slide real
    function init() { centerOn(1, 'auto'); syncDots(); }
    init();
    requestAnimationFrame(init);
  })();
})();
