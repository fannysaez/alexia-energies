
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');
        // Sécurité basique
        if (!file) {
            return NextResponse.json({ error: 'Aucun fichier envoyé' }, { status: 400 });
        }
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'Fichier trop volumineux (max 5MB)' }, { status: 413 });
        }
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Le fichier doit être une image' }, { status: 400 });
        }

        // Conversion du fichier en buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload vers Cloudinary
        const uploadRes = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'alexia-energies' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        return NextResponse.json({ imageUrl: uploadRes.secure_url });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
