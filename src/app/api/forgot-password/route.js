import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
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

    // Envoyer l'email via EmailJS
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

// Fonction d'envoi d'email via EmailJS REST API
async function sendResetEmail(email, url) {
    console.log("📨 Début envoi email pour:", email);
    console.log("🔗 URL:", url);

    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID_RESET;
    const userId = process.env.EMAILJS_USER_ID;

    console.log("⚙️ Configuration EmailJS:");
    console.log("- Service ID:", serviceId ? "✅ Défini" : "❌ Manquant");
    console.log("- Template ID:", templateId ? "✅ Défini" : "❌ Manquant");
    console.log("- User ID:", userId ? "✅ Défini" : "❌ Manquant");

    if (!serviceId || !templateId || !userId) {
        const missingVars = [];
        if (!serviceId) missingVars.push("EMAILJS_SERVICE_ID");
        if (!templateId) missingVars.push("EMAILJS_TEMPLATE_ID_RESET");
        if (!userId) missingVars.push("EMAILJS_USER_ID");

        console.error("❌ Variables d'environnement manquantes:", missingVars.join(", "));
        throw new Error(`Configuration EmailJS manquante - Variables manquantes: ${missingVars.join(", ")}`);
    }

    // Les variables à passer au template EmailJS
    const templateParams = {
        to_email: email,
        user_email: email,
        to_name: email.split('@')[0], // Nom sans le domaine
        reset_link: url,
        reset_url: url,
        link: url, // Variable alternative
    };

    console.log("📋 Paramètres du template:", templateParams);

    try {
        console.log("🌐 Envoi de la requête à EmailJS...");
        const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                service_id: serviceId,
                template_id: templateId,
                user_id: userId,
                template_params: templateParams,
            }),
        });

        console.log("📡 Réponse EmailJS - Status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Erreur EmailJS - Status:", response.status);
            console.error("❌ Erreur EmailJS - Response:", errorText);
            throw new Error(`EmailJS error: ${response.status} - ${errorText}`);
        }

        console.log("✅ Email envoyé avec succès vers:", email);
        return true;
    } catch (error) {
        console.error("🚨 Erreur lors de l'envoi de l'email:", error.message);
        throw error;
    }
}
