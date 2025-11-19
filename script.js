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
      card.className = 'module-card fade-in';
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

// ====================================================
// NOUVEAU SCRIPT : GESTION DU FORMULAIRE D'INSCRIPTION AVEC ANIMATION
// ====================================================

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('subscription-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitButton = form.querySelector('.submit-button');
            const originalText = submitButton.textContent;
            
            // 1. État de chargement (Loading)
            // Ajout de la classe 'loading' qui masque le texte et affiche le spinner CSS
            submitButton.classList.add('loading');
            submitButton.disabled = true;

            // Simuler un délai de soumission (pour la présentation)
            setTimeout(() => {
                // 2. Transition vers l'état de validation (Success)
                submitButton.classList.remove('loading');
                submitButton.classList.add('success');
                submitButton.textContent = '✅ Inscription enregistrée !';
                
                // Rétablir le bouton à son état initial après quelques secondes
                setTimeout(() => {
                    submitButton.classList.remove('success');
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 2000); // 2 secondes de succès

            }, 1000); // 1 seconde de chargement simulé
        });
    }
});
