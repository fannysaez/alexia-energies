"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './cookie-banner.module.css';

const CookieBanner = () => {
    const [showBanner, setShowBanner] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [preferences, setPreferences] = useState({
        necessary: true, // Toujours activés
        analytics: false,
        marketing: false,
        functional: false
    });

    // Types de cookies avec descriptions
    const cookieTypes = {
        necessary: {
            title: "Cookies Nécessaires",
            description: "Ces cookies sont essentiels au fonctionnement du site. Ils permettent l'authentification et les fonctionnalités de base.",
            required: true
        },
        functional: {
            title: "Cookies Fonctionnels",
            description: "Ces cookies permettent de mémoriser vos préférences (thème, langue, favoris) pour améliorer votre expérience.",
            required: false
        },
        analytics: {
            title: "Cookies d'Analyse",
            description: "Ces cookies nous aident à comprendre comment vous utilisez le site pour l'améliorer (pages visitées, temps de navigation).",
            required: false
        },
        marketing: {
            title: "Cookies Marketing",
            description: "Ces cookies sont utilisés pour personnaliser les publicités et mesurer l'efficacité des campagnes.",
            required: false
        }
    };

    useEffect(() => {
        // Mode démo : toujours afficher le banner
        setTimeout(() => {
            setShowBanner(true);
        }, 1000);
        
        // Code normal commenté pour le moment
        /*
        // Vérifier si l'utilisateur a déjà fait un choix
        const cookieConsent = localStorage.getItem('cookieConsent');
        
        if (!cookieConsent) {
            // Délai pour laisser le temps à la page de se charger
            setTimeout(() => {
                setShowBanner(true);
            }, 1000);
        } else {
            // Charger les préférences sauvegardées
            const savedPreferences = JSON.parse(cookieConsent);
            setPreferences(savedPreferences);
            // Appliquer les cookies selon les préférences
            applyCookiePreferences(savedPreferences);
        }
        */
    }, []);

    const applyCookiePreferences = (prefs) => {
        // Ici, vous pouvez activer/désactiver les différents types de cookies
        if (prefs.analytics) {
            // Activer Google Analytics ou autre
            console.log('Analytics cookies enabled');
        }
        if (prefs.marketing) {
            // Activer les cookies marketing
            console.log('Marketing cookies enabled');
        }
        if (prefs.functional) {
            // Activer les cookies fonctionnels
            console.log('Functional cookies enabled');
        }
    };

    const savePreferences = (prefs) => {
        localStorage.setItem('cookieConsent', JSON.stringify(prefs));
        localStorage.setItem('cookieConsentDate', new Date().toISOString());
        applyCookiePreferences(prefs);
        setShowBanner(false);
        setShowModal(false);
    };

    const acceptAll = () => {
        const allAccepted = {
            necessary: true,
            analytics: true,
            marketing: true,
            functional: true
        };
        setPreferences(allAccepted);
        savePreferences(allAccepted);
    };

    const acceptNecessary = () => {
        const necessaryOnly = {
            necessary: true,
            analytics: false,
            marketing: false,
            functional: false
        };
        setPreferences(necessaryOnly);
        savePreferences(necessaryOnly);
    };

    const openCustomization = () => {
        setShowModal(true);
    };

    const saveCustomPreferences = () => {
        savePreferences(preferences);
    };

    const togglePreference = (type) => {
        if (type === 'necessary') return; // Ne peut pas être désactivé
        
        setPreferences(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    if (!showBanner) return null;

    return (
        <>
            {/* Bannière principale */}
            <div className={styles.cookieBanner}>
                <div className={styles.cookieContent}>
                    <div className={styles.cookieText}>
                        <h3 className={styles.cookieTitle}>🍪 Nous utilisons des cookies</h3>
                        <p className={styles.cookieDescription}>
                            Nous utilisons des cookies pour améliorer votre expérience sur notre site. 
                            Certains sont nécessaires au fonctionnement, d'autres nous aident à comprendre 
                            comment vous utilisez le site. Consultez notre{' '}
                            <Link href="/politique-confidentialite">politique de confidentialité</Link> 
                            {' '}pour plus d'informations.
                        </p>
                    </div>
                    
                    <div className={styles.cookieButtons}>
                        <button 
                            className={`${styles.cookieButton} ${styles.acceptAll}`}
                            onClick={acceptAll}
                        >
                            Accepter tout
                        </button>
                        <button 
                            className={`${styles.cookieButton} ${styles.acceptNecessary}`}
                            onClick={acceptNecessary}
                        >
                            Nécessaires uniquement
                        </button>
                        <button 
                            className={`${styles.cookieButton} ${styles.customize}`}
                            onClick={openCustomization}
                        >
                            Personnaliser
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de personnalisation */}
            {showModal && (
                <div className={styles.cookieModal} onClick={() => setShowModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Préférences des cookies</h3>
                            <button 
                                className={styles.closeButton}
                                onClick={() => setShowModal(false)}
                                aria-label="Fermer"
                            >
                                ×
                            </button>
                        </div>

                        <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: '1.5' }}>
                            Gérez vos préférences de cookies. Vous pouvez modifier ces paramètres à tout moment.
                        </p>

                        {Object.entries(cookieTypes).map(([key, cookie]) => (
                            <div key={key} className={styles.cookieCategory}>
                                <div className={styles.categoryHeader}>
                                    <h4 className={styles.categoryTitle}>{cookie.title}</h4>
                                    <div 
                                        className={`${styles.toggle} ${preferences[key] ? styles.active : ''} ${cookie.required ? styles.disabled : ''}`}
                                        onClick={() => togglePreference(key)}
                                    >
                                        <div className={styles.toggleSlider}></div>
                                    </div>
                                </div>
                                <p className={styles.categoryDescription}>
                                    {cookie.description}
                                    {cookie.required && <strong> (Obligatoire)</strong>}
                                </p>
                            </div>
                        ))}

                        <div className={styles.modalButtons}>
                            <button 
                                className={`${styles.cookieButton} ${styles.acceptNecessary}`}
                                onClick={() => setShowModal(false)}
                            >
                                Annuler
                            </button>
                            <button 
                                className={`${styles.cookieButton} ${styles.acceptAll}`}
                                onClick={saveCustomPreferences}
                            >
                                Sauvegarder mes préférences
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CookieBanner;