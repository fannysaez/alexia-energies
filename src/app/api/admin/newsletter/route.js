import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const inscriptions = await prisma.newsletter.findMany({
            orderBy: { dateInscription: 'desc' }
        });
        return NextResponse.json({ inscriptions });
    } catch (error) {
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
