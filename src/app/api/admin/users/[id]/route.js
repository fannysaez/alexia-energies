import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Modifier un utilisateur OU un admin (PUT)
export async function PUT(req, { params }) {
    const { id } = params;
    const { email, role } = await req.json();
    if (!email || !role) {
        return NextResponse.json({ error: 'Email et rôle requis' }, { status: 400 });
    }
    try {
        // On tente d'abord sur user
        let updated = null;
        try {
            updated = await prisma.user.update({
                where: { id },
                data: { email, role },
            });
            return NextResponse.json({ user: updated });
        } catch (userErr) {
            // Si pas trouvé, on tente sur admin
            try {
                updated = await prisma.admin.update({
                    where: { id },
                    data: { email, role },
                });
                // Harmonise la réponse pour le front
                return NextResponse.json({
                    user: {
                        id: updated.id,
                        email: updated.email,
                        firstname: updated.firstName,
                        role: updated.role,
                        createdAt: updated.dateInscription
                    }
                });
            } catch (adminErr) {
                // Aucun trouvé
                return NextResponse.json({ error: 'Aucun utilisateur ou admin trouvé pour cet id.' }, { status: 404 });
            }
        }
    } catch (error) {
        console.error('Erreur modification utilisateur/admin:', error);
        return NextResponse.json({ error: error.message || 'Erreur lors de la modification' }, { status: 500 });
    }
}

// Supprimer un utilisateur OU un admin (DELETE)
export async function DELETE(req, { params }) {
    const { id } = params;
    try {
        // On tente d'abord sur user
        try {
            await prisma.user.delete({ where: { id } });
            return NextResponse.json({ success: true });
        } catch (userErr) {
            // Si pas trouvé, on tente sur admin
            try {
                await prisma.admin.delete({ where: { id } });
                return NextResponse.json({ success: true });
            } catch (adminErr) {
                return NextResponse.json({ error: 'Aucun utilisateur ou admin trouvé pour cet id.' }, { status: 404 });
            }
        }
    } catch (error) {
        return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
    }
}
