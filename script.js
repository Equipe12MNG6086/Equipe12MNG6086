// Load editable content from content.json
fetch('content.json')
  .then(response => response.json())
  .then(data => {
    // Hero section
    document.getElementById('title').textContent = data.hero.title;
    document.getElementById('subtitle').textContent = data.hero.subtitle;

    // Modules
    const container = document.getElementById('modules-container');
    if(container) {
        container.innerHTML = '';
        const detailedModules = data.modules
            .filter(m => m.keyPoints && m.keyPoints.length > 0)
            .map(m => m.titre);

        data.modules.forEach(mod => {
        const card = document.createElement('a'); 
        if (detailedModules.includes(mod.titre)) {
            card.href = `module-intro.html?module=${encodeURIComponent(mod.titre)}`; 
        } else {
            card.href = 'page-modules.html'; 
        }
        
        card.className = 'module-card fade-in';
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
          <a href="#inscription" class="cta">Choisir ce forfait</a>
        `;
        pricingContainer.appendChild(card);
      });
    }

    // About & Footer
    if(document.getElementById('apropos-text')) document.getElementById('apropos-text').textContent = data.apropos;
    if(document.getElementById('footer-text')) document.getElementById('footer-text').textContent = data.footer;
  })
  .catch(error => console.error('Erreur:', error));

// GESTION FORMULAIRE
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('subscription-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitButton = form.querySelector('.submit-button');
            const originalText = submitButton.textContent;
            submitButton.classList.add('loading');
            submitButton.disabled = true;
            setTimeout(() => {
                submitButton.classList.remove('loading');
                submitButton.classList.add('success');
                submitButton.textContent = '✅ Inscription enregistrée !';
                setTimeout(() => {
                    submitButton.classList.remove('success');
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 2000);
            }, 1000);
        });
    }
});

// LOGIQUE DÉTAILS MODULE
function loadModuleDetail(moduleTitle) {
    fetch('content.json')
        .then(response => response.json())
        .then(data => {
            const module = data.modules.find(m => m.titre === moduleTitle);
            if (!module) return;

            document.getElementById('module-title').textContent = module.titre;
            document.getElementById('module-header-title').textContent = module.titre;
            document.getElementById('module-header-subtitle').textContent = module.description.replace(/\*\*\n\*\*/g, ' ');
            
            // Formatage Contenu
            document.getElementById('module-description-long').innerHTML = window.formatContent(module.descriptionLongue);
            
            // Points clés
            const list = document.getElementById('key-points-list');
            list.innerHTML = module.keyPoints ? module.keyPoints.map(point => `<li>${window.formatContent(point)}</li>`).join('') : '';

            // Sidebar
            document.getElementById('sidebar-duree').textContent = module.duree || 'N/D';
            document.getElementById('sidebar-activites').innerHTML = window.createUlList(module.activites);
            
            // Image
            const imageContainer = document.getElementById('module-image-container');
            if (module.image && module.image.startsWith('http')) {
                imageContainer.style.backgroundImage = `url('${module.image}')`;
            } else {
                imageContainer.style.backgroundImage = `url('https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg')`;
            }
        })
        .catch(error => console.error('Erreur module:', error));
}
