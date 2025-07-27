export const metadata = {
    title: "Qui suis-je ? | Alexia Énergies",
    description: "Apprenez à connaître Alexia, son parcours, ses valeurs et son expertise dans l’accompagnement au mieux-être, la gestion du stress et l’épanouissement personnel.",
    keywords: [
        "Alexia Anduskiewicz",
        "à propos",
        "parcours",
        "valeurs",
        "bien-être",
        "accompagnement",
        "gestion du stress",
        "développement personnel",
        "magnétisme",
        "santé globale"
    ],
};

import React from "react";
import Image from "next/image";
import Button from "@/app/components/button/button";
import Link from "next/link";
import styles from "./a-propos.module.css";
import About from "@/app/components/accueil/about/section2";
import StarBlack from "/public/img/boutons/VectorStarBlack.svg";

export default function AproposPage() {
    return (
        <div className={styles.container}>
            <section className={styles.heroSection}>
                {/* Fil d'Ariane */}
                <nav className={styles.breadcrumb}>
                    <Link href="/">Accueil</Link>
                    <span>›</span>
                    <span>Qui-suis-je ?</span>
                </nav>

                {/* Titre principal */}
                <h1 className={styles.mainTitle}>Qui-suis-je ?</h1>

                <div className={styles.flexWrapper}>
                    {/* Section texte à gauche */}
                    <div className={styles.textSection}>
                        <p className={styles.description}>
                            Professionnelle engagée dans le domaine social, j&apos;ai accompagné l&apos;éducation,
                            l&apos;insertion sociale et professionnelle des personnes. Mon parcours m&apos;a menée à
                            comprendre l&apos;importance de la santé globale (physique et mentale) et du
                            mieux-être. Comme soutien au mieux-être, dans une démarche d&apos;écoute de soi et
                            d&apos;épanouissement personnel.
                        </p>

                        {/* Statistiques EN OVERLAY */}
                        <div className={styles.statsContainer}>
                            <div className={styles.statCard}>
                                <span className={styles.statNumber}>+100</span>
                                <span className={styles.statLabel}>Séances données</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statNumber}>2019</span>
                                <span className={styles.statLabel}>Début séances</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statNumber}>3</span>
                                <span className={styles.statLabel}>Accompagnements personnalisés</span>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className={styles.timeline}>
                            <div className={styles.timelineItem}>
                                Mars 2022 | Initiation à l&apos;ouverture de ses mémoires oisothiques avec Didier Bonnard
                            </div>
                            <div className={styles.timelineItem}>
                                Janvier 2022 | Membre stagiaire du CHOMA
                            </div>
                            <div className={styles.timelineItem}>
                                2021 (2020) - Diplôme Universitaire de Gestion du Stress et des Émotions à l&apos;université d&apos;Artois
                            </div>
                            <div className={styles.timelineItem}>
                                2020 | Initiation au pendule avec Estelle de Ravate via ses potentiels
                            </div>
                        </div>
                        {/* Bouton Services */}
                        <div className={styles.button}>
                            <Button
                                text="Services"
                                link="/services/magnetisme"
                                variant="secondary"
                                leftVector={<Image src={StarBlack} alt="" width={16} height={16} />}
                                rightVector={<Image src={StarBlack} alt="" width={16} height={16} />}
                                style={{ whiteSpace: 'nowrap' }}
                            />
                        </div>
                    </div>
                    {/* Section image à droite */}
                    <div className={styles.imageSection}>
                        <img
                            src="/img/a-propos/qui-suis-je/photo.webp"
                            alt="Photo de profil - À propos"
                            className={styles.profileImage}
                        />


                    </div>
                </div>
            </section>

            {/* Section 2 importée */}
            <About />
        </div>
    );
}
