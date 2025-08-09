import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        console.log("🔍 Debug tokens - Recherche de tous les tokens actifs");

        // Récupérer tous les users avec des tokens
        const usersWithTokens = await prisma.user.findMany({
            where: {
                resetToken: {
                    not: null
                }
            },
            select: {
                id: true,
                email: true,
                resetToken: true,
                resetTokenExpiry: true
            }
        });

        // Récupérer tous les admins avec des tokens
        const adminsWithTokens = await prisma.admin.findMany({
            where: {
                resetToken: {
                    not: null
                }
            },
            select: {
                id: true,
                email: true,
                resetToken: true,
                resetTokenExpiry: true
            }
        });

        console.log("👥 Users avec tokens:", usersWithTokens.length);
        console.log("👔 Admins avec tokens:", adminsWithTokens.length);

        const now = new Date();

        const result = {
            timestamp: now.toISOString(),
            users: usersWithTokens.map(user => ({
                id: user.id,
                email: user.email,
                tokenPreview: user.resetToken ? user.resetToken.substring(0, 10) + "..." : null,
                tokenFull: user.resetToken,
                expiry: user.resetTokenExpiry,
                expired: user.resetTokenExpiry ? new Date(user.resetTokenExpiry) < now : false
            })),
            admins: adminsWithTokens.map(admin => ({
                id: admin.id,
                email: admin.email,
                tokenPreview: admin.resetToken ? admin.resetToken.substring(0, 10) + "..." : null,
                tokenFull: admin.resetToken,
                expiry: admin.resetTokenExpiry,
                expired: admin.resetTokenExpiry ? new Date(admin.resetTokenExpiry) < now : false
            }))
        };

        return NextResponse.json(result);

    } catch (error) {
        console.error("❌ Erreur debug tokens:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
