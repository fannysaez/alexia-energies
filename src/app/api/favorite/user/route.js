import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { verifyToken } from "../../../../lib/auth";

export async function GET(request) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    const token = authHeader.replace("Bearer ", "");
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: "Token invalide" }, { status: 401 });

    // Récupérer tous les favoris de l'utilisateur
    const favorites = await prisma.favorite.findMany({
        where: { userId: user.id },
        include: { article: true }
    });
    return NextResponse.json(favorites);
}
