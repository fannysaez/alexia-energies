
export const metadata = {
    title: "Mentions légales | Alexia Énergies",
    description: "Consultez les mentions légales du site Alexia Énergies : informations sur l’éditeur, l’hébergement et la protection des données.",
    keywords: [
        "mentions légales",
        "Alexia Énergies",
        "éditeur du site",
        "hébergement",
        "protection des données",
        "informations légales"
    ],
};

import React from "react";
import Link from "next/link";
import styles from "./mentions-legales.module.css";

export default function Mentions_LegaesPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.mainTitle}>Mentions légales</h1>
            {/* Fil d'Ariane sous le titre */}
            <nav className={styles.breadcrumb} aria-label="Fil d'Ariane">
                <Link href="/">Accueil</Link>
                <span>›</span>
                <span>Mentions légales</span>
            </nav>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>1. Présentation du site</h2>
                <p className={styles.text}>
                    En vertu de l’article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique, il est précisé aux utilisateurs du site l’identité des différents intervenants dans le cadre de sa réalisation et de son suivi :<br /><br />
                    <strong>Propriétaire :</strong> Alexia – rue du Lilas à Lens<br />
                    <strong>Création du site web :</strong> Fanny SAEZ<br />
                    {/* <strong>Responsable publication :</strong> Astronex –  contact@astronex-alexia.fr<br /> */}
                    <strong>Webmaster :</strong> Fanny SAEZ – fanny.saez.0486@gmail.com<br />
                    {/* <strong>Hébergeur :</strong> Infomaniak – 26 Avenue de la Praille, 1227 Carouge, Suisse<br />
                    <strong>Crédits photos :</strong> Adobe Stock, Pexels<br /> */}
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>2. Conditions générales d’utilisation du site et des services proposés</h2>
                <p className={styles.text}>
                    L’utilisation du site implique l’acceptation pleine et entière des conditions générales d’utilisation ci-après décrites. Ces conditions d’utilisation sont susceptibles d’être modifiées ou complétées à tout moment, les utilisateurs du site sont donc invités à les consulter de manière régulière.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>3. Description des services fournis</h2>
                <p className={styles.text}>
                    Le site a pour objet de fournir une information concernant l’ensemble des activités de la société. Toutes les informations indiquées sur le site sont données à titre indicatif, et sont susceptibles d’évoluer.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>4. Limitations contractuelles sur les données techniques</h2>
                <p className={styles.text}>
                    Le site Internet ne pourra être tenu responsable de dommages matériels liés à l’utilisation du site. De plus, l’utilisateur du site s’engage à accéder au site en utilisant un matériel récent, ne contenant pas de virus et avec un navigateur de dernière génération mis-à-jour.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>5. Propriété intellectuelle et contrefaçons</h2>
                <p className={styles.text}>
                    Alexia Anduskiewicz est propriétaire des droits de propriété intellectuelle ou détient les droits d’usage sur tous les éléments accessibles sur le site, notamment les textes, images, graphismes, logo, icônes, sons, logiciels. Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de : Alexia Anduskiewicz.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>6. Limitations de responsabilité</h2>
                <p className={styles.text}>
                    Alexia Anduskiewicz ne pourra être tenue responsable des dommages directs et indirects causés au matériel de l’utilisateur, lors de l’accès au site, et résultant soit de l’utilisation d’un matériel ne répondant pas aux spécifications indiquées au point 4, soit de l’apparition d’un bug ou d’une incompatibilité.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>7. Gestion des données personnelles</h2>
                <p className={styles.text}>
                    Les données personnelles sont notamment protégées par la loi n° 78-87 du 6 janvier 1978, la loi n° 2004-801 du 6 août 2004, l’article L. 226-13 du Code pénal et la Directive Européenne du 24 octobre 1995. Aucune information personnelle de l’utilisateur du site n’est publiée à l’insu de l’utilisateur, échangée, transférée, cédée ou vendue sur un support quelconque à des tiers.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>8. Liens hypertextes et cookies</h2>
                <p className={styles.text}>
                    Le site contient un certain nombre de liens hypertextes vers d’autres sites, mis en place avec l’autorisation de Alexia Anduskiewicz. La navigation sur le site est susceptible de provoquer l’installation de cookie(s) sur l’ordinateur de l’utilisateur. Un cookie est un fichier de petite taille, qui ne permet pas l’identification de l’utilisateur, mais qui enregistre des informations relatives à la navigation d’un ordinateur sur un site.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>9. Droit applicable et attribution de juridiction</h2>
                <p className={styles.text}>
                    Tout litige en relation avec l’utilisation du site est soumis au droit français. Il est fait attribution exclusive de juridiction aux tribunaux compétents de Paris.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>10. Les principales lois concernées</h2>
                <p className={styles.text}>
                    Loi n° 78-87 du 6 janvier 1978, notamment modifiée par la loi n° 2004-801 du 6 août 2004 relative à l’informatique, aux fichiers et aux libertés. Loi n° 2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>11. Lexique</h2>
                <p className={styles.text}>
                    Utilisateur : Internaute se connectant, utilisant le site susnommé.<br />
                    Informations personnelles : « les informations qui permettent, sous quelque forme que ce soit, directement ou non, l’identification des personnes physiques auxquelles elles s’appliquent » (article 4 de la loi n° 78-17 du 6 janvier 1978).
                </p>
            </section>
        </div>
    );
}