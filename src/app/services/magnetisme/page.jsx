"use client"
import React, { useState } from "react";
import Image from "next/image";
import Button from "@/app/components/button/button";
import ServiceSidebar from "@/app/components/services-sidebar/serviceSidebar";
import Modal from "@/app/components/modal/modal";
import Link from "next/link";
import styles from "../style.module.css";
import StarBlack from "/public/img/boutons/VectorStarBlack.svg"; // Icône étoile noire

export default function MagnetismePage() {
    const serviceType = "magnétisme";
    const breadcrumbText = "magnétisme";
    const benefits = [
        "Harmonisation des énergies",
        "Réduction du stress et de l'anxiété",
        "Amélioration du sommeil",
        "Soulagement des douleurs chroniques"
    ];
    const magnetismePricing = [
        {
            description: "Séance découverte",
            price: "80€",
            duration: "1h"
        },
        {
            description: "Forfait 3 séances",
            price: "210€",
            duration: "(-10%)"
        },
        {
            description: "À distance",
            price: "Même tarif, même efficacité"
        }
    ];
    const articles = [
        {
            id: 1,
            title: "Les bienfaits du magnétisme sur le stress",
            description: "Découvrez comment le magnétisme peut vous aider à retrouver sérénité et équilibre intérieur.",
            image: "/img/services/magnetisme/Serene Spa Moment.webp",
            link: "/articles/magnetisme-bienfaits"
        },
        {
            id: 2,
            title: "Séance de magnétisme : à quoi s'attendre ?",
            description: "Comprenez le déroulement d'une séance et préparez-vous à cette expérience unique.",
            image: "/img/services/magnetisme/Indoor Meditation.webp",
            link: "/articles/magnetisme-seance"
        },
        {
            id: 3,
            title: "Magnétisme et sommeil réparateur",
            description: "Comment le magnétisme peut améliorer la qualité de votre sommeil naturellement.",
            image: "/img/services/magnetisme/Serene Crystal Meditation.webp",
            link: "/articles/magnetisme-sommeil"
        }
    ];

    // Images galerie (exemple)
    const gallery = [
        "/img/services/magnetisme/Serene Spa Moment.webp",
        "/img/services/magnetisme/Serene Crystal Meditation.webp"
    ];

    const [modalState, setModalState] = useState({
        isOpen: false,
        type: 'reservation',
        service: null
    });

    const openModal = (service) => {
        setModalState({
            isOpen: true,
            type: 'reservation',
            service
        });
    };

    const closeModal = () => {
        setModalState({
            isOpen: false,
            type: '',
            service: null
        });
    };

    return (
        <div className={styles.container}>
            {/* Section Hero avec image de fond */}
            <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Service - {serviceType}</h1>
                    <nav className={styles.heroBreadcrumb}>
                        <Link href="/">Accueil</Link>
                        <span>›</span>
                        <Link href="#services">Services</Link>
                        <span>›</span>
                        <span>{breadcrumbText}</span>
                    </nav>
                </div>
            </section>

            {/* Section contenu principal */}
            <section className={styles.contentSection}>
                <div className={styles.contentWrapper}>
                    {/* Colonne gauche */}
                    <div className={styles.mainContent}>
                        {/* Image principale */}
                        <div>
                            <Image
                                src="/img/services/magnetisme/Indoor Meditation.webp"
                                alt="Séance de magnétisme"
                                width={600}
                                height={340}
                                style={{ borderRadius: 12, width: "100%", objectFit: "cover" }}
                            />
                        </div>

                        {/* Sous-titre */}
                        <h2 style={{
                            fontFamily: "'SortsMillGoudy-Regular', serif",
                            color: "var(--primary-color)",
                            fontSize: "1.5rem",
                            marginBottom: 16
                        }}>
                            Qu'est-ce que le magnétisme&nbsp;?
                        </h2>

                        {/* Description */}
                        <p className={styles.description}>
                            Le magnétisme est une pratique énergétique qui vise à rétablir l'équilibre du corps et
                            de l'esprit en harmonisant les flux énergétiques. Grâce à des techniques douces,
                            le praticien aide à libérer les blocages et à favoriser la circulation de l'énergie vitale.
                            Cette approche naturelle peut être bénéfique pour soulager divers maux, réduire le stress
                            , et améliorer le bien-être général.
                        </p>

                        <h3 className={styles.benefitsTitle}>Bienfaits du {serviceType}</h3>
                        {/* Description */}
                        <p className={styles.description}>
                            C'est une pratique énergétique visant à rééquilibrer les flux vitaux du corps.
                            Guidé par l'écoute intuitive, je vous accompagne dans la libération des blocages physiques
                            et émotionnels pour restaurer l'harmonie entre corps et esprit.
                        </p>
                        <ul style={{ listStyle: "none", padding: 0 }}>
                            <li style={{ marginBottom: 20 }}>
                                <span className={styles.benefitIcon}>✓</span>
                                <strong style={{ color: "var(--benefit-strong-color)" }}> Libération des entraves énergétiques</strong><br />
                                <p>
                                    Le magnétiseur identifie et dissout les blocages énergétiques (nœuds,  stagnations)
                                    qui perturbent votre vitalité. Ce nettoyage subtil favorise une circulation fluide de
                                    l’énergie, essentielle pour retrouver  dynamisme et clarté mentale.
                                </p>
                            </li>
                            <li style={{ marginBottom: 20 }}>
                                <span className={styles.benefitIcon}>✓</span>
                                <strong style={{ color: "var(--benefit-strong-color)" }}> Harmonisation corps-esprit</strong><br />
                                <p>
                                    En reconnectant les corps physique et subtils, le magnétisme rétablit une  cohérence
                                    interne. Cette harmonisation se traduit par une meilleure  gestion des émotions, une
                                    sensation de légèreté et une paix intérieure  durable.
                                </p>
                            </li>
                            <li style={{ marginBottom: 20 }}>
                                <span className={styles.benefitIcon}>✓</span>
                                <strong style={{ color: "var(--benefit-strong-color)" }}> Apaisement des tensions émotionnelles</strong><br />
                                <p>
                                    Stress, anxiété, traumatismes anciens… Le magnétisme agit comme un catalyseur  de
                                    libération émotionnelle. Il aide à dissoudre les charges négatives  stockées dans le corps,
                                    pour un soulagement profond et une plus grande  sérénité.
                                </p>
                            </li>
                            <li>
                                <span className={styles.benefitIcon}>✓</span>
                                <strong style={{ color: "var(--benefit-strong-color)" }}> Renforcement du système immunitaire</strong><br />
                                <p>
                                    En stimulant les défenses naturelles, le magnétisme soutient la capacité  d’autoguérison du
                                    corps. Idéal pour prévenir les maladies, accélérer la  récupération ou accompagner un traitement
                                    médical (en complément, jamais en remplacement).
                                </p>
                            </li>
                        </ul>

                        {/* Galerie d'images */}
                        <div className={styles.galleryImages}>
                            {gallery.map((img, idx) => (
                                <Image
                                    key={idx}
                                    src={img}
                                    alt={`Galerie Magnétisme ${idx + 1}`}
                                    width={280}
                                    height={160}
                                    className={styles.galleryImg}
                                />
                            ))}
                        </div>

                        {/* Bienfaits du magnétisme */}
                        <div className={styles.benefitsSection}>
                            <ul className={styles.benefitsList}>
                                {benefits.map((benefit, index) => (
                                    <li key={index} className={styles.benefitItem}>
                                        <span className={styles.benefitIcon}>✓</span>
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <ServiceSidebar
                        activeService="Magnétisme"
                        pricing={magnetismePricing}
                        articles={articles}
                        buttonText="Réservez"
                        onReserveClick={() => openModal("magnetisme")}
                    />
                </div>
            </section>

            <Modal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                type={modalState.type}
                service={modalState.service}
            />
        </div>
    );
}