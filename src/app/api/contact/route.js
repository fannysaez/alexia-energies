import { NextResponse } from "next/server";

export async function POST(req) {
    const { nom, email, message } = await req.json();
    if (!nom || !email || !message) {
        return NextResponse.json({ message: "Tous les champs sont requis." }, { status: 400 });
    }

    // Préparation des variables pour EmailJS
    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID_CONTACT;
    const userId = process.env.EMAILJS_USER_ID;

    const templateParams = {
        nom,
        email,
        message,
        to_email: email,
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
        return NextResponse.json({ message: "Erreur lors de l'envoi de l'email." }, { status: 500 });
    }

    return NextResponse.json({ message: "Email envoyé avec succès !" });
}
