// Load editable content from content.json
fetch('content.json')
  .then(response => response.json())
  .then(data => {
    // Hero section
    document.getElementById('title').textContent = data.hero.title;
    document.getElementById('subtitle').textContent = data.hero.subtitle;

    // Modules
    const container = document.getElementById('modules-container');
    container.innerHTML = '';
    data.modules.forEach(mod => {
      const card = document.createElement('div');
      card.className = 'module-card';
      card.innerHTML = `
        <h3>${mod.titre}</h3>
        <p>${mod.description}</p>
      `;
      container.appendChild(card);
    });

    // About section
    document.getElementById('apropos-text').textContent = data.apropos;

    // Footer
    document.getElementById('footer-text').textContent = data.footer;
  })
  .catch(error => {
    console.error('Erreur de chargement du contenu:', error);
  });
