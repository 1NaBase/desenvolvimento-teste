// js/menu.js

// Menu mobile
const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.querySelector('nav[aria-label="Menu principal"]');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('hidden');
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
    menuToggle.setAttribute('aria-expanded', !expanded);
  });
}
