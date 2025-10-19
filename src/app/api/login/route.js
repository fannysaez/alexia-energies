// src/app/api/login/route.js
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient(); // Initialisation du client Prisma pour la base de données

export async function POST(req) {
    try {
        const body = await req.json(); // Récupération du corps de la requête
        const { email, password } = body; // Extraction de l'email et du mot de passe
        
        // Recherche de l'utilisateur dans la table 'user'
        let user = await prisma.user.findUnique({ where: { email } });
        let userType = 'user'; // Type par défaut
        
        // Si l'utilisateur n'est pas trouvé, recherche dans la table 'admin'
        if (!user) {
            user = await prisma.admin.findUnique({ where: { email } });
            userType = 'admin'; // Mise à jour du type
        }
        
        // Vérification de l'existence de l'utilisateur et comparaison du mot de passe
        if (user && bcrypt.compareSync(password, user.password)) {
            // Création du payload pour le token JWT
            const payload = {
                id: user.id,
                email: user.email,
                firstname: user.firstname || user.firstname, // Gestion des deux formats de prénom
                role: user.role || userType // Utilisation du rôle ou du type d'utilisateur
            };
            
            console.log('Payload JWT:', payload); // Log du payload pour debug
            
            // Génération du token JWT
            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET, // Clé secrète depuis les variables d'environnement
                // { expiresIn: '72h' } // Durée de vie du token allongée à 72h
            );
            
            // Retour de la réponse de succès avec le token
            return NextResponse.json({
                message: 'Connexion réussie',
                token,
                role: payload.role
            }, { status: 200 });
        } else {
            // Retour d'erreur si les identifiants sont incorrects
            return NextResponse.json({ message: 'Email ou mot de passe invalide' }, { status: 401 });
        }
    } catch (error) {
        console.error('Erreur login:', error); // Log de l'erreur
        // Retour d'erreur serveur en cas d'exception
        return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
    }
}
