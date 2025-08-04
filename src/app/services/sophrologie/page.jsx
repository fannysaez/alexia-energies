"use client"
import React, { useState } from "react";
import Image from "next/image";
import Button from "@/app/components/button/button";
import ServiceSidebar from "@/app/components/services-sidebar/serviceSidebar";
import Modal from "@/app/components/modal/modal";
import Link from "next/link";
import styles from "../style.module.css";
import StarBlack from "/public/img/boutons/VectorStarBlack.svg"; // Icône étoile noire


export default function SophrologiePage() {
    const serviceType = "sophrologie";
    const breadcrumbText = "sophrologie";
    const benefits = [
        "Gestion du stress et des émotions",
        "Amélioration du sommeil",
        "Développement de la confiance en soi",
        "Préparation mentale aux défis"
    ];
    const sophrologiePricing = [
        {
            description: "Séance individuelle",
            price: "70€",
            duration: "1h"
        },
        {
            description: "Forfait 5 séances",
            price: "320€",
            duration: "(-8%)"
        },
        {
            description: "Séance de groupe",
            price: "25€",
            duration: "1h15"
        },
        {
            description: "En ligne",
            price: "Même tarif, même accompagnement"
        }
    ];
    const articles = [
        {
            id: 1,
            title: "Sophrologie et gestion du stress",
            description: "Découvrez comment la sophrologie peut vous aider à mieux gérer le stress quotidien.",
            image: "/img/services/sophrologie/Elderly Woman Meditating by Lake in Autumn.webp",
            link: "/articles/sophrologie-gestion-stress"
        },
        {
            id: 2,
            title: "Techniques de respiration en sophrologie",
            description: "Apprenez les exercices de respiration pour retrouver calme et sérénité.",
            image: "/img/services/sophrologie/Tranquil Beauty Spa Facial.webp",
            link: "/articles/sophrologie-techniques-respiration"
        },
        {
            id: 3,
            title: "Sophrologie et préparation mentale",
            description: "Utilisez la sophrologie pour vous préparer mentalement aux défis importants.",
            image: "/img/services/sophrologie/Peaceful Wellness Therapy Session.webp",
            link: "/articles/sophrologie-preparation-mentale"
        }

    ];

    // Images galerie
    const gallery = [
        "/img/services/sophrologie/Elderly Woman Meditating by Lake in Autumn.webp",
        "/img/services/sophrologie/Tranquil Beauty Spa Facial.webp"
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
                                src="/img/services/sophrologie/Peaceful Wellness Therapy Session.webp"
                                alt="Séance de sophrologie"
                                width={600}
                                height={340}
                                style={{ borderRadius: 12, width: "100%", objectFit: "cover" }}
                            />
                        </div>

                        {/* Sous-titre */}
                        <h2
                            style={{
                                fontFamily: "'SortsMillGoudy-Regular', serif",
                                color: "var(--primary-color)",
                                fontSize: "1.5rem",
                                marginBottom: 16,
                            }}
                        >
                            Qu&apos;est-ce que la sophrologie&nbsp;?
                        </h2>

                        {/* Description */}
                        <p className={styles.description}>
                            La sophrologie est une méthode psycho-corporelle de relaxation et de développement personnel,
                            créée dans les années 1960 par le neuropsychiatre Alfonso Caycedo. Elle intègre des techniques
                            occidentales (hypnose, relaxation) et des méthodes orientales (yoga, méditation, zen).
                        </p>

                        <h3 className={styles.benefitsTitle}>Bienfaits de la {serviceType}</h3>
                        {/* Description */}
                        <p className={styles.description}>
                            La sophrologie est une méthode douce qui combine relaxation, respiration et visualisation pour
                            harmoniser le corps et l&apos;esprit. Voici ses principaux bienfaits développés selon mon approche
                            intégrative.
                        </p>
                        <ul className={styles.benefitList}>
                            <li className={styles.benefitItemList}>
                                <span className={styles.benefitIcon}>✓</span>
                                <strong style={{ color: "var(--benefit-strong-color)" }}> Réduction du stress et de l&apos;anxiété</strong>
                                <br />
                                <p className={styles.benefitParagraph}>
                                    Grâce à des techniques de respiration contrôlée et de relaxation musculaire, la sophrologie
                                    diminue significativement le niveau de stress. Elle régule l&apos;activité du système nerveux et
                                    favorise un état de calme intérieur durable.
                                </p>
                            </li>
                            <li className={styles.benefitItemList}>
                                <span className={styles.benefitIcon}>✓</span>
                                <strong style={{ color: "var(--benefit-strong-color)" }}> Amélioration du sommeil</strong>
                                <br />
                                <p className={styles.benefitParagraph}>
                                    Les exercices de détente et de visualisation préparent naturellement le corps et l&apos;esprit
                                    au repos. La sophrologie aide à évacuer les tensions accumulées et facilite l&apos;endormissement
                                    pour un sommeil plus réparateur.
                                </p>
                            </li>
                            <li className={styles.benefitItemList}>
                                <span className={styles.benefitIcon}>✓</span>
                                <strong style={{ color: "var(--benefit-strong-color)" }}> Renforcement de la confiance en soi</strong>
                                <br />
                                <p className={styles.benefitParagraph}>
                                    Par des exercices de visualisation positive et d&apos;ancrage, la sophrologie développe
                                    l&apos;estime de soi. Elle permet de reconnecter avec ses ressources intérieures et de cultiver
                                    une image positive de soi-même.
                                </p>
                            </li>
                            <li className={styles.benefitItemList}>
                                <span className={styles.benefitIcon}>✓</span>
                                <strong style={{ color: "var(--benefit-strong-color)" }}> Équilibre émotionnel</strong>
                                <br />
                                <p className={styles.benefitParagraph}>
                                    Les techniques sophrologiques aident à prendre du recul face aux émotions fortes (colère,
                                    tristesse, peur). Elles favorisent une meilleure gestion émotionnelle et développent
                                    la capacité à retrouver un équilibre rapidement.
                                </p>
                            </li>
                        </ul>

                        {/* Galerie d'images */}
                        <div className={styles.galleryImages}>
                            {gallery.map((img, idx) => (
                                <Image
                                    key={idx}
                                    src={img}
                                    alt={`Galerie sophrologie ${idx + 1}`}
                                    width={280}
                                    height={160}
                                    className={styles.galleryImg}
                                />
                            ))}
                        </div>

                        {/* Bienfaits résumés */}
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
                    <div className={styles.sidebar}>
                        <ServiceSidebar
                            activeService="Sophrologie"
                            pricing={sophrologiePricing}
                            articles={articles}
                            buttonText="Réservez"
                            onReserveClick={() => openModal("sophrologie")} isReserveButton={true}
                            leftVector={<Image src={StarBlack} alt="" width={16} height={16} />}
                            rightVector={<Image src={StarBlack} alt="" width={16} height={16} />}
                            style={{ whiteSpace: 'nowrap' }}
                        />
                        <>
                            <Modal
                                isOpen={modalState.isOpen}
                                onClose={closeModal}
                                type={modalState.type}
                                service={modalState.service}
                            />
                        </>

                    </div>
                </div>
            </section>
        </div>
    );
}
