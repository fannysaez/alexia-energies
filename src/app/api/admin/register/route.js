import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

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
        const { email, password, firstName } = await req.json();
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

        // Création de l'admin
        const admin = await prisma.admin.create({
            data: {
                email,
                password: hashedPassword,
                firstName: firstName || 'admin',
                role: 'admin',
            },
        });

        return NextResponse.json({ message: 'Admin créé avec succès', admin: { id: admin.id, email: admin.email, firstName: admin.firstName, role: admin.role } }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Erreur lors de la création de l’admin.' }, { status: 500 });
    }
}
