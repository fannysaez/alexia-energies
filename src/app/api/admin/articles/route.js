import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma';
import { verifyJWT } from '../../middleware/route';

export async function GET(req) {
    // Route admin : vérification JWT obligatoire
    const authResult = await verifyJWT(req);
    if (!authResult.isValid) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const articles = await prisma.article.findMany({
            // Pas de filtre sur le statut - l'admin voit tous les articles
            orderBy: { dateCreation: 'desc' },
            include: {
                category: true,
                contentBlocks: true,
                paragraphs: true,
            },
        });

        // On s'assure que chaque article a bien son categoryId et la relation category
        const articlesWithCategory = articles.map(article => ({
            ...article,
            categoryId: article.categoryId ?? article.category?.id ?? null,
            category: article.category ? {
                id: article.category.id,
                name: article.category.name
            } : null
        }));

        return NextResponse.json(articlesWithCategory);
    } catch (error) {
        console.error('Erreur GET /api/admin/articles:', error)
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des articles' },
            { status: 500 }
        )
    }
}
