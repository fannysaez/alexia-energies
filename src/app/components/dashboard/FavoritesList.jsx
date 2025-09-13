"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./FavoritesList.module.css";

export default function FavoritesList() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const FAVORITES_PER_PAGE = 3;

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Vous devez être connecté");
                setLoading(false);
                return;
            }

            const response = await fetch('/api/favorites', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setFavorites(data);
            } else {
                setError("Erreur lors du chargement des favoris");
            }
        } catch (error) {
            console.error('Erreur:', error);
            setError("Erreur lors du chargement des favoris");
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (slug) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/favorites', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ slug }),
            });

            if (response.ok) {
                // Mettre à jour la liste en retirant l'article
                const updatedFavorites = favorites.filter(fav => fav.slug !== slug);
                setFavorites(updatedFavorites);
                
                // Ajuster la page si nécessaire
                const totalPages = Math.ceil(updatedFavorites.length / FAVORITES_PER_PAGE);
                if (currentPage > totalPages && totalPages > 0) {
                    setCurrentPage(totalPages);
                }
            } else {
                alert("Erreur lors de la suppression du favori");
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert("Erreur lors de la suppression du favori");
        }
    };

    // Calculer les éléments à afficher pour la page actuelle
    const totalPages = Math.ceil(favorites.length / FAVORITES_PER_PAGE);
    const startIndex = (currentPage - 1) * FAVORITES_PER_PAGE;
    const endIndex = startIndex + FAVORITES_PER_PAGE;
    const currentFavorites = favorites.slice(startIndex, endIndex);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <p>Chargement de vos favoris...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <p>{error}</p>
            </div>
        );
    }

    if (favorites.length === 0) {
        return (
            <div className={styles.emptyContainer}>
                <h3>Aucun favori pour le moment</h3>
                <p>Explorez nos articles et ajoutez-en à vos favoris en cliquant sur le cœur ❤️</p>
                <Link href="/articles" className={styles.exploreButton}>
                    Découvrir les articles
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.favoritesContainer}>
            <div className={styles.favoritesGrid}>
                {currentFavorites.map((article) => (
                    <div key={article.id} className={styles.favoriteCard}>
                        {article.image && (
                            <div className={styles.cardImageContainer}>
                                <Image
                                    src={article.image}
                                    alt={article.titre}
                                    width={300}
                                    height={200}
                                    className={styles.cardImage}
                                />
                            </div>
                        )}
                        <div className={styles.cardContent}>
                            <h3 className={styles.cardTitle}>{article.titre}</h3>
                            {article.description && (
                                <p className={styles.cardDescription}>
                                    {article.description.length > 150 
                                        ? `${article.description.substring(0, 150)}...` 
                                        : article.description}
                                </p>
                            )}
                            <p className={styles.cardAuthor}>Par {article.auteur}</p>
                            {article.datePublication && (
                                <p className={styles.cardDate}>
                                    {new Date(article.datePublication).toLocaleDateString("fr-FR", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                            )}
                            <div className={styles.cardActions}>
                                <Link 
                                    href={`/articles/${article.slug}`}
                                    className={styles.readButton}
                                >
                                    Lire l'article
                                </Link>
                                <button
                                    onClick={() => removeFavorite(article.slug)}
                                    className={styles.removeButton}
                                    title="Retirer des favoris"
                                >
                                    🗑️ Retirer
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className={styles.paginationContainer}>
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className={styles.paginationButton}
                        style={{ 
                            opacity: currentPage === 1 ? 0.5 : 1,
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Précédent
                    </button>
                    
                    <span className={styles.paginationInfo}>
                        Page {currentPage} / {totalPages}
                    </span>
                    
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className={styles.paginationButton}
                        style={{ 
                            opacity: currentPage === totalPages ? 0.5 : 1,
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Suivant
                    </button>
                </div>
            )}
        </div>
    );
}