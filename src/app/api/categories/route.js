import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET: Liste toutes les catégories
export async function GET() {
    try {
        const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: 'Erreur lors de la récupération des catégories' }, { status: 500 });
    }
}

// POST: Ajoute une nouvelle catégorie
export async function POST(request) {
    try {
        const { name } = await request.json();
        if (!name || name.trim() === '') {
            return NextResponse.json({ error: 'Le nom de la catégorie est requis' }, { status: 400 });
        }
        const category = await prisma.category.create({ data: { name: name.trim() } });
        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Ce nom de catégorie existe déjà' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Erreur lors de la création de la catégorie' }, { status: 500 });
    }
}

// PATCH: Modifie une catégorie
export async function PATCH(request) {
    try {
        const { id, name } = await request.json();
        if (!id || !name || name.trim() === '') {
            return NextResponse.json({ error: 'ID et nom requis' }, { status: 400 });
        }
        const category = await prisma.category.update({
            where: { id },
            data: { name: name.trim() }
        });
        return NextResponse.json(category);
    } catch (error) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Ce nom de catégorie existe déjà' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Erreur lors de la modification de la catégorie' }, { status: 500 });
    }
}

// DELETE: Supprime une catégorie
export async function DELETE(request) {
    try {
        const { id } = await request.json();
        if (!id) {
            return NextResponse.json({ error: 'ID requis' }, { status: 400 });
        }
        // Mettre à jour tous les articles qui utilisent cette catégorie pour la retirer (mettre categoryId à null)
        await prisma.article.updateMany({
            where: { categoryId: id },
            data: { categoryId: null }
        });
        // Supprimer la catégorie
        await prisma.category.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Erreur lors de la suppression de la catégorie' }, { status: 500 });
    }
}
