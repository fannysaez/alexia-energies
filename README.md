
# alexia-energies

Application web de bien-être et formations, développée dans le cadre du Titre Pro Développeur Web & Web Mobile (mai-juillet 2025).

Démo en ligne : [alexia-energies.vercel.app](https://alexia-energies.vercel.app/)

---

Il s'agit d'un projet [Next.js](https://nextjs.org) initialisé avec [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Présentation

Plateforme dédiée au bien-être, proposant :

- Un site vitrine (magnétisme, sophrologie, human design)
- Prise de rendez-vous via Calendly (présentiel/distanciel)
- Espace de formation en ligne sécurisé (accès après paiement)
- Interface d’administration (gestion utilisateurs, articles, formations)

---

## Fonctionnalités principales

- Pages publiques : Accueil, Qui suis-je, Services, Articles, FAQ, Contact
- Prise de rendez-vous intégrée (Calendly)
- Espace formation privé (achat via Stripe, accès sécurisé, contenus multimédias)
- Administration complète (utilisateurs, articles, chapitres de formation)
- Authentification sécurisée (BcryptJs, JWT)
- Emails transactionnels (Resend, Email.js)
- Site responsive et SEO friendly

## Stack technique

| Élément          | Technologie          |
| ---------------- | -------------------- |
| Framework        | Next.js              |
| Base de données  | Neon (PostgreSQL)    |
| ORM              | Prisma               |
| Authentification | BcryptJs, JWT        |
| Paiement         | Stripe               |
| Emails           | Email.js, Resend     |
| Formulaires      | React Hook Form, Zod |
| Déploiement      | Vercel               |

---
## Cahier des charges

Le cahier des charges complet du projet est disponible dans le fichier [Cachier des charges](./cahier-des-charges.md).

Résumé : développement d’une application web de bien-être avec site vitrine, prise de rendez-vous, espace formation en ligne (privé après paiement), et interface d’administration. Voir le fichier pour le détail des pages, fonctionnalités et contraintes techniques.

## Limites / Non réalisé

- L’espace formation en ligne, le paiement Stripe et la gestion des chapitres n’ont pas pu être réalisés par manque de temps.
- Seules les parties site vitrine, prise de rendez-vous, articles, FAQ, contact et administration de base sont fonctionnelles.

---

## Démarrage

Pour commencer, lancez le serveur de développement :

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir le résultat.

Vous pouvez commencer à modifier la page en éditant le fichier `app/page.js`. La page se met à jour automatiquement lors de vos modifications.

Ce projet utilise [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) pour optimiser et charger automatiquement [Geist](https://vercel.com/font), une nouvelle famille de polices créée par Vercel.

## En savoir plus

Pour en savoir plus sur Next.js, consultez les ressources suivantes :

- [Documentation Next.js](https://nextjs.org/docs) - découvrez les fonctionnalités et l'API de Next.js.
- [Apprendre Next.js](https://nextjs.org/learn) - un tutoriel interactif sur Next.js.

Vous pouvez également consulter [le dépôt GitHub de Next.js](https://github.com/vercel/next.js) - vos retours et contributions sont les bienvenus !

## Déployer sur Vercel

Le moyen le plus simple de déployer votre application Next.js est d'utiliser la [plateforme Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) créée par les auteurs de Next.js.

Consultez notre [documentation sur le déploiement Next.js](https://nextjs.org/docs/app/building-your-application/deploying) pour plus de détails.

---
