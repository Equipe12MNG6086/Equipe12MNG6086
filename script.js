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
    
    // Définition de la description longue utilisée pour la redirection
    const descriptionLongueCible = "Ce module présente en profondeur le fonctionnement du réseau de la santé au Québec, incluant l'historique, les missions principales, les CISSS/CIUSSS, les établissements partenaires, ainsi que les contraintes budgétaires et organisationnelles. Vous explorerez également les rôles des gestionnaires dans ce système complexe.";

    data.modules.forEach(mod => {
      const card = document.createElement('a'); // La carte est un lien (<a>)
      
      // Vérifie si la description longue correspond à la cible
      if (mod.descriptionLongue && mod.descriptionLongue.trim() === descriptionLongueCible.trim()) {
          card.href = 'module-intro.html'; // Lien vers la page de détail
      } else {
          card.href = 'page-modules.html'; // Lien par défaut
      }
      
      card.className = 'module-card fade-in';
      card.innerHTML = `
        <h3>${mod.titre}</h3>
        <p>${mod.description}</p>
      `;
      container.appendChild(card);
    });

    // Pricing section
    const pricingContainer = document.getElementById('pricing-container');
    if (pricingContainer && data.tarifs) {
      pricingContainer.innerHTML = '';
      data.tarifs.forEach(tarif => {
        const card = document.createElement('div');
        card.className = `pricing-card fade-in ${tarif.populaire ? 'popular' : ''}`;
        
        const featuresHtml = tarif.caracteristiques.map(feat => `<li>${feat}</li>`).join('');

        card.innerHTML = `
          <h3>${tarif.titre}</h3>
          <p class="price">${tarif.prix}</p>
          <ul>${featuresHtml}</ul>
          <a href="#inscription" class="cta">Choisir ce forfait</a>
        `;
        pricingContainer.appendChild(card);
      });
    }

    // About section
    document.getElementById('apropos-text').textContent = data.apropos;

    // Footer
    document.getElementById('footer-text').textContent = data.footer;
  })
  .catch(error => {
    console.error('Erreur de chargement du contenu:', error);
  });

// ====================================================
// GESTION DU FORMULAIRE D'INSCRIPTION AVEC ANIMATION
// ====================================================

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('subscription-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitButton = form.querySelector('.submit-button');
            const originalText = submitButton.textContent;
            
            // 1. État de chargement (Loading)
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

// ====================================================
// LOGIQUE DE CHARGEMENT DES PAGES DE DÉTAILS (pour module-intro.html)
// ====================================================

function loadModuleDetail(moduleTitle) {
    fetch('content.json')
        .then(response => response.json())
        .then(data => {
            // Trouver le module spécifique
            const module = data.modules.find(m => m.titre === moduleTitle);

            if (!module) {
                document.getElementById('module-header-title').textContent = "Module non trouvé";
                return;
            }

            // Mettre à jour les éléments de la page
            document.getElementById('module-title').textContent = module.titre;
            document.getElementById('module-header-title').textContent = module.titre;
            document.getElementById('module-header-subtitle').textContent = module.description;
            
            document.getElementById('module-description-long').textContent = module.descriptionLongue;
            
            // Simuler la liste des points clés
            const keyPoints = [
                "Structure et hiérarchie des CISSS/CIUSSS",
                "Cadre légal et rôle des gestionnaires",
                "Défis budgétaires et priorités organisationnelles",
                "Cartographie des acteurs clés (ministère, agences, etc.)"
            ];

            const list = document.getElementById('key-points-list');
            list.innerHTML = keyPoints.map(point => `<li>${point}</li>`).join('');
            
            // Afficher l'image
            const imageContainer = document.getElementById('module-image-container');
            if (module.image && module.image.startsWith('http')) {
                imageContainer.style.backgroundImage = `url('${module.image}')`;
            } else {
                imageContainer.style.backgroundImage = `url('placeholder-reseau-sante.jpg')`; 
            }

            // Footer
            document.getElementById('footer-text').textContent = data.footer;
        })
        .catch(error => {
            console.error('Erreur de chargement du module:', error);
        });
}
