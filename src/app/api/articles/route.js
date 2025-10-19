//src/app/api/articles/route.js
// Cette route gère la récupération des articles depuis la base de données

// const articles = [ // Tableau d'articles simulant des données
//     {
//         id: 1, // Identifiant unique de l'article
//         slug: "s-octroyer-du-temps-pour-soi", // Slug pour l'URL
//         titre: "S’octroyer Du Temps Pour Soi", // Titre de l'article
//         description: "C’est se reconnecter à sa vitalité...", // Courte description
//         publishedAt: "2023-04-21", // Date de publication
//         comments: 23, // Nombre de commentaires
//         image: "/articles/foret.webp", // Chemin de l'image
//         category: { id: 1, name: "Bien-être" }, // Catégorie de l'article
//         contenu: "<p>Contenu HTML de l'article 1...</p>", // Contenu HTML
//     },
//     {
//         id: 2,
//         slug: "s-ecouter",
//         titre: "S’écouter",
//         description: "Description courte...",
//         publishedAt: "2023-04-21",
//         comments: 23,
//         image: "/articles/meditation.webp",
//         category: { id: 2, name: "Spiritualité" },
//         contenu: "<p>Contenu HTML de l'article 2...</p>",
//     },
//     {
//         id: 3,
//         slug: "poser-intention-objectifs",
//         titre: "Poser L’intention D’accomplir Ses Objectifs",
//         description: "Description courte...",
//         publishedAt: "2023-04-21",
//         comments: 23,
//         image: "/articles/pendule.webp",
//         category: { id: 3, name: "Épanouissement" },
//         contenu: "<p>Contenu HTML de l'article 3...</p>",
//     },
//     {
//         id: 4,
//         slug: "suspendisse-elit-eros",
//         titre: "Suspendisse Elit Eros...",
//         description: "Description courte...",
//         publishedAt: "2023-04-21",
//         comments: 23,
//         image: "/articles/bol.webp",
//         category: { id: 1, name: "Bien-être" },
//         contenu: "<p>Contenu HTML de l'article 4...</p>",
//     },
// ];

// return new Response(JSON.stringify(articles), { // Retourne la réponse HTTP avec les articles au format JSON
//     status: 200, // Code de succès HTTP
//     headers: { "Content-Type": "application/json" }, // Type de contenu JSON
// });
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'; // Import de Prisma
import { verifyJWT } from '../middleware/route';

export async function GET(req) {
    // Route publique : pas de vérification JWT
    try {
        const articles = await prisma.article.findMany({
            where: {
                statut: 'publié' // Seuls les articles publiés sont visibles publiquement
            },
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
        console.error('Erreur GET /api/articles:', error)
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des articles' },
            { status: 500 }
        )
    }
}

// POST : Ajouter un article
export async function POST(req) {
    // Vérification JWT obligatoire pour la création d'articles
    const authResult = await verifyJWT(req);
    if (!authResult.isValid) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const { titre, slug, auteur, description, image, contenu, categoryId, contentBlocks = [], paragraphs = [], dateCreation, datePublication } = await req.json();

        // Debug: Afficher les données reçues
        console.log('POST /api/articles - Données reçues:', {
            titre, slug, auteur, description, image, contenu, categoryId
        });

        // Correction : forcer le type des blocs en majuscules
        const normalizedBlocks = contentBlocks.map(block => ({
            ...block,
            type: block.type ? block.type.toUpperCase() : undefined
        }));
        if (!titre || !slug || !auteur || !image || !contenu || !categoryId) {
            return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
        }
        const nouvelArticle = await prisma.article.create({
            data: {
                titre,
                slug,
                auteur,
                description,
                image,
                contenu,
                categoryId,
                dateCreation: dateCreation ? new Date(dateCreation) : new Date(),
                datePublication: datePublication ? new Date(datePublication) : null,
                contentBlocks: {
                    create: normalizedBlocks,
                },
                paragraphs: {
                    create: paragraphs.map(para => ({ ...para })),
                },
            },
            include: {
                category: true,
                contentBlocks: true,
                paragraphs: true,
            },
        });
        return NextResponse.json(nouvelArticle, { status: 201 });
    } catch (error) {
        console.error('Erreur POST /api/articles:', error);
        return NextResponse.json({ error: 'Erreur lors de la création de l\'article' }, { status: 500 });
    }
}

// PUT : Modifier un article (par slug ou id)
export async function PUT(req) {
    try {
        const { id, slug, contentBlocks = [], paragraphs = [], dateCreation, datePublication, ...updateData } = await req.json();

        // Debug: Afficher les données reçues
        console.log('PUT /api/articles - Données reçues:', {
            id, slug, ...updateData
        });

        if (!id && !slug) {
            return NextResponse.json({ error: 'ID ou slug requis' }, { status: 400 });
        }
        // Recherche par id ou slug
        const where = id ? { id } : { slug };
        const article = await prisma.article.findUnique({ where });
        if (!article) {
            return NextResponse.json({ error: 'Article non trouvé' }, { status: 404 });
        }
        // Correction : forcer le type des blocs en majuscules
        const normalizedBlocks = contentBlocks.map(block => ({
            ...block,
            type: block.type ? block.type.toUpperCase() : undefined
        }));
        // Mise à jour des blocs et paragraphes (remplacement complet)
        // On supprime les anciens puis on recrée les nouveaux
        await prisma.contentBlock.deleteMany({ where: { articleId: article.id } });
        await prisma.paragraph.deleteMany({ where: { articleId: article.id } });
        const updated = await prisma.article.update({
            where,
            data: {
                ...updateData,
                dateCreation: dateCreation ? new Date(dateCreation) : article.dateCreation,
                datePublication: datePublication ? new Date(datePublication) : article.datePublication,
                contentBlocks: {
                    create: normalizedBlocks,
                },
                paragraphs: {
                    create: paragraphs.map(para => ({ ...para })),
                },
            },
            include: {
                category: true,
                contentBlocks: true,
                paragraphs: true,
            },
        });
        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error('Erreur PUT /api/articles:', error);
        return NextResponse.json({ error: 'Erreur lors de la modification de l\'article' }, { status: 500 });
    }
}

// DELETE : Supprimer un article (par id ou slug)
export async function DELETE(req) {
    try {
        const { id, slug } = await req.json();
        if (!id && !slug) {
            return NextResponse.json({ error: 'ID ou slug requis' }, { status: 400 });
        }
        // Recherche par id ou slug
        const where = id ? { id } : { slug };
        const article = await prisma.article.findUnique({ where });
        if (!article) {
            return NextResponse.json({ error: 'Article non trouvé' }, { status: 404 });
        }
        await prisma.article.delete({ where });
        return NextResponse.json({ message: 'Article supprimé' }, { status: 200 });
    } catch (error) {
        console.error('Erreur DELETE /api/articles:', error);
        return NextResponse.json({ error: 'Erreur lors de la suppression de l\'article' }, { status: 500 });
    }
}
