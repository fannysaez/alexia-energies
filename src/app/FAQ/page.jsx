"use client"// Import de React pour JSX
import React, { useState } from "react";
import Image from "next/image"; // Composant d'image optimisé Next.js
import Link from "next/link"; // Pour la navigation Next.js
import styles from "./f-a-q.module.css"; // Import des styles modulaires
import { FaChevronDown } from "react-icons/fa";// Icône chevron vers le bas
import { FaChevronUp } from "react-icons/fa";  // Icône chevron vers le haut

export default function FAQPage() {
    const [openItems, setOpenItems] = useState({ 0: true }); // Premier élément ouvert par défaut

    const faqData = [
        {
            question: "Quels sont les douze signes du zodiaque ?",
            answer: "Bélier, Taureau, Gémeaux, Cancer, Lion, Vierge, Balance, Scorpion, Sagittaire, Capricorne, Verseau, Poissons."
        },
        {
            question: "Qu'est-ce qu'un thème astral et comment l'interpréter ?",
            answer: "Un thème astral est une carte du ciel au moment de votre naissance. Il révèle vos traits de personnalité, vos forces, vos défis et votre chemin de vie selon la position des astres."
        },
        {
            question: "L'astrologie peut-elle prédire l'avenir ?",
            answer: "L'astrologie ne prédit pas l'avenir avec certitude, mais donne des indications sur les énergies et tendances potentielles. Elle aide à comprendre les cycles et à prendre des décisions plus éclairées."
        },
        {
            question: "Quel rôle jouent les corps célestes en astrologie ?",
            answer: "Chaque corps céleste représente un aspect différent de l'expérience humaine. Le Soleil représente votre identité, la Lune vos émotions, Mercure votre communication, Vénus vos relations, etc."
        },
        {
            question: "Comment appliquer l'astrologie dans ma vie quotidienne ?",
            answer: "Vous pouvez utiliser l'astrologie pour comprendre vos rythmes naturels, prendre de meilleures décisions, améliorer vos relations grâce à la compatibilité, et mieux cerner votre développement personnel."
        },
        {
            question: "Que peut m'apprendre l'astrologie sur moi-même ?",
            answer: "L'astrologie peut révéler vos talents naturels, vos schémas de personnalité, vos besoins émotionnels, votre style de communication, vos tendances relationnelles et vos axes de développement personnel."
        },
        {
            question: "Quel rôle jouent les planètes et les étoiles en astrologie ?",
            answer: "Les planètes représentent différentes énergies et aspects de la vie, tandis que les étoiles et constellations servent de toile de fond à l'expression de ces énergies. Chaque planète a sa propre influence et signification."
        },
        {
            question: "L'astrologie peut-elle aider dans les relations ?",
            answer: "Oui, l'astrologie donne des clés sur la compatibilité, les styles de communication et la dynamique relationnelle. Elle aide à mieux comprendre vos besoins et ceux de votre partenaire pour plus d'harmonie."
        }
    ];

    const toggleItem = (index) => {
        setOpenItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <div className={styles.container}>
            <section className={styles.heroSection}>
                {/* Fil d'Ariane */}
                <nav className={styles.breadcrumb}>
                    <Link href="/">Accueil</Link>
                    <span>›</span>
                    <span>Foire aux questions ?</span>
                </nav>

                {/* Titre principal */}
                <h1 className={styles.mainTitle}>Foire aux questions ?</h1>

                {/* FAQ Items */}
                <div className={styles.faqContainer}>
                    {faqData.map((item, index) => (
                        <div
                            key={index}
                            className={styles.faqItem}
                        >
                            {/* Question Header */}
                            <button
                                onClick={() => toggleItem(index)}
                                className={styles.questionButton}
                                aria-label={`Afficher ou masquer la réponse à la question : ${item.question}`}
                            >
                                <h3 className={styles.questionText}>
                                    {item.question}
                                </h3>

                                <div className={styles.chevronIcon}>
                                    {openItems[index] ? <FaChevronUp /> : <FaChevronDown />}
                                </div>
                            </button>

                            {/* Answer Content */}
                            {openItems[index] && (
                                <div className={styles.answerContent}>
                                    <p className={styles.answerText}>
                                        {item.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}