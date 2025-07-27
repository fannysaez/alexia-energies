import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function POST(req) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) {
            return NextResponse.json({ message: 'Email et mot de passe requis.' }, { status: 400 });
        }

        // Chercher l'utilisateur (admin ou user) par email
        const user = await prisma.admin.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ message: 'Identifiants invalides.' }, { status: 401 });
        }

        // Vérifier le mot de passe
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ message: 'Identifiants invalides.' }, { status: 401 });
        }

        // Générer un token JWT avec le rôle
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, firstName: user.firstName },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return NextResponse.json({
            message: 'Connexion réussie',
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName
            }
        });
    } catch (error) {
        return NextResponse.json({ message: 'Erreur lors de la connexion.' }, { status: 500 });
    }
}
