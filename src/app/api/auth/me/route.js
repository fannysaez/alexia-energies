import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function GET(req) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // On retourne un objet vide et un code 200 pour ne pas afficher d'erreur gênante
            return NextResponse.json({}, { status: 200 });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        let user = null;
        // On cherche d'abord dans admin
        user = await prisma.admin.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, firstName: true }
        });
        if (user) {
            user.role = "admin";
        } else {
            // Sinon, on cherche dans user
            user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: { id: true, email: true, firstname: true }
            });
            if (user) {
                user.firstName = user.firstname;
                delete user.firstname;
                user.role = "user";
            }
        }

        if (!user) {
            return NextResponse.json({}, { status: 200 });
        }

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({}, { status: 200 });
    }
}
