"use client";
import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { isLoggedIn } from "@/lib/auth";
import styles from "./FavoriteButton.module.css";

export default function FavoriteButton({ slug }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Vérifier si l'utilisateur est connecté
    useEffect(() => {
        setIsAuthenticated(isLoggedIn());
    }, []);

    // Récupérer le statut favori de l'article
    useEffect(() => {
        if (!isAuthenticated || !slug) {
            setLoading(false);
            return;
        }

        const fetchFavoriteStatus = async () => {
            try {
                const response = await fetch(`/api/favorites?slug=${slug}`);
                if (response.ok) {
                    const data = await response.json();
                    setIsFavorite(data.isFavorite);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération du statut favori:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavoriteStatus();
    }, [slug, isAuthenticated]);

    const handleToggleFavorite = async () => {
        if (!isAuthenticated) {
            alert("Vous devez être connecté pour ajouter des favoris");
            return;
        }

        setLoading(true);
        try {
            const method = isFavorite ? "DELETE" : "POST";
            const response = await fetch("/api/favorites", {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ slug }),
            });

            if (response.ok) {
                setIsFavorite(!isFavorite);
                const data = await response.json();
                console.log(data.message);
            } else {
                const errorData = await response.json();
                console.error("Erreur:", errorData.error);
                alert("Erreur lors de la mise à jour des favoris");
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour des favoris:", error);
            alert("Erreur lors de la mise à jour des favoris");
        } finally {
            setLoading(false);
        }
    };

    // Ne pas afficher le bouton si l'utilisateur n'est pas connecté
    if (!isAuthenticated) {
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
