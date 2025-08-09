import { NextResponse } from "next/server";

export async function GET() {
    const envVars = {
        EMAILJS_SERVICE_ID: process.env.EMAILJS_SERVICE_ID ? "✅ Défini" : "❌ Manquant",
        EMAILJS_TEMPLATE_ID_CONTACT: process.env.EMAILJS_TEMPLATE_ID_CONTACT ? "✅ Défini" : "❌ Manquant",
        EMAILJS_TEMPLATE_ID_RESET: process.env.EMAILJS_TEMPLATE_ID_RESET ? "✅ Défini" : "❌ Manquant",
        EMAILJS_USER_ID: process.env.EMAILJS_USER_ID ? "✅ Défini" : "❌ Manquant",
        RESEND_API_KEY: process.env.RESEND_API_KEY ? "✅ Défini" : "❌ Manquant",
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL ? "✅ Défini" : "❌ Manquant",
        DATABASE_URL: process.env.DATABASE_URL ? "✅ Défini" : "❌ Manquant",
        NODE_ENV: process.env.NODE_ENV,
    };

    console.log("🔍 Variables d'environnement:", envVars);

    return NextResponse.json({
        message: "Variables d'environnement vérifiées",
        env: envVars,
        timestamp: new Date().toISOString()
    });
}
