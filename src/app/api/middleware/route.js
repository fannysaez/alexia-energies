import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const SECRET = process.env.JWT_SECRET || 'votre_secret';

export function verifyJWT(req) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return { isValid: false, error: 'Token manquant' };
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        return { isValid: true, user: decoded };
    } catch (err) {
        return { isValid: false, error: 'Token invalide' };
    }
}
