/**
 * MARIAGE LOLA & VINCENT — JavaScript principal
 * Fonctionnalités : navigation, scroll, animations, formulaire RSVP
 */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────────
     1. NAVIGATION — opacité au scroll + menu mobile
     ────────────────────────────────────────────────────────── */
  const nav          = document.querySelector('.nav');
  const burger       = document.querySelector('.nav__burger');
  const menuMobile   = document.querySelector('.nav__mobile');
  const liensNav     = document.querySelectorAll('.nav__lien');

  /** Met à jour la classe de la nav selon la position du scroll */
  function majNav() {
    if (window.scrollY > 50) {
      nav.classList.add('nav--opaque');
      nav.classList.remove('nav--transparent');
    } else {
      nav.classList.remove('nav--opaque');
      nav.classList.add('nav--transparent');
    }
  }

  window.addEventListener('scroll', majNav, { passive: true });
  majNav(); // appel initial

  /** Ouvre/ferme le menu mobile */
  function toggleMenu() {
    const estOuvert = menuMobile.classList.toggle('ouvert');
    burger.classList.toggle('ouvert', estOuvert);
    burger.setAttribute('aria-expanded', estOuvert);
    document.body.style.overflow = estOuvert ? 'hidden' : '';
  }

  function fermerMenu() {
    menuMobile.classList.remove('ouvert');
    burger.classList.remove('ouvert');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (burger) {
    burger.addEventListener('click', toggleMenu);
  }

  /* Fermer le menu au clic sur un lien mobile */
  menuMobile.querySelectorAll('.nav__lien').forEach(function (lien) {
    lien.addEventListener('click', fermerMenu);
  });

  /* Fermer le menu si on clique en dehors */
  document.addEventListener('click', function (e) {
    if (
      menuMobile.classList.contains('ouvert') &&
      !menuMobile.contains(e.target) &&
      !burger.contains(e.target)
    ) {
      fermerMenu();
    }
  });

  /* ──────────────────────────────────────────────────────────
     2. LIEN ACTIF — IntersectionObserver sur les sections
     ────────────────────────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id], div[id].section-ancre');

  const observateurSections = new IntersectionObserver(
    function (entrees) {
      entrees.forEach(function (entree) {
        if (entree.isIntersecting) {
          const id = entree.target.id;
          liensNav.forEach(function (lien) {
            const cible = lien.getAttribute('href');
            lien.classList.toggle('actif', cible === '#' + id);
          });
        }
      });
    },
    {
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0,
    }
  );

  sections.forEach(function (section) {
    observateurSections.observe(section);
  });

  /* ──────────────────────────────────────────────────────────
     3. SMOOTH SCROLL pour les ancres internes
     ────────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (ancre) {
    ancre.addEventListener('click', function (e) {
      const cible = document.querySelector(this.getAttribute('href'));
      if (!cible) return;
      e.preventDefault();
      const navHauteur = nav ? nav.offsetHeight : 0;
      const y = cible.getBoundingClientRect().top + window.scrollY - navHauteur;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  /* ──────────────────────────────────────────────────────────
     4. ANIMATIONS AU SCROLL — IntersectionObserver
     ────────────────────────────────────────────────────────── */
  const elementsAnimes = document.querySelectorAll('.fade-in, .slide-droite, .slide-gauche');

  if (elementsAnimes.length > 0) {
    const observateurAnim = new IntersectionObserver(
      function (entrees) {
        entrees.forEach(function (entree) {
          if (entree.isIntersecting) {
            entree.target.classList.add('visible');
            observateurAnim.unobserve(entree.target); // une seule fois
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elementsAnimes.forEach(function (el) {
      observateurAnim.observe(el);
    });
  }

  /* ──────────────────────────────────────────────────────────
     5. HERO — léger effet Ken Burns au chargement
     ────────────────────────────────────────────────────────── */
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    // Ajouter la classe après un court délai pour déclencher la transition CSS
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        heroBg.classList.add('charge');
      });
    });
  }

  /* ──────────────────────────────────────────────────────────
     6. FORMULAIRE RSVP — envoi sans rechargement de page
     ────────────────────────────────────────────────────────── */
  const formulaire  = document.getElementById('rsvp-form');
  const succesMsg   = document.getElementById('rsvp-succes');

  if (formulaire) {
    formulaire.addEventListener('submit', function (e) {
      e.preventDefault();

      const bouton = formulaire.querySelector('.rsvp__bouton');
      bouton.disabled = true;
      bouton.textContent = 'Envoi en cours…';

      const donnees = new FormData(formulaire);
      const action  = formulaire.getAttribute('action');

      // On utilise fetch en mode no-cors :
      // → pas de réponse lisible (CORS Google), mais les données sont bien transmises.
      fetch(action, {
        method: 'POST',
        body: donnees,
        mode: 'no-cors',
      })
        .then(function () {
          // Succès présumé (no-cors = opaque response, toujours "ok")
          afficherSucces();
        })
        .catch(function () {
          // En cas d'erreur réseau, on redirige vers le formulaire Google
          window.open(
            'https://forms.gle/2HCAe8phxpbC6qot7',
            '_blank',
            'noopener,noreferrer'
          );
          bouton.disabled = false;
          bouton.textContent = 'Confirmer ma présence';
        });
    });
  }

  function afficherSucces() {
    if (formulaire && succesMsg) {
      formulaire.style.display = 'none';
      succesMsg.classList.add('visible');
      // Scroll vers le message de succès
      succesMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  /* ──────────────────────────────────────────────────────────
     7. CADEAUX — copier dans le presse-papiers
     ────────────────────────────────────────────────────────── */
  document.querySelectorAll('.cadeaux__copier').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cible = document.getElementById(btn.dataset.cible);
      if (!cible) return;
      var texte = cible.textContent.trim().replace(/\s+/g, ' ');
      navigator.clipboard.writeText(texte).then(function () {
        btn.classList.add('copie');
        btn.querySelector('span').textContent = 'Copié !';
        setTimeout(function () {
          btn.classList.remove('copie');
          btn.querySelector('span').textContent = 'Copier';
        }, 2000);
      });
    });
  });

  /* ──────────────────────────────────────────────────────────
     8. ANIMATION CHUTE — flocon au clic
     ────────────────────────────────────────────────────────── */

  var SELECTEUR_INTERACTIF = [
    'a', 'button', 'input', 'select', 'textarea', 'label',
    '[role="button"]', '[role="link"]', '[role="menuitem"]', '[role="tab"]',
    'summary', 'details', 'iframe', '.nav__lien',
  ].join(', ');

  function estInteractif(element) {
    return !!element.closest(SELECTEUR_INTERACTIF);
  }

  function creerFlocon(x, y) {
    var derive   = (Math.random() * 100 - 50).toFixed(1) + 'px';
    var rotation = (Math.random() * 20 + 5).toFixed(0) + 'deg';

    var img = document.createElement('img');
    img.className = 'flocon';
    img.src = "images/crepe.png";
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.style.left = (x - 33) + 'px';
    img.style.top  = (y - 33) + 'px';
    img.style.setProperty('--derive',   derive);
    img.style.setProperty('--rotation', rotation);

    document.body.appendChild(img);
    img.addEventListener('animationend', function () { img.remove(); }, { once: true });

    floconCount++;
    if (floconCount % 20 === 0) {
      declencherFeuArtifice();
    }
  }

  var floconCount = 0;

  function declencherFeuArtifice() {
    var img = document.createElement('img');
    img.className = 'flocon flocon--feu';
    img.src = 'images/crepe.png';
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    document.body.appendChild(img);
    img.addEventListener('animationend', function () { img.remove(); }, { once: true });
  }

  var isDragging = false;
  var lastX = 0, lastY = 0;

  document.addEventListener('mousedown', function (e) {
    if (estInteractif(e.target)) return;
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  });

  document.addEventListener('mouseup',    function () { isDragging = false; });
  document.addEventListener('mouseleave', function () { isDragging = false; });

  document.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    if (estInteractif(e.target)) return;
    var dx = e.clientX - lastX;
    var dy = e.clientY - lastY;
    if (Math.sqrt(dx * dx + dy * dy) >= 30) {
      creerFlocon(e.clientX, e.clientY);
      lastX = e.clientX;
      lastY = e.clientY;
    }
  });

  document.addEventListener('click', function (e) {
    if (estInteractif(e.target)) return;
    creerFlocon(e.clientX, e.clientY);
  });

  /* ──────────────────────────────────────────────────────────
     7. ACCESSIBILITÉ — piège de focus pour le menu mobile
     ────────────────────────────────────────────────────────── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuMobile.classList.contains('ouvert')) {
      fermerMenu();
      burger.focus();
    }
  });

})();
