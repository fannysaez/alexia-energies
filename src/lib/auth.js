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
