import { NextResponse } from 'next/server';
import { verifyJWT } from '../middleware/route';

export async function GET(request) {
    const authResult = verifyJWT(request);
    if (!authResult.isValid) {
        return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    // Vérification du rôle admin
    if (!authResult.user || authResult.user.role !== 'admin') {
        // On ne renvoie plus de message d'erreur explicite
        return NextResponse.json({}, { status: 403 });
    }

    return NextResponse.json({ user: authResult.user });
}