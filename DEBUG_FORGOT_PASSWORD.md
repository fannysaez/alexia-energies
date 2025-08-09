# 🔧 Guide de débogage - Réinitialisation du mot de passe

## Problèmes identifiés et corrigés :

### ✅ 1. Importation NextResponse

- **Avant** : `import Response`
- **Après** : `import { NextResponse }`
- **Problème** : `Response` peut causer des problèmes en déploiement Vercel

### ✅ 2. Gestion d'erreur améliorée

- Ajout de logs détaillés pour identifier les variables manquantes
- Affichage des erreurs en mode développement
- Messages sécurisés en production

### ✅ 3. Variables d'environnement à vérifier sur Vercel

Vérifiez que ces variables sont bien définies dans Vercel :

```
EMAILJS_SERVICE_ID=votre_service_id
EMAILJS_TEMPLATE_ID_RESET=votre_template_reset_id
EMAILJS_USER_ID=votre_user_id
NEXT_PUBLIC_BASE_URL=https://alexia-energies.vercel.app
DATABASE_URL=votre_database_url
```

## 🧪 Tests à effectuer :

### 1. Test des variables d'environnement

Visitez : `https://alexia-energies.vercel.app/api/test-env`

- Vérifiez que toutes les variables sont "✅ Défini"

### 2. Test de la fonctionnalité

1. Allez sur : `https://alexia-energies.vercel.app/forgot-password`
2. Entrez un email existant dans votre base
3. Vérifiez les logs Vercel pour voir les erreurs détaillées

### 3. Vérification de la base de données

- Assurez-vous que les champs `resetToken` et `resetTokenExpiry` existent dans les tables `user` et `admin`

## 🚀 Déploiement

Après avoir vérifié les variables d'environnement sur Vercel, redéployez l'application.

## 📧 Si les emails ne partent toujours pas

1. Vérifiez que le template EmailJS existe et est activé
2. Testez l'envoi direct depuis EmailJS dashboard
3. Vérifiez les limites de votre compte EmailJS
