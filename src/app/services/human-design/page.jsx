"use client"
import React, { useState } from "react";
import Image from "next/image";
import Button from "@/app/components/button/button";
import ServiceSidebar from "@/app/components/services-sidebar/serviceSidebar";
import Modal from "@/app/components/modal/modal";
import Link from "next/link";
import styles from "../style.module.css";
import StarBlack from "/public/img/boutons/VectorStarBlack.svg"; // Icône étoile noire


export default function HumanDesignPage() {
    const serviceType = "human-design";
    const breadcrumbText = "human-design";
    const benefits = [
        "Découverte de votre type énergétique",
        "Compréhension de votre stratégie de vie",
        "Identification de votre autorité intérieure",
        "Optimisation de votre quotidien"
    ];

    const humanDesignPricing = [
        {
            description: "Lecture de base",
            price: "120€",
            duration: "1h30"
        },
        {
            description: "Analyse complète",
            price: "180€",
            duration: "2h + support"
        },
        {
            description: "Suivi d'intégration",
            price: "80€",
            duration: "1h"
        },
        {
            description: "À distance",
            price: "Même tarif, même qualité"
        }
    ];

    const articles = [
        {
            id: 1,
            title: "Comprendre votre type en Human Design",
            description: "Découvrez les 5 types énergétiques et leurs spécificités pour mieux vous connaître.",
            image: "/img/services/human-design/Serenity in Gesture_ Hands in Prayer or Meditation.webp",
            link: "#/articles/comprendre-votre-type"
        },
        {
            id: 2,
            title: "Votre stratégie personnelle révélée",
            description: "Apprenez à utiliser votre stratégie unique pour prendre les bonnes décisions.",
            image: "/img/services/human-design/Tranquility Zen Space.webp",
            link: "#/articles/votre-strategie-personnelle"
        },
        {
            id: 3,
            title: "L'autorité intérieure : votre boussole",
            description: "Développez votre capacité à suivre votre autorité intérieure pour une vie alignée.",
            image: "/img/services/human-design/Mystical Meditation Setting with Tarot and Crystals.webp",
            link: "#/articles/votre-boussole"
        }
    ];

    // Images galerie
    const gallery = [
        "/img/services/human-design/Serenity in Gesture_ Hands in Prayer or Meditation.webp",
        "/img/services/human-design/Tranquility Zen Space.webp"
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
                                src="/img/services/human-design/Mystical Meditation Setting with Tarot and Crystals.webp"
                                alt="Consultation Human Design"
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
                            Qu'est-ce que le Human Design&nbsp;?
                        </h2>

                        {/* Description */}
                        <p className={styles.description}>
                            Le Human Design est un système révolutionnaire qui combine l'astrologie, l'I Ching,
                            la Kabbale et la physique quantique pour révéler votre blueprint énergétique unique.
                            Cette approche innovante vous permet de comprendre votre mécanisme énergétique naturel,
                            votre stratégie de vie optimale et votre autorité intérieure pour prendre des décisions
                            alignées avec votre vraie nature.
                        </p>

                        <h3 className={styles.benefitsTitle}>Bienfaits du {serviceType}</h3>
                        {/* Description */}
                        <p className={styles.description}>
                            Découvrez votre manuel d'utilisation personnel grâce à l'analyse de votre graphique
                            corporel. Je vous guide dans la compréhension de votre type énergétique, votre stratégie
                            et votre autorité pour vivre une vie plus fluide et authentique.
                        </p>
                        <ul style={{ listStyle: "none", padding: 0 }}>
                            <li style={{ marginBottom: 20 }}>
                                <span className={styles.benefitIcon}>✓</span>
                                <strong style={{ color: "var(--benefit-strong-color)" }}> Découverte de votre type énergétique</strong><br />
                                <p>
                                    Identifiez si vous êtes Générateur, Projecteur, Manifesteur, Réflecteur ou
                                    Générateur Manifestant. Chaque type a sa propre façon de fonctionner et
                                    d'interagir avec le monde. Comprendre votre type vous libère des conditionnements
                                    et vous permet de vivre selon votre nature authentique.
                                </p>
                            </li>
                            <li style={{ marginBottom: 20 }}>
                                <span className={styles.benefitIcon}>✓</span>
                                <strong style={{ color: "var(--benefit-strong-color)" }}> Alignement avec votre stratégie personnelle</strong><br />
                                <p>
                                    Apprenez votre stratégie unique : attendre pour répondre, être invité,
                                    informer avant d'agir, ou attendre un cycle lunaire. Cette stratégie est
                                    votre clé pour une vie sans résistance, où les opportunités se présentent
                                    naturellement à vous.
                                </p>
                            </li>
                            <li style={{ marginBottom: 20 }}>
                                <span className={styles.benefitIcon}>✓</span>
                                <strong style={{ color: "var(--benefit-strong-color)" }}> Connexion à votre autorité intérieure</strong><br />
                                <p>
                                    Développez votre capacité à prendre des décisions justes grâce à votre
                                    autorité : sacrale, émotionnelle, splénique, du soi, lunaire, mentale
                                    ou environnementale. Fini les hésitations et les mauvais choix,
                                    suivez votre boussole intérieure.
                                </p>
                            </li>
                            <li>
                                <span className={styles.benefitIcon}>✓</span>
                                <strong style={{ color: "var(--benefit-strong-color)" }}> Optimisation de vos relations</strong><br />
                                <p>
                                    Comprenez comment vous interagissez avec les autres grâce à l'analyse
                                    des centres définis et non-définis. Améliorez vos relations personnelles
                                    et professionnelles en respectant votre design et celui des autres pour
                                    des interactions plus harmonieuses.
                                </p>
                            </li>
                        </ul>

                        {/* Galerie d'images */}
                        <div className={styles.galleryImages}>
                            {gallery.map((img, idx) => (
                                <Image
                                    key={idx}
                                    src={img}
                                    alt={`Galerie Human Design ${idx + 1}`}
                                    width={280}
                                    height={160}
                                    className={styles.galleryImg}
                                />))}
                        </div>

                        {/* Bienfaits du Human Design */}
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
                        activeService="Human Design"
                        pricing={humanDesignPricing}
                        articles={articles}
                        buttonText="Réservez"
                        onReserveClick={() => openModal("humandesign")}
                        isReserveButton={true}
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
            </section>
        </div>
    );
}
