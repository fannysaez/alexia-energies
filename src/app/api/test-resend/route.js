import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req) {
    const { email } = await req.json();

    console.log("🧪 Test Resend pour:", email);

    const resendApiKey = process.env.RESEND_API_KEY;
    console.log("🔑 API Key présente:", !!resendApiKey);
    console.log("🔑 API Key commence par:", resendApiKey?.substring(0, 10));

    if (!resendApiKey) {
        return NextResponse.json({ error: "RESEND_API_KEY manquante" }, { status: 500 });
    }

    const resend = new Resend(resendApiKey);

    try {
        console.log("📨 Envoi test Resend...");

        const { data, error } = await resend.emails.send({
            from: 'Test <onboarding@resend.dev>',
            to: [email],
            subject: 'Test Resend - Alexia Energies',
            html: '<h1>Test email Resend</h1><p>Si vous recevez ceci, Resend fonctionne !</p>',
        });

        if (error) {
            console.error("❌ Erreur Resend:", error);
            return NextResponse.json({ error: error }, { status: 500 });
        }

        console.log("✅ Email test envoyé. ID:", data?.id);
        return NextResponse.json({
            success: true,
            emailId: data?.id,
            message: "Email test envoyé avec succès"
        });

    } catch (error) {
        console.error("🚨 Erreur:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
