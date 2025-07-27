import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Modifier une inscription (PUT)
export async function PUT(req, { params }) {
    const { id } = params;
    const { email } = await req.json();
    if (!email) {
        return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }
    try {
        const updated = await prisma.newsletter.update({
            where: { id }, // id string (CUID)
            data: { email },
        });
        return NextResponse.json({ inscription: updated });
    } catch (error) {
        return NextResponse.json({ error: 'Erreur lors de la modification' }, { status: 500 });
    }
}

// Supprimer une inscription (DELETE)
export async function DELETE(req, { params }) {
    const { id } = params;
    try {
        await prisma.newsletter.delete({ where: { id } }); // id string (CUID)
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
    }
}
