import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

// Clé secrète pour signer/vérifier les JWT, récupérée depuis les variables d'environnement
const SECRET = process.env.JWT_SECRET || 'votre_secret';

// Fonction pour vérifier la validité d'un token JWT
export function verifyJWT(req) {
    try {
        // Récupération de l'en-tête Authorization de la requête
        const authHeader = req.headers.get('authorization');
        
        // Vérification que l'en-tête existe et commence par "Bearer "
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return { isValid: false, error: 'Token manquant' };
        }
        
        // Extraction du token en supprimant "Bearer " du début
        const token = authHeader.split(' ')[1];
        
        // Vérification et décodage du token avec la clé secrète
        const decoded = jwt.verify(token, SECRET);
        
        // Ajout des données utilisateur décodées à la requête
        req.user = decoded;
        
        // Retour d'un objet indiquant que le token est valide avec les données utilisateur
        return { isValid: true, user: decoded };
    } catch (err) {
        // En cas d'erreur (token expiré, invalide, etc.), retour d'un objet d'erreur
        return { isValid: false, error: 'Token invalide' };
    }
}
