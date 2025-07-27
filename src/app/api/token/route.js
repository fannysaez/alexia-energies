import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request) {
    const body = await request.json();
    const { email, password } = body;
    const secret = process.env.JWT_SECRET;

    if (!email || !password || !secret) {
        return NextResponse.json({ error: 'Missing credentials or secret' }, { status: 400 });
    }

    // Exemple de vérification simple (à adapter selon ta logique)
    if (email === 'ton@email.com' && password === 'tonmotdepasse') {
        const token = jwt.sign({ email }, secret, { expiresIn: '1h' });
        return NextResponse.json({ token });
    } else {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
}