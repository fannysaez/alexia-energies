import { NextResponse } from 'next/server';
import { verifyJWT } from '../middleware/route';

export async function GET(request) {
    const error = verifyJWT(request);
    if (error) return error;

    // Vérification du rôle admin
    if (!request.user || request.user.role !== 'admin') {
        // On ne renvoie plus de message d'erreur explicite
        return NextResponse.json({}, { status: 403 });
    }

    return NextResponse.json({ user: request.user });
}