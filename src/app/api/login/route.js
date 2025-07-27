// src/app/api/login/route.js
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, password } = body;
        let user = await prisma.user.findUnique({ where: { email } });
        let userType = 'user';
        if (!user) {
            user = await prisma.admin.findUnique({ where: { email } });
            userType = 'admin';
        }
        if (user && bcrypt.compareSync(password, user.password)) {
            const payload = {
                id: user.id,
                email: user.email,
                firstname: user.firstname || user.firstName,
                role: user.role || userType
            };
            console.log('Payload JWT:', payload);
            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                // { expiresIn: '72h' } // Durée de vie du token allongée à 72h
            );
            return NextResponse.json({
                message: 'Connexion réussie',
                token,
                role: payload.role
            }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Email ou mot de passe invalide' }, { status: 401 });
        }
    } catch (error) {
        console.error('Erreur login:', error);
        return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
    }
}
