// src/app/api/register/route.js
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { verifyJWT } from '../middleware/route';

function isStrongPassword(password) {
    const lengthCheck = password.length >= 8;
    const lowercaseCheck = /[a-z]/.test(password);
    const uppercaseCheck = /[A-Z]/.test(password);
    const digitCheck = /\d/.test(password);
    const specialCharCheck = /[@$!%*?&]/.test(password);
    return {
        isValid: lengthCheck && lowercaseCheck && uppercaseCheck && digitCheck && specialCharCheck,
        lengthCheck,
        lowercaseCheck,
        uppercaseCheck,
        digitCheck,
        specialCharCheck
    };
}

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, password, firstname } = body;
        // Vérifier si l'email existe déjà
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ message: 'Cet email est déjà utilisé' }, { status: 409 });
        }

        // Vérification de la robustesse du mot de passe
        const validationMotDePasse = isStrongPassword(password);
        if (!validationMotDePasse.isValid) {
            let errorMessage = 'Le mot de passe doit contenir';
            if (!validationMotDePasse.lengthCheck) errorMessage += ' au moins 8 caractères';
            if (!validationMotDePasse.uppercaseCheck) errorMessage += ' au moins une majuscule';
            if (!validationMotDePasse.lowercaseCheck) errorMessage += ' au moins une minuscule';
            if (!validationMotDePasse.digitCheck) errorMessage += ' au moins un chiffre';
            if (!validationMotDePasse.specialCharCheck) errorMessage += ' au moins un caractère spécial';
            return NextResponse.json({ message: errorMessage }, { status: 402 });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                firstname: firstname || undefined,
            },
        });
        return NextResponse.json({ message: 'Utilisateur créé avec succès', newUser }, { status: 200 });
    } catch (error) {
        console.error('Erreur register:', error);
        return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
    }
}

export async function GET(req) {
    const authResult = verifyJWT(req);
    if (!authResult.isValid) {
        return NextResponse.json({ error: authResult.error }, { status: 401 });
    }
    // Retourne la liste des utilisateurs (pour test uniquement)
    const users = await prisma.user.findMany({
        select: { id: true, email: true }
    });
    return NextResponse.json({ users }, { status: 200 });
}
