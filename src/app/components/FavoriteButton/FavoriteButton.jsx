"use client";
import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { isUser } from "@/lib/auth";
import styles from "./FavoriteButton.module.css";

export default function FavoriteButton({ slug, articleId }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isNormalUser, setIsNormalUser] = useState(false);

    // Vérifier si l'utilisateur est un utilisateur connecté (pas admin)
    useEffect(() => {
        setIsNormalUser(isUser());
    }, []);

    // Récupérer le statut favori de l'article
    useEffect(() => {
        if (!isNormalUser || !slug) {
            setLoading(false);
            return;
        }

        const fetchFavoriteStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/favorites?slug=${slug}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setIsFavorite(data.isFavorite);
                } else if (response.status === 404) {
                    // Utilisateur non trouvé - probablement un token obsolète
                    console.warn("Utilisateur non trouvé - token peut-être obsolète");
                    setIsFavorite(false);
                } else {
                    console.error("Erreur lors de la récupération du statut favori:", response.status);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération du statut favori:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavoriteStatus();
    }, [slug, isNormalUser]);

    const handleToggleFavorite = async () => {
        if (!isNormalUser) {
            alert("Vous devez être connecté en tant qu'utilisateur pour ajouter des favoris");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const method = isFavorite ? "DELETE" : "POST";
            const response = await fetch("/api/favorites", {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ slug }),
            });

            if (response.ok) {
                setIsFavorite(!isFavorite);
                const data = await response.json();
                console.log(data.message);
            } else {
                const errorData = await response.json();
                console.error("Erreur:", errorData.error || response.statusText);
                alert(`Erreur lors de la mise à jour des favoris: ${errorData.error || response.statusText}`);
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour des favoris:", error);
            alert("Erreur de connexion lors de la mise à jour des favoris");
        } finally {
            setLoading(false);
        }
    };

    // Ne pas afficher le bouton si ce n'est pas un utilisateur connecté
    if (!isNormalUser) {
        return null;
    }

    return (
        <button
            className={`${styles.favoriteButton} ${isFavorite ? styles.favorite : ""}`}
            onClick={handleToggleFavorite}
            disabled={loading}
            title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
            {loading ? (
                <div className={styles.spinner}></div>
            ) : isFavorite ? (
                <FaHeart className={styles.heartFilled} />
            ) : (
                <FaRegHeart className={styles.heartEmpty} />
            )}
        </button>
    );
}
