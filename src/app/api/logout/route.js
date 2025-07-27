import { NextResponse } from 'next/server';

export async function POST() {
    // Supprime le cookie d'authentification
    return NextResponse.json(
        { message: 'Déconnecté' },
        {
            status: 200,
            headers: {
                'Set-Cookie': 'token=; Path=/; HttpOnly; Max-Age=0',
            },
        }
    );
}
