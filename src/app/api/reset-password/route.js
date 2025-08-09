import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
    const { token, password } = await req.json();
    if (!token || !password) {
        return Response.json({ message: "Token et mot de passe requis." }, { status: 400 });
    }

    // Chercher l'utilisateur ou l'admin avec ce token
    let user = await prisma.user.findFirst({ where: { resetToken: token } });
    let role = "user";
    if (!user) {
        user = await prisma.admin.findFirst({ where: { resetToken: token } });
        role = "admin";
    }
    if (!user) {
        return Response.json({ message: "Token invalide." }, { status: 400 });
    }

    // Vérifier l'expiration du token
    if (!user.resetTokenExpiry || new Date(user.resetTokenExpiry) < new Date()) {
        return Response.json({ message: "Token expiré." }, { status: 400 });
    }

    // Hasher le nouveau mot de passe
    const hashed = await bcrypt.hash(password, 10);

    // Mettre à jour le mot de passe et supprimer le token
    if (role === "user") {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashed,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });
    } else {
        await prisma.admin.update({
            where: { id: user.id },
            data: {
                password: hashed,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });
    }

    return Response.json({ message: "Mot de passe réinitialisé avec succès." });
}
