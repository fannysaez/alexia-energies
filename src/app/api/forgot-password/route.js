import { prisma } from "@/lib/prisma";
import crypto from "crypto";
// Pour l'envoi d'email, tu peux utiliser nodemailer ou un service externe
// import nodemailer from "nodemailer";

export async function POST(req) {
    const { email } = await req.json();
    if (!email) {
        return Response.json({ message: "Email requis" }, { status: 400 });
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        // Pour la sécurité, on ne révèle pas si l'email existe ou non
        return Response.json({ message: "Si cet email existe, un lien a été envoyé." });
    }

    // Générer un token sécurisé
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1h

    // Enregistrer le token en base
    await prisma.user.update({
        where: { email },
        data: {
            resetToken: token,
            resetTokenExpiry: expires,
        },
    });

    // Envoyer l'email via EmailJS de manière asynchrone
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

    // Ne pas attendre l'envoi d'email pour retourner la réponse
    sendResetEmail(email, resetUrl).catch(error => {
        console.error("Erreur lors de l'envoi de l'email:", error);
    });

    return Response.json({ message: "Si cet email existe, un lien a été envoyé." });
}


// Fonction d'envoi d'email via EmailJS REST API
async function sendResetEmail(email, url) {
    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID_RESET;
    const userId = process.env.EMAILJS_USER_ID;

    // Les variables à passer au template EmailJS
    const templateParams = {
        to_email: email,        // Nom standard pour EmailJS
        reset_link: url,
    };

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout de 10 secondes

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

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Erreur EmailJS", errorText);
            throw new Error(`EmailJS error: ${response.status} - ${errorText}`);
        }

        console.log("Email envoyé avec succès");
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error("Timeout lors de l'envoi de l'email EmailJS");
        } else {
            console.error("Erreur lors de l'envoi de l'email:", error.message);
        }
        throw error;
    }
}
