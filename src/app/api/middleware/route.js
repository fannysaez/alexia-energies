import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const SECRET = process.env.JWT_SECRET || 'votre_secret';

export function verifyJWT(req) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        return null; // Pas d'erreur, continuer
    } catch (err) {
        return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }
}
