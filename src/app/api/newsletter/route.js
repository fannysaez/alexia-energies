import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
    try {
        const { email } = await request.json();
        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
        }
        // Vérifier si l'email existe déjà
        const exists = await prisma.newsletter.findUnique({ where: { email } });
        if (exists) {
            return NextResponse.json({ error: 'Cet email est déjà inscrit.' }, { status: 409 });
        }
        // Créer l'inscription
        const inscription = await prisma.newsletter.create({ data: { email } });
        return NextResponse.json({ success: true, inscription });
    } catch (error) {
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
