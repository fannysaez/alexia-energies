export const metadata = {
    title: "Politique de Confidentialité | Alexia Énergies",
    description: "Découvrez comment Alexia Énergies protège vos données personnelles et respecte votre vie privée conformément au RGPD.",
    keywords: [
        "politique de confidentialité",
        "protection des données",
        "RGPD",
        "vie privée",
        "Alexia Énergies",
        "données personnelles",
        "droits utilisateurs"
    ],
};

import React from "react";
import Link from "next/link";
import styles from "./politique-confidentialite.module.css";

export default function PolitiqueConfidentialitePage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.mainTitle}>Politique de Confidentialité</h1>
            
            {/* Fil d'Ariane sous le titre */}
            <nav className={styles.breadcrumb} aria-label="Fil d'Ariane">
                <Link href="/">Accueil</Link>
                <span>›</span>
                <span>Politique de Confidentialité</span>
            </nav>

            <div className={styles.highlight}>
                <p>
                    <strong>Dernière mise à jour :</strong> 22 septembre 2025<br />
                    Cette politique de confidentialité explique comment Alexia Énergies collecte, utilise et protège vos données personnelles.
                </p>
            </div>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>1. Responsable du traitement</h2>
                <p className={styles.text}>
                    <strong>Fanny SAEZ</strong><br />
                    Adresse : Rue du Lilas, Lens<br />
                    Email : fanny.saez.0486@gmail.com<br />
                    Téléphone : 06.61.05.15.05
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>2. Données collectées</h2>
                <p className={styles.text}>
                    Nous collectons les données suivantes :
                </p>
                <ul className={styles.text}>
                    <li><strong>Inscription newsletter :</strong> Adresse email</li>
                    <li><strong>Formulaire de contact :</strong> Nom, prénom, email, message</li>
                    <li><strong>Comptes utilisateurs :</strong> Nom, prénom, email, mot de passe (hashé)</li>
                    <li><strong>Navigation :</strong> Adresse IP, cookies techniques, pages visitées</li>
                    <li><strong>Favoris :</strong> Articles sauvegardés (utilisateurs connectés)</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>3. Finalités du traitement</h2>
                <p className={styles.text}>
                    Vos données sont utilisées pour :
                </p>
                <ul className={styles.text}>
                    <li><strong>Newsletter :</strong> Envoi d'informations sur nos services et actualités</li>
                    <li><strong>Contact :</strong> Répondre à vos demandes et questions</li>
                    <li><strong>Comptes :</strong> Gestion de l'authentification et personnalisation</li>
                    <li><strong>Favoris :</strong> Sauvegarde de vos articles préférés</li>
                    <li><strong>Statistiques :</strong> Analyse du trafic et amélioration du site</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>4. Base légale</h2>
                <p className={styles.text}>
                    Le traitement de vos données repose sur :
                </p>
                <ul className={styles.text}>
                    <li><strong>Consentement :</strong> Newsletter, cookies non-essentiels</li>
                    <li><strong>Intérêt légitime :</strong> Amélioration des services, statistiques</li>
                    <li><strong>Exécution du contrat :</strong> Gestion des comptes utilisateurs</li>
                    <li><strong>Obligation légale :</strong> Conservation de certaines données</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>5. Durée de conservation</h2>
                <p className={styles.text}>
                    Nous conservons vos données pendant :
                </p>
                <ul className={styles.text}>
                    <li><strong>Newsletter :</strong> Jusqu'à désinscription</li>
                    <li><strong>Comptes inactifs :</strong> 3 ans sans connexion</li>
                    <li><strong>Messages de contact :</strong> 2 ans</li>
                    <li><strong>Logs de sécurité :</strong> 12 mois</li>
                    <li><strong>Cookies :</strong> 13 mois maximum</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>6. Partage des données</h2>
                <p className={styles.text}>
                    Vos données ne sont <strong>jamais vendues</strong>. Elles peuvent être partagées avec :
                </p>
                <ul className={styles.text}>
                    <li><strong>Prestataires techniques :</strong> Vercel (hébergement), Neon (base de données), Cloudinary (images)</li>
                    <li><strong>Services email :</strong> Resend pour les emails transactionnels</li>
                    <li><strong>Analytics :</strong> Données anonymisées uniquement</li>
                    <li><strong>Obligations légales :</strong> Autorités compétentes si requis par la loi</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>7. Sécurité</h2>
                <p className={styles.text}>
                    Nous mettons en place des mesures de sécurité appropriées :
                </p>
                <ul className={styles.text}>
                    <li><strong>Chiffrement :</strong> HTTPS sur tout le site</li>
                    <li><strong>Mots de passe :</strong> Hachage avec bcrypt</li>
                    <li><strong>Authentification :</strong> Tokens JWT sécurisés</li>
                    <li><strong>Accès :</strong> Limitation aux personnes autorisées</li>
                    <li><strong>Monitoring :</strong> Surveillance des accès et incidents</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>8. Vos droits</h2>
                <p className={styles.text}>
                    Conformément au RGPD, vous disposez des droits suivants :
                </p>
                <ul className={styles.text}>
                    <li><strong>Accès :</strong> Obtenir une copie de vos données</li>
                    <li><strong>Rectification :</strong> Corriger des données inexactes</li>
                    <li><strong>Effacement :</strong> Supprimer vos données ("droit à l'oubli")</li>
                    <li><strong>Limitation :</strong> Restreindre le traitement</li>
                    <li><strong>Portabilité :</strong> Récupérer vos données dans un format lisible</li>
                    <li><strong>Opposition :</strong> Vous opposer au traitement</li>
                    <li><strong>Retrait du consentement :</strong> À tout moment</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>9. Cookies</h2>
                <p className={styles.text}>
                    Notre site utilise des cookies pour :
                </p>
                <ul className={styles.text}>
                    <li><strong>Cookies essentiels :</strong> Fonctionnement du site (authentification)</li>
                    <li><strong>Cookies de performance :</strong> Statistiques anonymes</li>
                    <li><strong>Cookies de préférences :</strong> Mémorisation de vos choix</li>
                </ul>
                <p className={styles.text}>
                    Vous pouvez gérer vos préférences cookies via la bannière ou dans les paramètres de votre navigateur.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>10. Transferts internationaux</h2>
                <p className={styles.text}>
                    Certains de nos prestataires peuvent être situés hors UE :
                </p>
                <ul className={styles.text}>
                    <li><strong>Vercel :</strong> États-Unis, protégé par clauses contractuelles types</li>
                    <li><strong>Cloudinary :</strong> États-Unis, certifié pour les transferts UE-US</li>
                </ul>
                <p className={styles.text}>
                    Tous les transferts respectent les exigences du RGPD.
                </p>
            </section>

            <div className={styles.contactBox}>
                <h3>💡 Exercer vos droits</h3>
                <p className={styles.text}>
                    Pour exercer vos droits ou pour toute question concernant cette politique :
                </p>
                <p className={styles.text}>
                    <strong>Email :</strong> fanny.saez.0486@gmail.com<br />
                    <strong>Courrier :</strong> Rue du Lilas, Lens<br />
                    <strong>Délai de réponse :</strong> 30 jours maximum
                </p>
                <p className={styles.text}>
                    <strong>Réclamation :</strong> Vous pouvez également déposer une réclamation auprès de la CNIL (www.cnil.fr).
                </p>
            </div>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>11. Modifications</h2>
                <p className={styles.text}>
                    Cette politique peut être modifiée. Les changements significatifs vous seront notifiés par email ou via une bannière sur le site. Date de dernière modification en haut de cette page.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>12. Contact</h2>
                <p className={styles.text}>
                    Pour toute question concernant cette politique de confidentialité :<br />
                    <strong>Fanny SAEZ</strong><br />
                    Email : fanny.saez.0486@gmail.com<br />
                    Adresse : Rue du Lilas, Lens
                </p>
            </section>
        </div>
    );
}