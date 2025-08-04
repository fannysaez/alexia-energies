import prisma from '@/lib/prisma';
import { verifyJWT } from '../../middleware/route';

// GET: Récupérer un article par son slug
export async function GET(request, context) {
    const params = await context.params;
    const { slug } = params;

    if (!slug) {
        return new Response(
            JSON.stringify({ error: "Slug manquant ou invalide" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    try {
        const article = await prisma.article.findFirst({
            where: {
                slug,
                statut: 'publié' // Seuls les articles publiés sont accessibles publiquement
            },
            include: {
                contentBlocks: true,
                paragraphs: true,
                category: true,
            },
        });
        if (article) {
            console.log('[API] Article trouvé (slug: ' + slug + ') - statut:', article.statut);
        } else {
            console.log('[API] Aucun article publié trouvé pour le slug:', slug);
        }

        if (!article) {
            return new Response(
                JSON.stringify({ error: "Article non trouvé" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(JSON.stringify(article), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                // Désactive le cache pour éviter l'affichage d'un article brouillon après modif
                "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
            }
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: "Erreur lors de la récupération de l'article" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

// PUT: Modifier un article par son slug
export async function PUT(request, { params }) {
    // Vérification JWT pour la modification
    const authResult = verifyJWT(request);
    if (!authResult.isValid) {
        return new Response(
            JSON.stringify({ error: 'Non autorisé' }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const { slug } = params;
    if (!slug) {
        return new Response(
            JSON.stringify({ error: "Slug manquant ou invalide" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }
    try {
        const data = await request.json();

        // Debug: Afficher les données reçues
        console.log('PUT /api/articles/[slug] - Données reçues:', {
            slug,
            titre: data.titre,
            description: data.description,
            auteur: data.auteur
        });

        // On récupère l'article existant
        const article = await prisma.article.findUnique({ where: { slug } });
        if (!article) {
            return new Response(
                JSON.stringify({ error: "Article non trouvé" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }
        // --- BLOCS DE CONTENU ---
        if (Array.isArray(data.contentBlocks)) {
            const existingBlocks = await prisma.contentBlock.findMany({ where: { articleId: article.id } });
            if (data.contentBlocks.length === 0) {
                // Si la nouvelle liste est vide, supprimer tous les blocs existants
                for (const oldBlock of existingBlocks) {
                    await prisma.contentBlock.delete({ where: { id: oldBlock.id } });
                }
            } else {
                // Supprimer uniquement les blocs existants absents de la nouvelle liste
                for (const oldBlock of existingBlocks) {
                    if (oldBlock.id && !data.contentBlocks.find(b => b.id === oldBlock.id)) {
                        await prisma.contentBlock.delete({ where: { id: oldBlock.id } });
                    }
                }
                // Mettre à jour ou créer les blocs présents
                for (const block of data.contentBlocks) {
                    const normalizedBlock = {
                        ...block,
                        type: block.type ? block.type.toUpperCase() : undefined,
                        articleId: article.id
                    };
                    if (block.id) {
                        await prisma.contentBlock.update({
                            where: { id: block.id },
                            data: normalizedBlock
                        });
                    } else {
                        await prisma.contentBlock.create({
                            data: normalizedBlock
                        });
                    }
                }
            }
        }
        // --- PARAGRAPHES ---
        if (Array.isArray(data.paragraphs)) {
            const existingParas = await prisma.paragraph.findMany({ where: { article_id: article.id } });
            if (data.paragraphs.length === 0) {
                // Si la nouvelle liste est vide, supprimer tous les paragraphes existants
                for (const oldPara of existingParas) {
                    await prisma.paragraph.delete({ where: { id: oldPara.id } });
                }
            } else {
                for (const oldPara of existingParas) {
                    if (oldPara.id && !data.paragraphs.find(p => p.id === oldPara.id)) {
                        await prisma.paragraph.delete({ where: { id: oldPara.id } });
                    }
                }
                for (const p of data.paragraphs) {
                    let image_url = p.image_url;
                    let image_url2 = p.image_url2;
                    if (image_url && typeof image_url === 'string' && !image_url.startsWith('/articles/')) {
                        image_url = '/articles/' + image_url.replace(/^\/+/, '');
                    }
                    if (image_url2 && typeof image_url2 === 'string' && !image_url2.startsWith('/articles/')) {
                        image_url2 = '/articles/' + image_url2.replace(/^\/+/, '');
                    }
                    const paragraphData = { ...p, article_id: article.id, image_url, image_url2 };
                    if (p.id) {
                        await prisma.paragraph.update({
                            where: { id: p.id },
                            data: paragraphData
                        });
                    } else {
                        await prisma.paragraph.create({
                            data: paragraphData
                        });
                    }
                }
            }
        }
        // --- MAJ PRINCIPALE ---
        const updated = await prisma.article.update({
            where: { slug },
            data: {
                titre: data.titre,
                description: data.description, // AJOUT: description manquante
                contenu: data.contenu,
                auteur: data.auteur,
                image: data.image,
                imageCouverture: data.imageCouverture,
                slug: data.slug || slug,
                categoryId: data.categoryId,
                dateCreation: data.dateCreation ? new Date(data.dateCreation) : undefined,
                datePublication: data.datePublication ? new Date(data.datePublication) : undefined,
                statut: data.statut, // Ajout de la mise à jour du statut
            },
            include: {
                contentBlocks: true,
                paragraphs: true,
                category: true,
            },
        });
        return new Response(JSON.stringify(updated), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error('Erreur PUT /api/articles/[slug]:', error);
        return new Response(
            JSON.stringify({ error: "Erreur lors de la modification de l'article", details: error?.message || error }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

// DELETE: Supprimer un article par son slug
export async function DELETE(request, { params }) {
    // Vérification JWT pour la suppression
    const authResult = verifyJWT(request);
    if (!authResult.isValid) {
        return new Response(
            JSON.stringify({ error: 'Non autorisé' }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const { slug } = params;
    if (!slug) {
        return new Response(
            JSON.stringify({ error: "Slug manquant ou invalide" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }
    try {
        // On récupère l'article pour avoir le chemin de l'image
        const article = await prisma.article.findUnique({ where: { slug } });
        if (!article) {
            return new Response(
                JSON.stringify({ error: "Article non trouvé" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }
        // Suppression du fichier image si présent
        if (article.image && typeof article.image === 'string' && article.image.startsWith('/articles/')) {
            try {
                const path = require('path');
                const fs = require('fs');
                const imagePath = path.join(process.cwd(), 'public', article.image.replace(/^\//, ''));
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            } catch (err) {
                console.error('Erreur suppression image:', err);
            }
        }
        await prisma.article.delete({ where: { slug } });
        return new Response(JSON.stringify({ message: "Article supprimé" }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: "Erreur lors de la suppression de l'article" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
