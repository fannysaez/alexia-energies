"use client";
import React, { useState, useEffect, useRef } from 'react'; // Hooks React pour état et effets
import Style from './reservationModal.module.css'; // Styles CSS du modal
import Button from '@/app/components/button/button'; // Composant bouton personnalisé
import Image from 'next/image'; // Composant image optimisé Next.js
import StarBlack from "/public/img/boutons/VectorStarBlack.svg"; // Icône étoile noire
import { HiOutlineCheck } from 'react-icons/hi'; // Icône de validation

export default function ReservationModal({ service, onClose }) {
    // États pour gérer le flux du modal
    const [step, setStep] = useState('choice'); // Étape actuelle: 'choice', 'calendar', 'confirmation'
    const [selectedOption, setSelectedOption] = useState(null); // Option choisie: 'distance' ou 'presentiel'
    const [isCalendlyLoaded, setIsCalendlyLoaded] = useState(false); // Script Calendly chargé
    const [isCalendlyInitialized, setIsCalendlyInitialized] = useState(false); // Widget Calendly initialisé
    const calendlyRef = useRef(null); // Référence pour le conteneur Calendly

    // Configuration des services
    const serviceConfig = {
        magnetisme: {
            title: "Magnétisme",
            calendlyLinks: {
                distance: "https://calendly.com/alexis59184/nouvelle-reunion-1",
                presentiel: "https://calendly.com/alexis59184/nouvelle-reunion-1"
            }
        },
        sophrologie: {
            title: "Sophrologie",
            calendlyLinks: {
                distance: "https://calendly.com/alexis59184/nouvelle-reunion-1",
                presentiel: "https://calendly.com/alexis59184/nouvelle-reunion-1"
            }
        },
        humandesign: {
            title: "Human Design",
            calendlyLinks: {
                distance: "https://calendly.com/alexis59184/nouvelle-reunion-1",
                presentiel: "https://calendly.com/alexis59184/nouvelle-reunion-1"
            }
        }
    };
    const currentService = serviceConfig[service] || serviceConfig.magnetisme;

    // Charger le script Calendly une seule fois
    useEffect(() => {
        const loadCalendlyScript = () => {
            // Vérifier si le script existe déjà
            if (document.querySelector('script[src*="calendly.com"]')) {
                console.log('Script Calendly déjà présent');
                setIsCalendlyLoaded(true);
                return;
            }

            console.log('Chargement du script Calendly...');
            const script = document.createElement('script');
            script.src = 'https://assets.calendly.com/assets/external/widget.js';
            script.async = true;
            script.onload = () => {
                console.log('Script Calendly chargé avec succès');
                setIsCalendlyLoaded(true);
            };
            script.onerror = () => {
                console.error('Erreur lors du chargement du script Calendly');
            };

            document.head.appendChild(script);
        };

        loadCalendlyScript();
    }, []);

    // Initialiser le widget Calendly quand nécessaire
    useEffect(() => {
        if (step === 'calendar' && selectedOption && isCalendlyLoaded && !isCalendlyInitialized && calendlyRef.current) {
            console.log('Initialisation du widget Calendly...');

            const initializeCalendly = () => {
                if (window.Calendly && calendlyRef.current) {
                    try {
                        // Nettoyer le conteneur
                        calendlyRef.current.innerHTML = '';

                        console.log('URL Calendly:', currentService.calendlyLinks[selectedOption]);
                        console.log('Option sélectionnée:', selectedOption);

                        // Configuration du widget
                        window.Calendly.initInlineWidget({
                            url: currentService.calendlyLinks[selectedOption],
                            parentElement: calendlyRef.current,
                            prefill: {},
                            utm: {}
                        });

                        setIsCalendlyInitialized(true);
                        console.log('Widget Calendly initialisé avec succès');
                    } catch (error) {
                        console.error('Erreur lors de l\'initialisation du widget Calendly:', error);
                    }
                } else {
                    console.log('Calendly ou calendlyRef non disponible');
                }
            };

            // Délai pour s'assurer que le DOM est prêt
            const timer = setTimeout(initializeCalendly, 500);
            return () => clearTimeout(timer);
        }
    }, [step, selectedOption, isCalendlyLoaded, isCalendlyInitialized, currentService]);

    // Écouter les événements Calendly
    useEffect(() => {
        const handleCalendlyEvent = (e) => {
            if (e.data && e.data.event === 'calendly.event_scheduled') {
                console.log('Événement de réservation détecté');
                setStep('confirmation');
            }
        };

        if (step === 'calendar' && isCalendlyInitialized) {
            window.addEventListener('message', handleCalendlyEvent);
            return () => window.removeEventListener('message', handleCalendlyEvent);
        }
    }, [step, isCalendlyInitialized]);

    const selectOption = (option) => {
        console.log('Option sélectionnée:', option);
        setSelectedOption(option);
        setIsCalendlyInitialized(false);
        setStep('calendar');
    };

    const goBack = () => {
        setStep('choice');
        setSelectedOption(null);
        setIsCalendlyInitialized(false);

        // Nettoyer le widget Calendly
        if (calendlyRef.current) {
            calendlyRef.current.innerHTML = '';
        }
    };

    // Nettoyer quand le composant se démonte
    useEffect(() => {
        return () => {
            if (calendlyRef.current) {
                calendlyRef.current.innerHTML = '';
            }
        };
    }, []);

    // Étape 1 : Choix entre distance et présentiel
    const renderChoiceStep = () => (
        <div className={Style.stepContainer}>
            <div className={Style.titleSection}>
                <h2 className={Style.serviceTitle}>{currentService.title}</h2>
            </div>

            <div className={Style.introSection}>
                <h3 className={Style.question}>
                    Souhaitez-vous un service en présentiel ou à distance ?
                </h3>
                <p className={Style.subtitle}>
                    Sachez que les disponibilités sont identiques
                </p>
            </div>

            <div className={Style.optionsContainer}>
                <div
                    className={Style.optionCard}
                    onClick={() => selectOption('distance')}
                >
                    <div className={Style.optionIcon}>
                        <svg width="48" height="36" viewBox="0 0 48 36" fill="none">
                            <rect x="4" y="4" width="40" height="24" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
                            <rect x="2" y="30" width="44" height="4" rx="2" fill="currentColor" />
                            <rect x="8" y="8" width="32" height="16" fill="currentColor" opacity="0.2" />
                        </svg>
                    </div>
                    <h4>À distance / en visio</h4>
                    <p className={Style.paymentInfo}>Paiement en ligne par carte bancaire</p>
                </div>

                <div
                    className={Style.optionCard}
                    onClick={() => selectOption('presentiel')}
                >
                    <div className={Style.optionIcon}>
                        <svg width="48" height="36" viewBox="0 0 48 36" fill="none">
                            <path d="M24 4L42 18v16a2 2 0 01-2 2H8a2 2 0 01-2-2V18L24 4z" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.2" />
                            <path d="M10 36V20h10v16M28 20h10v16" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                    </div>
                    <h4>En présentiel</h4>
                    <p className={Style.paymentInfo}>Paiement sur place</p>
                </div>
            </div>

            <div className={Style.disclaimer}>
                <p>Les Rendez-vous doivent être annulés au moins 24h à l'avance.</p>
            </div>
        </div>
    );

    // Étape 2 : Affichage du calendrier Calendly
    const renderCalendarStep = () => (
        <div className={Style.stepContainer}>
            <div className={Style.calendarHeader}>
                <Button
                    text="Retour"
                    onClick={goBack}
                    variant="secondary"
                />
                <h3>
                    {selectedOption === 'distance' ? 'Consultation à distance' : 'Consultation en présentiel'}
                </h3>
            </div>

            <div className={Style.calendlyContainer}>
                {!isCalendlyLoaded && (
                    <div className={Style.loadingCalendly}>
                        <div className={Style.loadingSpinner}></div>
                        <p>Chargement du script Calendly...</p>
                    </div>
                )}

                {isCalendlyLoaded && !isCalendlyInitialized && (
                    <div className={Style.loadingCalendly}>
                        <div className={Style.loadingSpinner}></div>
                        <p>Initialisation du calendrier...</p>
                    </div>
                )}

                <div
                    ref={calendlyRef}
                    style={{
                        minWidth: '100%',
                        minHeight: '700px',
                        borderRadius: '16px',
                        display: isCalendlyInitialized ? 'block' : 'none'
                    }}
                />
            </div>
        </div>
    );

    // Étape 3 : Confirmation de réservation
    const renderConfirmationStep = () => (
        <div className={Style.confirmationContainer}>
            <div className={Style.successIcon}>
                <HiOutlineCheck />
            </div>
            <h2 className={Style.confirmationTitle}>
                Votre rendez-vous a été confirmé !
            </h2>
            <p className={Style.confirmationText}>
                Vous allez recevoir un email de confirmation avec tous les détails de votre rendez-vous.
            </p>
            <div className={Style.confirmationActions}>
                <Button
                    text="Fermer"
                    onClick={onClose}
                    variant="primary"
                />
            </div>
        </div>
    );

    return (
        <div className={Style.reservationModal}>
            {step === 'choice' && renderChoiceStep()}
            {step === 'calendar' && renderCalendarStep()}
            {step === 'confirmation' && renderConfirmationStep()}
        </div>
    );
}