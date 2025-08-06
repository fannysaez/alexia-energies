import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req, { params }) {
    const { slug } = params;
    if (!slug) {
        return new Response(JSON.stringify({ error: 'Slug manquant' }), { status: 400 });
    }
    try {
        // Récupère l'article par le slug
        const article = await prisma.article.findUnique({
            where: { slug: String(slug) }
        });
        if (!article) {
            return new Response(JSON.stringify({ error: 'Article non trouvé' }), { status: 404 });
        }
        // Incrémente le compteur de vues
        const updated = await prisma.article.update({
            where: { slug: String(slug) },
            data: { views: { increment: 1 } }
        });
        return new Response(JSON.stringify({ views: updated.views }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
