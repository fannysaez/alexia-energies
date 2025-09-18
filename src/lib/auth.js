//src/lib/auth.js
// Détection simple de connexion via le cookie "token" côté client
export function isLoggedIn() {
    if (typeof window === 'undefined') return false;
    // Vérifie le cookie
    const hasCookie = document.cookie.split(';').some((c) => c.trim().startsWith('token='));
    // Vérifie le localStorage
    const hasLocalStorage = !!window.localStorage.getItem('token');
    return hasCookie || hasLocalStorage;
}

// Fonction pour vérifier si l'utilisateur connecté est un admin
export function isAdmin() {
    if (typeof window === 'undefined') return false;
    
    const token = window.localStorage.getItem('token');
    if (!token) return false;
    
    try {
        // Décoder le JWT pour récupérer les informations
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role === 'admin';
    } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
        return false;
    }
}

// Fonction pour vérifier si c'est un utilisateur normal (pas admin)
export function isUser() {
    return isLoggedIn() && !isAdmin();
}
