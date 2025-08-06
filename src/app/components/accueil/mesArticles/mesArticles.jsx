"use client";
import React, { useState, useEffect } from "react";
import styles from './mesArticles.module.css';
import Image from "next/image";
import Button from "@/app/components/button/button"; // adapte ce chemin si besoin
import Link from "next/link";

export default function MesArticles() {
    const [articles, setArticles] = useState([]);
    // Filtres de catégories
    const [activeCategory, setActiveCategory] = useState('Tous');
    const categories = ['Tous', 'Bien-être', 'Spiritualité', 'Épanouissement'];

    // Récupération dynamique des articles
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch('/api/articles');
                const data = await response.json();
                setArticles(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Erreur lors de la récupération des articles :", error);
                setArticles([]);
            }
        }
        fetchArticles();
    }, []);

    // On affiche simplement les 4 derniers articles (ou moins)
    const sortedArticles = Array.isArray(articles) ? [...articles].sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation)) : [];
    const mainArticle = sortedArticles.length > 0 ? sortedArticles[0] : null;
    const secondaryArticles = sortedArticles.length > 1 ? sortedArticles.slice(1, 4) : [];

    return (
        <section className={styles.section}>
            <h2 className={styles.title}>Mes Articles</h2>
            <p className={styles.subtitle}>Cras sed rhoncus risus, non accu cenas fareta.</p>

            <div className={styles.articlesGrid}>
                {/* Article principal */}
                {mainArticle && (
                    <div className={styles.mainArticle}>
                        <Image src={mainArticle.image} alt={mainArticle.titre} className={styles.mainImage} width={600} height={400} />
                        <div className={styles.mainContent}>
                            <span className={styles.meta}>
                                {mainArticle.publishedAt
                                    ? new Date(mainArticle.publishedAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })
                                    : mainArticle.dateCreation
                                        ? new Date(mainArticle.dateCreation).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })
                                        : ''
                                }
                                {/* Vues affichées à droite */}
                                <span style={{ float: 'right', marginLeft: 16, color: '#E2C6A8', fontWeight: 'bold' }}>{mainArticle.views || 0} vues</span>
                            </span>
                            <h3>{mainArticle.titre}</h3>
                            <p>{mainArticle.description}</p>
                            {mainArticle.slug ? (
                                <Link href={`/articles/${mainArticle.slug}`} className={styles.readMore}>Lire la suite</Link>
                            ) : (
                                <span className={styles.readMore} style={{ opacity: 0.5, pointerEvents: 'none' }}>Aucun lien</span>
                            )}
                        </div>
                    </div>
                )}
                {/* Articles secondaires */}
                <div className={styles.secondaryArticles}>
                    {secondaryArticles.map(article => (
                        <div key={article.id} className={styles.secondaryArticle}>
                            <Image src={article.image} alt={article.titre} className={styles.secondaryImage} width={300} height={200} />
                            <div>
                                <span className={styles.meta}>
                                    {article.publishedAt
                                        ? new Date(article.publishedAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })
                                        : article.dateCreation
                                            ? new Date(article.dateCreation).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })
                                            : ''
                                    }
                                    {/* Vues affichées à droite */}
                                    <span style={{ float: 'right', marginLeft: 8, color: '#E2C6A8', fontWeight: 'bold' }}>{article.views || 0} vues</span>
                                </span>
                                <h4>{article.titre}</h4>
                                {article.description && (
                                    <p>
                                        {article.description.length > 18
                                            ? article.description.slice(0, 18) + "..."
                                            : article.description}
                                    </p>
                                )}
                                {article.slug ? (
                                    <Link href={`/articles/${article.slug}`} className={styles.readMore}>Lire la suite</Link>
                                ) : (
                                    <span className={styles.readMore} style={{ opacity: 0.5, pointerEvents: 'none' }}>Aucun lien</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* <button className={styles.allArticlesBtn}>Voir tous les articles</button> */}
        </section>
    );
}