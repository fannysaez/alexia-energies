import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

function isStrongPassword(password_admin) {
    const lengthCheck = password_admin.length >= 8;
    const lowercaseCheck = /[a-z]/.test(password_admin);
    const uppercaseCheck = /[A-Z]/.test(password_admin);
    const digitCheck = /\d/.test(password_admin);
    const specialCharCheck = /[@$!%*?&]/.test(password_admin);

    return {
        isValid: lengthCheck && lowercaseCheck && uppercaseCheck && digitCheck && specialCharCheck,
        lengthCheck,
        lowercaseCheck,
        uppercaseCheck,
        digitCheck,
        specialCharCheck
    };
}
export async function POST(req) {
    try {
        // Vérification du token JWT dans le header Authorization
        const authHeader = req.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Token manquant.' }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            return NextResponse.json({ error: 'Token invalide.' }, { status: 401 });
        }
        if (payload.role !== 'admin') {
            return NextResponse.json({ error: 'Accès interdit. Seul un admin peut créer un admin.' }, { status: 403 });
        }

        const { email, password, firstName, role } = await req.json();
        if (!email || !password) {
            return NextResponse.json({ error: 'Email et mot de passe requis.' }, { status: 400 });
        }

        // Vérification de la force du mot de passe
        const validationMotDePasse = isStrongPassword(password);
        if (!validationMotDePasse.isValid) {
            let errorMessage = 'Le mot de passe doit contenir';
            if (!validationMotDePasse.lengthCheck) errorMessage += ' au moins 8 caractères';
            if (!validationMotDePasse.uppercaseCheck) errorMessage += ' au moins une majuscule';
            if (!validationMotDePasse.lowercaseCheck) errorMessage += ' au moins une minuscule';
            if (!validationMotDePasse.digitCheck) errorMessage += ' au moins un chiffre';
            if (!validationMotDePasse.specialCharCheck) errorMessage += ' au moins un caractère spécial';
            return NextResponse.json({ error: errorMessage }, { status: 402 });
        }

        // Vérifier si l'admin existe déjà
        const existingAdmin = await prisma.admin.findUnique({ where: { email } });
        if (existingAdmin) {
            return NextResponse.json({ error: 'Cet email est déjà utilisé.' }, { status: 409 });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création de l'utilisateur ou admin selon le rôle
        const userRole = role === 'admin' ? 'admin' : 'user';
        const user = await prisma.admin.create({
            data: {
                email,
                password: hashedPassword,
                firstName: firstName || (userRole === 'admin' ? 'admin' : 'user'),
                role: userRole,
            },
        });

        return NextResponse.json({ message: `${userRole === 'admin' ? 'Admin' : 'Utilisateur'} créé avec succès`, user: { id: user.id, email: user.email, firstName: user.firstName, role: user.role } }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Erreur lors de la création de l’admin.' }, { status: 500 });
    }
}
