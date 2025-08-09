import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { email, password, firstname } = await req.json();

        console.log("🔧 Création d'un utilisateur test:", email);

        if (!email || !password || !firstname) {
            return NextResponse.json({
                error: "Email, mot de passe et prénom requis"
            }, { status: 400 });
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({
                error: "Utilisateur déjà existant",
                user: { email: existingUser.email, firstname: existingUser.firstname }
            }, { status: 200 });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer l'utilisateur
        const user = await prisma.user.create({
            data: {
                email,
                firstname,
                password: hashedPassword,
                role: "USER"
            }
        });

        console.log("✅ Utilisateur créé:", user.email);

        return NextResponse.json({
            success: true,
            message: "Utilisateur créé avec succès",
            user: { email: user.email, firstname: user.firstname }
        });

    } catch (error) {
        console.error("❌ Erreur création utilisateur:", error);
        return NextResponse.json({
            error: error.message
        }, { status: 500 });
    }
}
