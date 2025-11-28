// Load editable content from content.json
fetch('content.json')
  .then(response => response.json())
  .then(data => {
    
    // ===================================
    // 1. Logique de la Page d'Accueil (index.html)
    // ===================================

    // Hero section
    const titleElement = document.getElementById('title');
    const subtitleElement = document.getElementById('subtitle');
    if (titleElement) titleElement.textContent = data.hero.title;
    if (subtitleElement) subtitleElement.textContent = data.hero.subtitle;

    // Modules
    const container = document.getElementById('modules-container');
    if(container) {
        container.innerHTML = '';
        data.modules.forEach(mod => {
            const card = document.createElement('a'); 
            // Lien vers la page de détail du module
            card.href = `module-intro.html?module=${encodeURIComponent(mod.titre)}`; 
            
            card.className = 'module-card fade-in';
            // Assure le retour à la ligne dans la description
            card.innerHTML = `
                <h3>${mod.titre}</h3>
                <p>${mod.description.replace(/\*\*\n\*\*/g, '<br>')}</p>
            `;
            container.appendChild(card);
        });
    }

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
          <a href="index.html#boite-a-outils" class="cta">Choisir ce forfait</a>
        `;
        pricingContainer.appendChild(card);
      });
    }

    // NOUVEAU: Boîte à outils
    if (data.boiteOutils) {
        if(document.getElementById('boite-outils-title')) document.getElementById('boite-outils-title').textContent = data.boiteOutils.title;
        if(document.getElementById('boite-outils-description')) document.getElementById('boite-outils-description').textContent = data.boiteOutils.description;
        
        const listContainer = document.getElementById('boite-outils-list');
        if (listContainer) {
            // Ajoute une coche et formate la liste des ressources
            listContainer.innerHTML = data.boiteOutils.items.map(item => `<li>✅ ${item}</li>`).join('');
        }
    }


    // About & Footer
    if(document.getElementById('apropos-text')) document.getElementById('apropos-text').textContent = data.apropos;
    if(document.getElementById('footer-text')) document.getElementById('footer-text').textContent = data.footer;
  })
  .catch(error => console.error('Erreur de chargement de content.json:', error));

// GESTION FORMULAIRE (Non modifié)
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('subscription-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitButton = form.querySelector('.submit-button');
            const originalText = submitButton.textContent;
            
            // Simulation d'envoi
            submitButton.classList.add('loading');
            submitButton.disabled = true;

            setTimeout(() => {
                submitButton.classList.remove('loading');
                submitButton.classList.add('success');
                submitButton.textContent = '✅ Inscription enregistrée !';
                
                // Rétablit l'état du bouton après un délai
                setTimeout(() => {
                    submitButton.classList.remove('success');
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 2000);
            }, 1000); // 1 seconde de "chargement"
        });
    }
});

// ===================================
// 2. Logique de la Page Détails Module (module-intro.html)
// ===================================

// Rendre cette fonction globale pour qu'elle soit accessible dans module-intro.html
window.loadModuleDetail = function(moduleTitle) {
    fetch('content.json')
        .then(response => response.json())
        .then(data => {
            const module = data.modules.find(m => m.titre === moduleTitle);
            if (!module) return;

            document.getElementById('module-title').textContent = module.titre;
            document.getElementById('module-header-title').textContent = module.titre;
            
            // Enlève le formatage Markdown de la description dans le sous-titre du Hero
            document.getElementById('module-header-subtitle').textContent = module.description.replace(/\*\*\n\*\*/g, ' ').replace('Voir plus...', '');
            
            // Description Complète (on suppose que window.formatContent existe dans utils.js)
            document.getElementById('module-description-long').innerHTML = window.formatContent ? window.formatContent(module.descriptionLongue) : module.descriptionLongue;
            
            // Points clés
            const list = document.getElementById('key-points-list');
            // Utilise la liste de keyPoints du JSON
            list.innerHTML = module.keyPoints ? module.keyPoints.map(point => `<li>${window.processText ? window.processText(point) : point}</li>`).join('') : '';

            // Sidebar
            document.getElementById('sidebar-duree').textContent = module.duree || 'N/D';
            // Utilise la fonction de création de liste (on suppose qu'elle est dans utils.js)
            document.getElementById('sidebar-activites').innerHTML = window.createUlList ? window.createUlList(module.activites) : module.activites.map(a => `<li>${a}</li>`).join('');
            
            // Image
            const imageContainer = document.getElementById('module-image-container');
            if (module.image && module.image.startsWith('http')) {
                imageContainer.style.backgroundImage = `url('${module.image}')`;
            } else {
                // Image par défaut si aucune URL n'est fournie
                imageContainer.style.backgroundImage = `url('https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg')`;
            }
        })
        .catch(error => console.error('Erreur module:', error));
}
