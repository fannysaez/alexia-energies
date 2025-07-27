"use client";
import React, { useEffect } from 'react';
import Style from './modal.module.css';
import { HiOutlineX } from 'react-icons/hi';
import ReservationModal from './forms/reservationModal';

/**
 * Composant Modal réutilisable
 * Gère l'affichage de différents types de modales avec overlay
 */
export default function Modal({
    isOpen,
    onClose,
    type = 'reservation',
    service = null,
    children
}) {
    // Nouvelle fonction de fermeture qui gère le scroll
    const handleClose = () => {
        onClose();
        const section = document.getElementById('services');
        if (section) {
            section.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
    };

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    // Rendu conditionnel : affiche uniquement si ouverte
    if (!isOpen) return null;

    return (
        <div className={Style.modalOverlay} onClick={handleClose}>
            <div className={Style.modalContent} onClick={(e) => e.stopPropagation()}>
                {/* Bouton de fermeture */}
                <button className={Style.closeButton} onClick={handleClose}>
                    <HiOutlineX />
                </button>
                {/* Si children est fourni, on l'affiche, sinon fallback ReservationModal */}
                {children ? children : (
                    type === 'reservation' && (
                        <ReservationModal
                            service={service}
                            onClose={handleClose}
                        />
                    )
                )}
            </div>
        </div>
    );
}