//src/app/lib/prisma.js


// // Importe le PrismaClient depuis le package Prisma
import { PrismaClient } from '@prisma/client';

// Utilise l'objet global pour stocker l'instance du client Prisma
const globalForPrisma = global;

// Crée une instance unique du client Prisma ou réutilise celle existante
export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ['query'], // Log all queries / Journalise toutes les requêtes
    });

// En développement, attache le client Prisma à l'objet global pour éviter plusieurs instances
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Exporte le client Prisma par défaut
export default prisma;