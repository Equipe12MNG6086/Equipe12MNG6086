/**
 * Utilitaires pour le formatage du contenu.
 */

// 1. Fonction pour traiter le texte (Gras et Sauts de ligne)
function processText(text) {
    if (!text) return '';
    
    let processed = text;
    
    // Remplace le marqueur de saut de ligne **\n** par <br> d'abord
    processed = processed.replace(/\*\*\\n\*\*/g, '<br>'); 
    processed = processed.replace(/\*\*\n\*\*/g, '<br>'); 
    
    // CORRECTION : Remplace **texte** par <strong>texte</strong> pour le GRAS
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    return processed;
}

/**
 * 2. Crée le contenu principal (Paragraphes ou Liste à puces standard)
 */
function formatContent(content) {
    if (Array.isArray(content)) {
        const isListFormat = content.every(item => item.length < 100 && !item.includes(':')); 

        if (isListFormat) {
            return `<ul>${content.map(item => `<li>${processText(item)}</li>`).join('')}</ul>`;
        } else {
            return content.map(item => `<p>${processText(item)}</p>`).join('');
        }
    } else if (typeof content === 'string') {
        return `<p>${processText(content)}</p>`;
    }
    return '';
}

/**
 * 3. Crée une liste HTML propre pour la sidebar (Activités)
 */
function createUlList(array) {
    if (!Array.isArray(array)) return '';
    
    let html = '<ul>';
    array.forEach(item => {
        let text = processText(item);
        
        // Nettoyage : Si l'élément commence par un tiret "-", on l'enlève pour mettre une puce propre
        if (text.trim().startsWith('-')) {
            text = text.trim().substring(1).trim();
            // On ajoute une puce visuelle
            html += `<li>• ${text}</li>`;
        } else {
            html += `<li>• ${text}</li>`;
        }
    });
    html += '</ul>';
    return html;
}

// Exposer les fonctions globalement
window.formatContent = formatContent;
window.createUlList = createUlList;
