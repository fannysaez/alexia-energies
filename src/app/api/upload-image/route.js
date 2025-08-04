import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');
        const newName = formData.get('newName');

        console.log('Upload attempt:', {
            hasFile: !!file,
            fileName: file?.name,
            fileSize: file?.size,
            newName
        });

        if (!file) {
            return NextResponse.json({ error: 'Aucun fichier envoyé' }, { status: 400 });
        }

        // Vérifier la taille du fichier (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'Fichier trop volumineux (max 5MB)' }, { status: 413 });
        }

        // Vérifier le type de fichier
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Le fichier doit être une image' }, { status: 400 });
        }

        // Créer le nom de fichier
        const originalName = file.name;
        const extension = path.extname(originalName);
        const timestamp = Date.now();

        let finalFileName;
        if (newName && newName.trim()) {
            const customName = newName.trim().replace(/[^a-zA-Z0-9.-]/g, '_');
            // Si le nom personnalisé a déjà une extension, on l'utilise tel quel
            // Sinon on ajoute l'extension du fichier original
            if (path.extname(customName)) {
                finalFileName = `${timestamp}-${customName}`;
            } else {
                finalFileName = `${timestamp}-${customName}${extension}`;
            }
        } else {
            finalFileName = `${timestamp}-${originalName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        }

        // Créer le chemin de destination
        const uploadDir = path.join(process.cwd(), 'public', 'articles');
        const filePath = path.join(uploadDir, finalFileName);

        // Créer le dossier s'il n'existe pas
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (error) {
            // Le dossier existe déjà
        }

        // Convertir le fichier en buffer et l'écrire
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // Créer l'URL publique
        const imageUrl = `/articles/${finalFileName}`;

        console.log('File saved successfully:', filePath);

        return NextResponse.json({
            imageUrl,
            fileName: finalFileName,
            size: file.size
        });

    } catch (error) {
        console.error('Erreur upload image:', error);
        return NextResponse.json({
            error: `Erreur lors de l'upload: ${error.message}`,
            details: error.toString()
        }, { status: 500 });
    }
}
