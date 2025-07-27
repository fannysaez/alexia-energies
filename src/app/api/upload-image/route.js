import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; // Pour permettre l'accès au système de fichiers

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');
        const newName = formData.get('newName');
        if (!file) {
            return NextResponse.json({ error: 'Aucun fichier envoyé' }, { status: 400 });
        }
        const buffer = Buffer.from(await file.arrayBuffer());
        let fileName;
        if (newName && typeof newName === 'string' && newName.trim() !== '') {
            // Nettoyage du nom fourni
            const ext = file.name.split('.').pop();
            fileName = newName.replace(/\s/g, '-').replace(/[^a-zA-Z0-9\-_.]/g, '');
            if (!fileName.endsWith(`.${ext}`)) fileName += `.${ext}`;
        } else {
            fileName = Date.now() + '-' + file.name.replace(/\s/g, '-');
        }
        const filePath = path.join(process.cwd(), 'public', 'articles', fileName);
        await fs.writeFile(filePath, buffer);
        // Retourne le chemin relatif pour l'enregistrement dans la base
        return NextResponse.json({ imageUrl: `/articles/${fileName}` });
    } catch (error) {
        console.error('Erreur upload image:', error);
        return NextResponse.json({ error: 'Erreur lors de l\'upload' }, { status: 500 });
    }
}
