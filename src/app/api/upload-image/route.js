import { NextResponse } from 'next/server';

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

        // Vérifier la taille du fichier (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: 'Fichier trop volumineux (max 10MB)' }, { status: 413 });
        }

        // Vérifier le type de fichier
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Le fichier doit être une image' }, { status: 400 });
        }

        // Convertir le fichier en Base64 pour le stocker temporairement
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        const mimeType = file.type;

        // Créer une URL de données (data URL) que nous pouvons utiliser directement
        const dataUrl = `data:${mimeType};base64,${base64}`;

        console.log('File converted to data URL successfully');

        // Retourner l'URL de données directement
        return NextResponse.json({
            imageUrl: dataUrl,
            fileName: file.name,
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
