"use client";
import React, { useState, useEffect } from "react";
import styles from "../components/accueil/mesArticles/mesArticles.module.css";
import Image from "next/image";
import Button from "../components/button/button";

export default function ArticlesPage() {
    // Pas de catégories fixes, uniquement dynamique
    // État pour stocker les articles / State to store articles
    const [articles, setArticles] = useState([]);
    // État pour stocker les catégories dynamiques
    const [categories, setCategories] = useState([{ id: 0, name: "Tous" }]);
    // État pour la catégorie sélectionnée / State for selected category
    const [selectedCategory, setSelectedCategory] = useState(0);
    // Pagination : page courante
    const [currentPage, setCurrentPage] = useState(1);
    const ARTICLES_PER_PAGE = 6;

    // Récupère les articles depuis l'API lors du montage du composant
    useEffect(() => {
        fetch("/api/articles")
            .then((res) => res.json())
            .then((data) => {
                console.log('Articles récupérés:', data); // Debug
                setArticles(Array.isArray(data) ? data : []);
            });
    }, []);

    // Récupère les catégories dynamiquement depuis l'API
    useEffect(() => {
        fetch("/api/categories")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setCategories([{ id: 0, name: "Tous" }, ...data]);
                }
            });
    }, []);

    // Filtrage des articles selon la catégorie sélectionnée (par id, string)
    const filteredArticles = selectedCategory === "0" || selectedCategory === 0
        ? articles
        : articles.filter(article => {
            return (
                article.categoryId === String(selectedCategory) ||
                (article.category && article.category.id === String(selectedCategory))
            );
        });

    // Tri par date décroissante (plus récent d'abord)
    const sortedArticles = [...filteredArticles].sort((a, b) => {
        const dateA = new Date(a.dateCreation || a.createdAt || 0);
        const dateB = new Date(b.dateCreation || b.createdAt || 0);
        return dateB - dateA;
    });

    // Pagination : découpage des articles
    const totalPages = Math.ceil(sortedArticles.length / ARTICLES_PER_PAGE);
    const paginatedArticles = sortedArticles.slice((currentPage - 1) * ARTICLES_PER_PAGE, currentPage * ARTICLES_PER_PAGE);

    // On reprend la logique d'accueil : 1 mainArticle, 3 secondaires, mais sur la page courante de la pagination
    const mainArticle = paginatedArticles.length > 0 ? paginatedArticles[0] : null;
    const secondaryArticles = paginatedArticles.length > 1 ? paginatedArticles.slice(1, 4) : [];

    // Changement de catégorie : reset page à 1
    const handleCategoryChange = (catId) => {
        setSelectedCategory(String(catId));
        setCurrentPage(1);
    };

    // Pagination : navigation
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    // Retourne l’URL de la miniature à afficher pour un article
    function getMiniatureUrl(article) {
        if (article.image) return article.image;
        if (article.imageCouverture) return article.imageCouverture;
        if (article.paragraphs && article.paragraphs.length > 0) {
            if (article.paragraphs[0].image_url) return article.paragraphs[0].image_url;
            if (article.paragraphs[0].image_url2) return article.paragraphs[0].image_url2;
        }
        // Ajout : première image de bloc si présente
        if (article.contentBlocks && article.contentBlocks.length > 0) {
            const firstImageBlock = article.contentBlocks.find(b => b.type && b.type.toLowerCase() === 'image' && b.mediaUrl);
            if (firstImageBlock) return firstImageBlock.mediaUrl;
        }
        return "/articles/default.webp";
    }

    return (
        <main className={`${styles.section} ${styles.sectionWithTopMargin}`}>
            {/* Titre de la section / Section title */}
            <h2 className={styles.title}>Mes Articles</h2>
            {/* Sous-titre / Subtitle */}
            <p className={styles.subtitle}>Cras sed rhoncus risus, non accu cenas fareta.</p>

            {/* Filtres de catégories / Category filters */}
            <div className={styles.filters} style={{ marginBottom: "2rem", display: "flex", gap: "1rem" }}>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        className={selectedCategory === cat.id ? styles.activeFilterBtn : styles.filterBtn}
                        onClick={() => handleCategoryChange(cat.id)}
                        type="button"
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            <div className={styles.articlesGrid}>
                {/* Article principal */}
                {mainArticle && (
                    <div className={styles.mainArticle}>
                        <Image
                            src={getMiniatureUrl(mainArticle)}
                            alt={mainArticle.titre}
                            className={styles.mainImage}
                            width={600}
                            height={400}
                        />
                        <div className={styles.mainContent}>
                            <span className={styles.meta}>
                                {mainArticle.category?.name && (
                                    <>
                                        <b>{mainArticle.category.name}</b> &nbsp;|&nbsp;
                                    </>
                                )}
                                {mainArticle.dateCreation
                                    ? new Date(mainArticle.dateCreation).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })
                                    : ''}
                                {/* Vues affichées à droite */}
                                <span style={{ float: 'right', marginLeft: 16, color: '#E2C6A8', fontWeight: 'bold' }}>{mainArticle.views || 0} vues</span>
                            </span>
                            <h3>{mainArticle.titre}</h3>
                            {mainArticle.description && <p>{mainArticle.description}</p>}
                            <a href={"/articles/" + mainArticle.slug} className={styles.readMore}>Lire la suite</a>
                        </div>
                    </div>
                )}
                {/* Articles secondaires */}
                <div className={styles.secondaryArticles}>
                    {secondaryArticles.map(article => (
                        <div key={article.id} className={styles.secondaryArticle}>
                            <Image
                                src={getMiniatureUrl(article)}
                                alt={article.titre}
                                className={styles.secondaryImage}
                                width={300}
                                height={200}
                            />
                            <div>
                                <span className={styles.meta}>
                                    {article.category?.name && (
                                        <>
                                            <b>{article.category.name}</b> &nbsp;|&nbsp;
                                        </>
                                    )}
                                    {article.dateCreation
                                        ? new Date(article.dateCreation).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })
                                        : ''}
                                    {/* Vues affichées à droite */}
                                    <span style={{ float: 'right', marginLeft: 8, color: '#E2C6A8', fontWeight: 'bold' }}>{article.views || 0} vues</span>
                                </span>
                                <h4>{article.titre}</h4>
                                {article.description && (
                                    <p>
                                        {article.description.length > 30
                                            ? article.description.slice(0, 30) + "..."
                                            : article.description}
                                    </p>
                                )}
                                <a href={"/articles/" + article.slug} className={styles.readMore}>Lire la suite</a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 32, gap: 8 }}>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #E2C6A8", background: "#2B2320", color: "#E2C6A8", cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
                >Précédent</button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        style={{
                            padding: "8px 14px",
                            margin: "0 2px",
                            borderRadius: 8,
                            border: "1.5px solid #E2C6A8",
                            background: currentPage === i + 1 ? "#E2C6A8" : "#2B2320",
                            color: currentPage === i + 1 ? "#2B2320" : "#E2C6A8",
                            fontWeight: currentPage === i + 1 ? "bold" : "normal",
                            cursor: "pointer"
                        }}
                    >{i + 1}</button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #E2C6A8", background: "#2B2320", color: "#E2C6A8", cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
                >Suivant</button>
            </div>
        </main>
    );
}