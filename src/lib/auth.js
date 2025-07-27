// Détection simple de connexion via le cookie "token" côté client
export function isLoggedIn() {
    if (typeof window === 'undefined') return false;
    return document.cookie.split(';').some((c) => c.trim().startsWith('token='));
}
