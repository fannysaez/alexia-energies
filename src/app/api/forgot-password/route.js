import { prisma } from "@/lib/prisma";
import crypto from "crypto";
// Pour l'envoi d'email, tu peux utiliser nodemailer ou un service externe
// import nodemailer from "nodemailer";

export async function POST(req) {
    const { email } = await req.json();
    console.log("🔍 Tentative de reset pour email:", email);
    
    if (!email) {
        return Response.json({ message: "Email requis" }, { status: 400 });
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({ where: { email } });
    console.log("👤 Utilisateur trouvé:", !!user);
    
    if (!user) {
        console.log("❌ Utilisateur non trouvé pour:", email);
        // Pour la sécurité, on ne révèle pas si l'email existe ou non
        return Response.json({ message: "Si cet email existe, un lien a été envoyé." });
    }

    // Générer un token sécurisé
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1h
    console.log("🔑 Token généré:", token.substring(0, 10) + "...");

    // Enregistrer le token en base
    await prisma.user.update({
        where: { email },
        data: {
            resetToken: token,
            resetTokenExpiry: expires,
        },
    });
    console.log("💾 Token sauvé en base pour:", email);

    // Envoyer l'email via EmailJS de manière asynchrone
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
    console.log("📧 URL de reset:", resetUrl);

    // Ne pas attendre l'envoi d'email pour retourner la réponse
    sendResetEmail(email, resetUrl).catch(error => {
        console.error("🚨 Erreur lors de l'envoi de l'email:", error);
    });

    return Response.json({ message: "Si cet email existe, un lien a été envoyé." });
}


// Fonction d'envoi d'email via EmailJS REST API
async function sendResetEmail(email, url) {
    console.log("📨 Début envoi email pour:", email);
    console.log("🔗 URL:", url);
    
    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID_RESET;
    const userId = process.env.EMAILJS_USER_ID;

    console.log("⚙️ Configuration EmailJS:");
    console.log("- Service ID:", serviceId);
    console.log("- Template ID:", templateId);
    console.log("- User ID:", userId);

    // Les variables à passer au template EmailJS
    const templateParams = {
        to_email: email,        // Nom standard pour EmailJS
        reset_link: url,
    };

    console.log("📋 Paramètres du template:", templateParams);

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout de 10 secondes

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
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        console.log("📡 Réponse EmailJS - Status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Erreur EmailJS - Status:", response.status);
            console.error("❌ Erreur EmailJS - Response:", errorText);
            throw new Error(`EmailJS error: ${response.status} - ${errorText}`);
        }

        console.log("✅ Email envoyé avec succès vers:", email);
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error("⏰ Timeout lors de l'envoi de l'email EmailJS");
        } else {
            console.error("🚨 Erreur lors de l'envoi de l'email:", error.message);
        }
        throw error;
    }
}
