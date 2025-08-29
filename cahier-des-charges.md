# Cahier des Charges — Application Web Bien-Être & Formations

## 🔥 Objectif général

Développer une application web comportant :

1. Un **site vitrine** présentant les services de bien-être : magnétisme, sophrologie, human design.
2. Une **prise de rendez-vous** via Calendly, avec choix du mode (présentiel/distanciel).
3. Un **espace de formation en ligne**, avec accès sécurisé pour les participants.
4. Une **interface d'administration** pour gérer les utilisateurs, articles, et contenu de formation.

## 🧭 Structure du site

### 🖥️ 1. Site vitrine (public)

Pages à développer :

- Accueil : présentation générale, appel à l'action, description des services, témoignages, articles.
- Qui suis-je ? : biographie, parcours, vision.
- Services : une page par service (magnétisme, sophrologie, human design).
- Articles : liste paginée ou filtrable, chaque article a sa page dédiée (route dynamique).
- FAQ : liste de questions/réponses fréquentes.
- Contact : formulaire de contact, bouton "Prendre rdv" (choix distanciel/présentiel, redirection Calendly).

### 🎓 2. Espace formation en ligne (privé après paiement)

Fonctionnalités :

- Achat de la formation via Stripe.
- Après paiement : création automatique d’un compte utilisateur, envoi d’un email via Resend avec identifiants.
- Espace personnel : connexion (BcryptJs + JWT), modification du mot de passe (Resend) et du nom d’utilisateur.
- Affichage des chapitres de formation : menu vertical à gauche (liste des chapitres), affichage du contenu à droite (texte, vidéos, audios, fichiers téléchargeables).

### 🔐 3. Espace d’administration (privé)

Accessible uniquement à l’administrateur du site.
Fonctionnalités :

- Gestion des utilisateurs (CRUD)
- Gestion des chapitres de formation (CRUD) : titre, contenu (texte, audio, vidéo, fichiers)
- Gestion des articles (CRUD)

## 🧱 Stack technique

| Élément          | Technologie           |
| ---------------- | --------------------- |
| Framework        | Next.js               |
| Base de données  | Neon (PostgreSQL)     |
| ORM              | Prisma                |
| Authentification | BcryptJs + JWT        |
| Paiement         | Stripe                |
| Emails/Resend    | Email.js / Resend     |
| Icons            | React Icons           |
| Formulaires      | React Hook Form + Zod |
| Déploiement      | Vercel                |

## 📌 Contraintes & exigences techniques

- Site responsive (desktop / mobile)
- SEO friendly (balises meta, titres, performances)
- Sécurisation des pages privées
- Utilisation de Stripe Webhooks pour débloquer l’accès formation
- Expérience utilisateur fluide, interface apaisante, moderne et lisible

## ❗ Limites / Non réalisé

- L’espace formation en ligne, le paiement Stripe et la gestion des chapitres n’ont pas pu être réalisés par manque de temps.
- Seules les parties site vitrine, prise de rendez-vous, articles, FAQ, contact et administration de base sont fonctionnelles.
