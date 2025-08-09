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

    // Envoyer l'email via EmailJS
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
    await sendResetEmail(email, resetUrl);

    return Response.json({ message: "Si cet email existe, un lien a été envoyé." });
}


// Fonction d'envoi d'email via EmailJS REST API
async function sendResetEmail(email, url) {
    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID_RESET;
    const userId = process.env.EMAILJS_USER_ID;

    // Les variables à passer au template EmailJS
    const templateParams = {
        email: email,
        reset_link: url,
    };

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

    if (!response.ok) {
        // Tu peux logger l'erreur ou la traiter
        console.error("Erreur EmailJS", await response.text());
    }
}
