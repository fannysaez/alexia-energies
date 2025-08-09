import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
    const { token, password } = await req.json();
    console.log("🔄 Reset password - Token reçu:", token ? token.substring(0, 10) + "..." : "MANQUANT");

    if (!token || !password) {
        console.log("❌ Token ou mot de passe manquant");
        return Response.json({ message: "Token et mot de passe requis." }, { status: 400 });
    }

    // Chercher l'utilisateur ou l'admin avec ce token
    console.log("🔍 Recherche du token dans la base...");
    let user = await prisma.user.findFirst({ where: { resetToken: token } });
    let role = "user";

    if (!user) {
        console.log("🔍 Token non trouvé dans users, recherche dans admins...");
        user = await prisma.admin.findFirst({ where: { resetToken: token } });
        role = "admin";
    }

    if (!user) {
        console.log("❌ Token non trouvé dans aucune table");
        return Response.json({ message: "Token invalide." }, { status: 400 });
    }

    console.log("✅ Utilisateur trouvé:", user.email, "Type:", role);

    // Vérifier l'expiration du token
    const now = new Date();
    const tokenExpiry = new Date(user.resetTokenExpiry);
    console.log("⏰ Token expire à:", tokenExpiry);
    console.log("⏰ Maintenant:", now);

    if (!user.resetTokenExpiry || tokenExpiry < now) {
        console.log("❌ Token expiré");
        return Response.json({ message: "Token expiré." }, { status: 400 });
    }

    console.log("✅ Token valide, réinitialisation du mot de passe...");

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
