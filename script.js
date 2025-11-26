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
    
    // Définition des modules qui auront une page de détail dédiée (module-intro.html)
    const detailedModules = [
        "Structure de la formation", 
        "Module 1: Se connaître comme nouveau gestionnaire"
    ];

    data.modules.forEach(mod => {
      const card = document.createElement('a'); // La carte est un lien (<a>)
      
      // Vérifie si le titre correspond à l'un des modules détaillés
      if (detailedModules.includes(mod.titre)) {
          // Utilise un paramètre d'URL pour indiquer quel module charger
          card.href = `module-intro.html?module=${encodeURIComponent(mod.titre)}`; 
      } else {
          card.href = 'page-modules.html'; // Lien par défaut vers la liste de tous les modules
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
                document.getElementById('module-header-subtitle').textContent = "Le contenu de ce module n'est pas disponible.";
                document.getElementById('module-description-long').textContent = "Veuillez vérifier l'URL ou retourner à la liste des modules.";
                document.getElementById('key-points-list').innerHTML = '';
                return;
            }

            // Mettre à jour les éléments de la page
            document.getElementById('module-title').textContent = module.titre;
            document.getElementById('module-header-title').textContent = module.titre;
            document.getElementById('module-header-subtitle').textContent = module.description;
            
            document.getElementById('module-description-long').textContent = module.descriptionLongue;
            
            // Définir les points clés spécifiques à chaque module
            let keyPoints = [];
            
            if (moduleTitle === "Structure de la formation") {
                 keyPoints = [
                    "Gestion du temps et des priorités (Urgence vs. Importance)",
                    "Prévention de l'épuisement professionnel (Stress et saturation)",
                    "Mobilisation d'équipe face au changement et à la pénurie",
                    "Communication efficace en contexte de pression",
                    "Renforcement de la confiance d'équipe"
                ];
            } else if (moduleTitle === "Module 1: Se connaître comme nouveau gestionnaire") {
                 keyPoints = [
                    "État du réseau de la santé : pénurie, surcharge, restructurations",
                    "Les défis spécifiques du rôle de gestionnaire",
                    "Les 7 comportements clés d’un leader efficace et comment le reconnaître",
                    "Notions de stress (Modèle Demande- Ressource)",
                    "Comprendre les types de gestion dans le réseau de la santé",
                    "Questionnaire: Quel type de gestionnaire suis-je ?",
                    "Discussion : Situation ou que le rôle dépassait les capacités",
                    "Analyse de cas : de signes de stress chez un employé"
                ];
            } else {
                // Défaut pour les autres modules
                 keyPoints = [
                    "Points clés en cours de préparation pour ce module."
                ];
            }


            const list = document.getElementById('key-points-list');
            list.innerHTML = keyPoints.map(point => `<li>${point}</li>`).join('');
            
            // Afficher l'image
            const imageContainer = document.getElementById('module-image-container');
            if (module.image && module.image.startsWith('http')) {
                imageContainer.style.backgroundImage = `url('${module.image}')`;
            } else {
                // Image de remplacement basée sur le module
                let placeholderImage = 'placeholder-reseau-sante.jpg';
                if (moduleTitle.includes('Module 1')) {
                     placeholderImage = 'placeholder-leadership.jpg';
                } else if (moduleTitle.includes('Objectifs')) {
                     placeholderImage = 'placeholder-goals.jpg';
                }
                
                imageContainer.style.backgroundImage = `url('${placeholderImage}')`; 
            }

            // Footer
            document.getElementById('footer-text').textContent = data.footer;
        })
        .catch(error => {
            console.error('Erreur de chargement du module:', error);
            document.getElementById('module-header-title').textContent = "Erreur de chargement";
        });
}
