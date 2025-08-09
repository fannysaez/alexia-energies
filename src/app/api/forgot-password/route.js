import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Resend } from "resend";
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
            from: 'Alexia Energies <noreply@resend.dev>', // Vous pourrez changer ça avec votre domaine
            to: [email],
            subject: 'Réinitialisation de votre mot de passe - Alexia Energies',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333; text-align: center;">Réinitialisation de votre mot de passe</h2>
                    
                    <p style="color: #666; line-height: 1.6;">
                        Bonjour,
                    </p>
                    
                    <p style="color: #666; line-height: 1.6;">
                        Vous avez demandé la réinitialisation de votre mot de passe sur Alexia Energies.
                        Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${url}" 
                           style="background-color: #4F46E5; color: white; padding: 12px 30px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;">
                            Réinitialiser mon mot de passe
                        </a>
                    </div>
                    
                    <p style="color: #666; line-height: 1.6; font-size: 14px;">
                        Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :
                        <br>
                        <a href="${url}" style="color: #4F46E5; word-break: break-all;">${url}</a>
                    </p>
                    
                    <p style="color: #666; line-height: 1.6; font-size: 14px;">
                        Ce lien expirera dans 1 heure pour des raisons de sécurité.
                    </p>
                    
                    <p style="color: #666; line-height: 1.6; font-size: 14px;">
                        Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    
                    <p style="color: #999; font-size: 12px; text-align: center;">
                        Alexia Energies - Bien-être et développement personnel
                    </p>
                </div>
            `,
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