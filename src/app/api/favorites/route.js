//src/app/api/favorites/route.js
import { verifyJWT } from "../middleware/route";
import prisma from "@/lib/prisma";

// GET : Liste des favoris ou état favori d'un article
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const authResult = verifyJWT(req);
    if (!authResult.isValid || !authResult.user?.email) {
        return new Response(JSON.stringify({ error: "Non authentifié" }), { status: 401 });
    }
    const userEmail = authResult.user.email;
    if (!slug) {
        // Retourne tous les favoris
        const user = await prisma.user.findUnique({
            where: { email: userEmail },
            include: {
                favorites: {
                    include: {
                        article: true,
                    },
                },
            },
        });
        if (!user) {
            return new Response(JSON.stringify({ error: "Utilisateur non trouvé" }), { status: 404 });
        }
        const articlesFavoris = user.favorites.map(fav => fav.article);
        return new Response(JSON.stringify(articlesFavoris), { status: 200 });
    } else {
        // Vérifie si l'article est en favori
        const article = await prisma.article.findFirst({ where: { slug } });
        if (!article) {
            return new Response(JSON.stringify({ error: "Article non trouvé" }), { status: 404 });
        }
        const user = await prisma.user.findUnique({ where: { email: userEmail } });
        if (!user) {
            return new Response(JSON.stringify({ error: "Utilisateur non trouvé" }), { status: 404 });
        }
        const favorite = await prisma.favorite.findFirst({ where: { userId: user.id, articleId: article.id } });
        return new Response(JSON.stringify({ isFavorite: !!favorite }), { status: 200 });
    }
}

// Ajoute un favori (POST /api/favorites { slug })
export async function POST(req) {
    const authResult = verifyJWT(req);
    if (!authResult.isValid || !authResult.user?.email) {
        return new Response(JSON.stringify({ error: "Non authentifié" }), { status: 401 });
    }
    const userEmail = authResult.user.email;
    const body = await req.json();
    const slug = body.slug;
    if (!slug) {
        return new Response(JSON.stringify({ error: "Slug manquant" }), { status: 400 });
    }
    const article = await prisma.article.findFirst({ where: { slug } });
    if (!article) {
        return new Response(JSON.stringify({ error: "Article non trouvé" }), { status: 404 });
    }
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
        return new Response(JSON.stringify({ error: "Utilisateur non trouvé" }), { status: 404 });
    }
    // Vérifie si déjà en favori
    const alreadyFav = await prisma.favorite.findFirst({ where: { userId: user.id, articleId: article.id } });
    if (alreadyFav) {
        return new Response(JSON.stringify({ message: "Déjà en favori" }), { status: 200 });
    }
    await prisma.favorite.create({ data: { userId: user.id, articleId: article.id } });
    return new Response(JSON.stringify({ message: "Ajouté aux favoris" }), { status: 201 });
}

// Retire un favori (DELETE /api/favorites { slug })
export async function DELETE(req) {
    const authResult = verifyJWT(req);
    if (!authResult.isValid || !authResult.user?.email) {
        return new Response(JSON.stringify({ error: "Non authentifié" }), { status: 401 });
    }
    const userEmail = authResult.user.email;
    const body = await req.json();
    const slug = body.slug;
    if (!slug) {
        return new Response(JSON.stringify({ error: "Slug manquant" }), { status: 400 });
    }
    const article = await prisma.article.findFirst({ where: { slug } });
    if (!article) {
        return new Response(JSON.stringify({ error: "Article non trouvé" }), { status: 404 });
    }
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
        return new Response(JSON.stringify({ error: "Utilisateur non trouvé" }), { status: 404 });
    }
    await prisma.favorite.deleteMany({ where: { userId: user.id, articleId: article.id } });
    return new Response(JSON.stringify({ message: "Retiré des favoris" }), { status: 200 });
}
