/**
 * Crée un contenu HTML formaté à partir d'un tableau de chaînes ou d'une chaîne simple.
 *
 * Règles de formatage :
 * 1. Si l'entrée est un tableau (provenant de descriptionLongue/keyPoints), il crée :
 * - Une liste <ul> si tous les éléments ne contiennent pas d'espace (ex: Liste de points courts).
 * - Des paragraphes <p> pour chaque élément du tableau.
 * 2. Remplace le marqueur **\n** par un <br> pour un saut de ligne forcé dans une chaîne.
 *
 * @param {string|string[]} content Le contenu brut du JSON.
 * @returns {string} Le contenu HTML formaté.
 */
function formatContent(content) {
    if (Array.isArray(content)) {
        // Option A: Rendre en tant que liste <ul> si les éléments sont courts et ressemblent à des listes
        const isListFormat = content.every(item => item.length < 100 && !item.includes(':')); 

        if (isListFormat) {
            return `<ul>${content.map(item => `<li>${item.replace(/\*\*\n\*\*/g, '<br>')}</li>`).join('')}</ul>`;
        } else {
            // Option B: Rendre chaque élément comme un paragraphe
            return content.map(item => `<p>${item.replace(/\*\*\n\*\*/g, '<br>')}</p>`).join('');
        }
    } else if (typeof content === 'string') {
        // Rendre en tant que paragraphe si c'est une chaîne simple
        return `<p>${content.replace(/\*\*\n\*\*/g, '<br>')}</p>`;
    }
    return '';
}

/**
 * Crée une liste HTML <ul> à partir d'un tableau de chaînes, remplaçant **\n** par <br>.
 * Utilisé spécifiquement pour la barre latérale "Activités".
 *
 * @param {string[]} array Le tableau d'éléments d'activité.
 * @returns {string} Le contenu HTML <ul> formaté.
 */
function createUlList(array) {
    if (!Array.isArray(array)) return '';
    
    // Règle: Si un élément contient ':', on le considère comme un titre/niveau supérieur
    let html = '<ul>';
    let isSublist = false;

    array.forEach(item => {
        const itemText = item.replace(/\*\*\n\*\*/g, '<br>');
        
        // Simple heuristique pour les sous-listes (si l'élément est court et sans ':')
        if (itemText.length < 50 && !itemText.includes(':') && isSublist) {
            html += `<li>- ${itemText}</li>`;
        } else {
            if (isSublist) {
                // Fermer la sous-liste si on revient à un élément plus long
                html += '</ul>';
            }
            html += `<li>${itemText}</li>`;
        }
        isSublist = itemText.length < 50 && !itemText.includes(':');
    });

    if (isSublist) {
        html += '</ul>';
    }

    return html;
}

// Rendre la fonction accessible globalement pour les scripts des pages HTML
window.formatContent = formatContent;
window.createUlList = createUlList;
