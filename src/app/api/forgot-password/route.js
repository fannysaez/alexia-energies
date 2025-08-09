import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getResetPasswordEmailTemplate } from "@/lib/emailTemplates";
import crypto from "crypto";

export async function POST(req) {
    const { email } = await req.json();
    console.log("🔍 Tentative de reset pour email:", email);

    if (!email) {
        return NextResponse.json({ message: "Email requis" }, { status: 400 });
    }

    // Vérifier si l'utilisateur existe (dans user ou admin)
    let user = await prisma.user.findUnique({ where: { email } });
    let userType = "user";

    if (!user) {
        user = await prisma.admin.findUnique({ where: { email } });
        userType = "admin";
    }

    console.log("👤 Utilisateur trouvé:", !!user, "Type:", userType);

    if (!user) {
        console.log("❌ Utilisateur non trouvé pour:", email);
        // Pour la sécurité, on ne révèle pas si l'email existe ou non
        return NextResponse.json({ message: "Si cet email existe, un lien a été envoyé." });
    }

    // Générer un token sécurisé
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1h
    console.log("🔑 Token généré:", token.substring(0, 10) + "...");

    // Enregistrer le token en base (dans la bonne table)
    if (userType === "user") {
        await prisma.user.update({
            where: { email },
            data: {
                resetToken: token,
                resetTokenExpiry: expires,
            },
        });
    } else {
        await prisma.admin.update({
            where: { email },
            data: {
                resetToken: token,
                resetTokenExpiry: expires,
            },
        });
    }
    console.log("💾 Token sauvé en base pour:", email, "dans table:", userType);

    // Envoyer l'email via Resend
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
    console.log("📧 URL de reset:", resetUrl);

    try {
        await sendResetEmail(email, resetUrl);
        console.log("✅ Email envoyé avec succès");
        return NextResponse.json({ message: "Un email de réinitialisation a été envoyé à votre adresse." });
    } catch (error) {
        console.error("🚨 Erreur lors de l'envoi de l'email:", error);
        // En mode développement, on peut montrer l'erreur pour debugger
        if (process.env.NODE_ENV === 'development') {
            return NextResponse.json({ message: `Erreur: ${error.message}` }, { status: 500 });
        }
        // En production, on reste discret pour la sécurité
        return NextResponse.json({ message: "Si cet email existe, un lien a été envoyé." });
    }
}

// Fonction d'envoi d'email via Resend
async function sendResetEmail(email, url) {
    console.log("📨 Début envoi email pour:", email);
    console.log("🔗 URL:", url);

    const resendApiKey = process.env.RESEND_API_KEY;

    console.log("⚙️ Configuration Resend:");
    console.log("- API Key:", resendApiKey ? "✅ Défini" : "❌ Manquant");

    if (!resendApiKey) {
        console.error("❌ Variable d'environnement RESEND_API_KEY manquante");
        throw new Error("Configuration Resend manquante - RESEND_API_KEY non définie");
    }

    const resend = new Resend(resendApiKey);

    try {
        console.log("🌐 Envoi de l'email via Resend...");

        const { data, error } = await resend.emails.send({
            from: 'Alexia Energies <fsaez.apprenant@simplon.co>',
            to: [email],
            subject: 'Réinitialisation de votre mot de passe - Alexia Energies',
            html: getResetPasswordEmailTemplate(url),
        });

        if (error) {
            console.error("❌ Erreur Resend:", error);
            throw new Error(`Resend error: ${error.message}`);
        }

        console.log("✅ Email envoyé avec succès via Resend. ID:", data?.id);
        return true;
    } catch (error) {
        console.error("🚨 Erreur lors de l'envoi de l'email:", error.message);
        throw error;
    }
}