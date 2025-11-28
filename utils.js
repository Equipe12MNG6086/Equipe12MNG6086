/**
 * Utilitaires pour le formatage du contenu.
 */

// Fonction interne pour traiter le texte (Gras et Sauts de ligne)
function processText(text) {
    if (!text) return '';
    // 1. Remplace **texte** par <strong>texte</strong> (Gestion du gras)
    let processed = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // 2. Remplace le marqueur de saut de ligne **\n** par <br>
    processed = processed.replace(/\*\*\\n\*\*/g, '<br>'); // Cas échappé JSON
    processed = processed.replace(/\*\*\n\*\*/g, '<br>'); // Cas direct
    
    return processed;
}

/**
 * Crée un contenu HTML (paragraphes ou liste principale)
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
 * Crée une liste HTML propre pour la sidebar.
 * Gère automatiquement les sous-éléments commençant par tiret.
 */
function createUlList(array) {
    if (!Array.isArray(array)) return '';
    
    let html = '<ul>';
    array.forEach(item => {
        let text = processText(item);
        
        // Si l'élément commence par un tiret (ex: "- Présentation")
        if (text.trim().startsWith('-')) {
            // On retire le tiret pour le style propre
            text = text.trim().substring(1).trim();
            html += `<li>• ${text}</li>`;
        } else {
            html += `<li>${text}</li>`;
        }
    });
    html += '</ul>';
    return html;
}

window.formatContent = formatContent;
window.createUlList = createUlList;
