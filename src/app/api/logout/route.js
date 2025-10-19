import { NextResponse } from 'next/server';

export async function POST() {
    // Supprime le cookie d'authentification en définissant sa durée de vie à 0
    return NextResponse.json(
        { message: 'Déconnecté' }, // Message de confirmation de déconnexion
        {
            status: 200, // Code de statut HTTP pour une requête réussie
            headers: {
                // Supprime le cookie 'token' en le vidant et en définissant Max-Age à 0
                'Set-Cookie': 'token=; Path=/; HttpOnly; Max-Age=0',
            },
        }
    );
}
