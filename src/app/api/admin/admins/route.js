import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const admins = await prisma.admin.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                role: true
            }
        });
        return NextResponse.json({ admins });
    } catch (error) {
        return NextResponse.json({ error: 'Erreur lors de la récupération des admins.' }, { status: 500 });
    }
}
