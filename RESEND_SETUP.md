# 🚀 Configuration Resend pour forgot-password

## ✅ Étapes déjà réalisées :

1. ✅ Installation de Resend (`npm install resend`)
2. ✅ Modification du code pour utiliser Resend
3. ✅ Création d'un template email HTML

## 🔧 Étapes à suivre maintenant :

### 1. Créer un compte Resend (si pas encore fait)

- Allez sur : https://resend.com/signup
- Créez votre compte gratuit (3000 emails/mois)

### 2. Obtenir votre clé API

1. Une fois connecté sur Resend
2. Allez dans **"API Keys"**
3. Cliquez sur **"Create API Key"**
4. Donnez-lui un nom : `alexia-energies-reset`
5. **Copiez la clé** (commençant par `re_`)

### 3. Ajouter la clé sur Vercel

1. Allez sur votre dashboard Vercel
2. Cliquez sur votre projet `alexia-energies`
3. Allez dans **Settings** > **Environment Variables**
4. Ajoutez une nouvelle variable :
   - **Name** : `RESEND_API_KEY`
   - **Value** : `re_xxxxxxxxxx` (votre clé API)
   - **Environment** : Production + Preview + Development

### 4. Redéployer

Une fois la variable ajoutée, Vercel redéploiera automatiquement.

## 🧪 Tests à effectuer :

### 1. Vérifier les variables

Allez sur : `https://alexia-energies.vercel.app/api/test-env`

- Vérifiez que `RESEND_API_KEY` affiche "✅ Défini"

### 2. Tester forgot-password

1. Allez sur : `https://alexia-energies.vercel.app/forgot-password`
2. Entrez un email existant
3. Vérifiez que vous recevez l'email !

## 📧 Template email inclus :

- Design professionnel et responsive
- Bouton de réinitialisation
- Lien de fallback
- Messages de sécurité
- Expiration 1h

## 🎯 Avantages de Resend vs EmailJS :

- ✅ Fonctionne côté serveur
- ✅ Plus fiable en production
- ✅ Templates HTML intégrés
- ✅ Logs et analytics
- ✅ Gratuit jusqu'à 3000 emails/mois
