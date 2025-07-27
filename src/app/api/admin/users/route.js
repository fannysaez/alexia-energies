import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        // Récupère les users
        const users = await prisma.user.findMany({
            orderBy: { email: 'asc' },
            select: {
                id: true,
                email: true,
                firstname: true,
                role: true,
            }
        });

        // Récupère les admins
        const admins = await prisma.admin.findMany({
            orderBy: { email: 'asc' },
            select: {
                id: true,
                email: true,
                firstName: true,
                role: true,
                dateInscription: true
            }
        });
        // Harmonise les champs pour les admins
        const adminsFormatted = admins.map(a => ({
            id: a.id,
            email: a.email,
            firstname: a.firstName,
            role: 'admin', // rôle simplifié pour le front
            createdAt: a.dateInscription,
            type: 'admin'
        }));
        // Harmonise les users (ajoute createdAt null pour cohérence)
        const usersFormatted = users.map(u => ({
            ...u,
            createdAt: null,
            type: 'user'
        }));
        // Fusionne et filtre les doublons d'email (priorité à l'entrée admin)
        const all = [...adminsFormatted, ...usersFormatted];
        const uniqueUsers = [];
        const seenEmails = new Set();
        for (const u of all) {
            if (!seenEmails.has(u.email)) {
                uniqueUsers.push(u);
                seenEmails.add(u.email);
            }
        }
        return NextResponse.json({ users: uniqueUsers });
    } catch (error) {
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// Création d'un utilisateur
export async function POST(req) {
    try {
        const { email, firstname, role } = await req.json();
        if (!email || !firstname || !role) {
            return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
        }
        // Vérifie si l'email existe déjà
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: 'Cet email existe déjà.' }, { status: 400 });
        }
        // Génère un mot de passe temporaire (8 caractères alphanumériques)
        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        const created = await prisma.user.create({
            data: {
                email,
                firstname,
                role,
                password: hashedPassword,
            }
        });
        // Pour la sécurité, ne retourne pas le mot de passe hashé ni temporaire
        return NextResponse.json({ user: { id: created.id, email: created.email, firstname: created.firstname, role: created.role } });
    } catch (error) {
        // Affiche l'erreur réelle côté serveur pour debug
        console.error('Erreur création user:', error);
        return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
    }
}
