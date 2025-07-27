const fs = require('fs');
const path = require('path');

// Lit le fichier de base qui contient le generator et le datasource
const base = fs.readFileSync('schema/base.prisma', 'utf8'); // contient generator + datasource

// Définit les chemins vers les dossiers contenant les modèles et les enums
const modelsDir = path.join(__dirname, 'models');
const enumsDir = path.join(__dirname, 'enums');

// Fonction utilitaire pour fusionner tous les fichiers .prisma d'un dossier donné
function mergeFilesFrom(dir) {
    if (!fs.existsSync(dir)) return '';
    return fs.readdirSync(dir)
        .filter(f => f.endsWith('.prisma'))
        .map(f => fs.readFileSync(path.join(dir, f), 'utf8'))
        .join('\n\n');
}

try {
    // Construit le contenu final du schema.prisma en fusionnant base, enums et models
    const output = [
        base,
        mergeFilesFrom(enumsDir),
        mergeFilesFrom(modelsDir)
    ].join('\n\n');

    // Écrit le résultat dans le fichier schema.prisma à la racine du projet
    fs.writeFileSync('schema.prisma', output);

    // Affiche un message de succès dans la console
    console.log('✅ schema.prisma généré avec succès.');
} catch (error) {
    console.error('❌ Erreur lors de la génération du schema.prisma :', error.message);
    process.exit(1);
}