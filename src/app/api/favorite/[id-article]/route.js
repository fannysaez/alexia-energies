import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { verifyToken } from "../../../../lib/auth";

export async function POST(request, { params }) {
    // Récupérer l'id de l'article depuis l'URL
    const articleId = parseInt(params["id-article"]);
    if (!articleId) return NextResponse.json({ error: "Article ID manquant" }, { status: 400 });

    // Récupérer le token JWT
    const authHeader = request.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    const token = authHeader.replace("Bearer ", "");
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: "Token invalide" }, { status: 401 });

    // Vérifier si le favori existe déjà
    const existing = await prisma.favorite.findUnique({
        where: {
            userId_articleId: {
                userId: user.id,
                articleId: articleId
            }
        }
    });
    if (existing) {
        return NextResponse.json({ error: "Déjà en favoris" }, { status: 409 });
    }
    // Créer le favori
    const favorite = await prisma.favorite.create({
        data: {
            userId: user.id,
            articleId: articleId
        }
    });
    return NextResponse.json(favorite);
}

export async function DELETE(request, { params }) {
    const articleId = parseInt(params["id-article"]);
    if (!articleId) return NextResponse.json({ error: "Article ID manquant" }, { status: 400 });
    const authHeader = request.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    const token = authHeader.replace("Bearer ", "");
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: "Token invalide" }, { status: 401 });

    // Vérifier si le favori existe
    const existing = await prisma.favorite.findUnique({
        where: {
            userId_articleId: {
                userId: user.id,
                articleId: articleId
            }
        }
    });
    if (!existing) {
        return NextResponse.json({ error: "Favori non trouvé" }, { status: 404 });
    }
    // Supprimer le favori
    await prisma.favorite.delete({
        where: {
            userId_articleId: {
                userId: user.id,
                articleId: articleId
            }
        }
    });
    return NextResponse.json({ success: true });
}
