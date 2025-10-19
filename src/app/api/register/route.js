// src/app/api/register/route.js
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { verifyJWT } from '../middleware/route';

// Fonction pour vérifier la robustesse d'un mot de passe
function isStrongPassword(password) {
    const lengthCheck = password.length >= 12; // Vérifie si le mot de passe fait au moins 12 caractères
    const lowercaseCheck = /[a-z]/.test(password); // Vérifie la présence d'au moins une minuscule
    const uppercaseCheck = /[A-Z]/.test(password); // Vérifie la présence d'au moins une majuscule
    const digitCheck = /\d/.test(password); // Vérifie la présence d'au moins un chiffre
    const specialCharCheck = /[@$!%*?&]/.test(password); // Vérifie la présence d'au moins un caractère spécial
    return {
        isValid: lengthCheck && lowercaseCheck && uppercaseCheck && digitCheck && specialCharCheck, // Mot de passe valide si tous les critères sont respectés
        lengthCheck,
        lowercaseCheck,
        uppercaseCheck,
        digitCheck,
        specialCharCheck
    };
}

const prisma = new PrismaClient(); // Initialisation du client Prisma pour la base de données

// Route POST pour l'inscription d'un nouvel utilisateur
export async function POST(req) {
    try {
        const body = await req.json(); // Récupération des données du corps de la requête
        const { email, password, firstname } = body; // Extraction des champs email, password et firstname
        
        // Vérifier si l'email existe déjà dans la base de données
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ message: 'Cet email est déjà utilisé' }, { status: 409 }); // Retourne une erreur si l'email existe déjà
        }

        // Vérification de la robustesse du mot de passe
        const validationMotDePasse = isStrongPassword(password);
        if (!validationMotDePasse.isValid) {
            // Construction du message d'erreur personnalisé selon les critères non respectés
            let errorMessage = 'Le mot de passe doit contenir';
            if (!validationMotDePasse.lengthCheck) errorMessage += ' au moins 12 caractères';
            if (!validationMotDePasse.uppercaseCheck) errorMessage += ' au moins une majuscule';
            if (!validationMotDePasse.lowercaseCheck) errorMessage += ' au moins une minuscule';
            if (!validationMotDePasse.digitCheck) errorMessage += ' au moins un chiffre';
            if (!validationMotDePasse.specialCharCheck) errorMessage += ' au moins un caractère spécial';
            return NextResponse.json({ message: errorMessage }, { status: 402 }); // Retourne le message d'erreur
        }

        // Hachage du mot de passe pour le stockage sécurisé
        const salt = bcrypt.genSaltSync(10); // Génération du sel avec une complexité de 10
        const hashedPassword = bcrypt.hashSync(password, salt); // Hachage du mot de passe avec le sel
        
        // Création du nouvel utilisateur dans la base de données
        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword, // Stockage du mot de passe haché
                firstname: firstname || undefined, // Stockage du prénom s'il est fourni
            },
        });
        return NextResponse.json({ message: 'Utilisateur créé avec succès', newUser }, { status: 200 }); // Confirmation de création
    } catch (error) {
        console.error('Erreur register:', error); // Log de l'erreur dans la console
        return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 }); // Retourne une erreur serveur générique
    }
}

// Route GET pour récupérer la liste des utilisateurs (nécessite une authentification)
export async function GET(req) {
    const authResult = verifyJWT(req); // Vérification du token JWT
    if (!authResult.isValid) {
        return NextResponse.json({ error: authResult.error }, { status: 401 }); // Retourne une erreur d'authentification si le token est invalide
    }
    // Retourne la liste des utilisateurs (pour test uniquement)
    const users = await prisma.user.findMany({
        select: { id: true, email: true } // Sélection uniquement des champs id et email pour la sécurité
    });
    return NextResponse.json({ users }, { status: 200 }); // Retourne la liste des utilisateurs
}
