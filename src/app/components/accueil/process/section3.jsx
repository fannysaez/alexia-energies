"use client";
import React, { useState } from "react"; // Hook React pour la gestion d'état
import Style from "./style.module.css"; // Styles CSS du composant
import Image from "next/image"; // Composant d'image optimisé Next.js
import Button from "@/app/components/button/button"; // Composant bouton personnalisé
import Modal from "@/app/components/modal/modal"; // Composant modal de réservation
import fleche from "/public/img/accueil/HeroSection/VectorFlecheAccueil.svg"; // Icône flèche décorative
import StarBlack from "/public/img/boutons/VectorStarBlack.svg"; // Icône étoile pour les boutons

export default function Process() {
    // État pour gérer l'ouverture/fermeture de la modal et ses données
    const [modalState, setModalState] = useState({
        isOpen: false,
        type: 'reservation',
        service: null
    });

    // Données des services proposés
    const services = [
        {
            id: 1,
            title: "Magnétisme",
            description: "Séances de magnétisme près d'Arras pour \n soulager les blocages physiques et émotionnels.",
            image: "/img/accueil/process/magnetisme.webp",
            link: "/services/magnetisme",
            serviceKey: "magnetisme"
        },
        {
            id: 2,
            title: "Sophrologie",
            description: "Préparation mentale, sommeil, lâcher-prise\nAdapté à vos besoins.",
            image: "/img/accueil/process/sophrologie.webp",
            link: "/services/sophrologie",
            serviceKey: "sophrologie"
        },
        {
            id: 3,
            title: "Human Design",
            description: "Préparation mentale, sommeil, lâcher-prise\nAdapté à vos besoins.",
            image: "/img/accueil/process/human design.webp",
            link: "/services/human-design",
            serviceKey: "humandesign"
        }
    ];

    // Fonction pour ouvrir la modal de réservation avec le service sélectionné
    const openReservationModal = (service) => {
        setModalState({
            isOpen: true,
            type: 'reservation',
            service: service.serviceKey
        });
    };

    // Fonction pour fermer la modal
    const closeModal = () => {
        setModalState({
            isOpen: false,
            type: '',
            service: null
        });
    };

    return (
        <>
            <section id="services" className={Style.section} >
                <div className={Style.overlay}></div>

                <div className={Style.container}>
                    {/* En-tête de section avec titre et description */}
                    <header className={Style.header}>
                        <h2>Magnétisme Et Sophrologie : Mes Solutions Pour Votre Bien-Être</h2>
                        <p>Magnétiseuse et sophrologue dans le Nord </p>
                        <p>Séances individuelles pour un bien-être global à Villers-au-Bois.</p>
                    </header>

                    {/* Grille des cartes de services */}
                    <div className={Style.servicesGrid}>
                        {services.map((service) => (
                            <div key={service.id} className={Style.serviceCard}>
                                {/* Image du service */}
                                <div className={Style.imageContainer}>
                                    <Image
                                        src={service.image}
                                        alt={service.title}
                                        width={350}
                                        height={250}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            borderRadius: '15px',
                                        }} />
                                </div>

                                {/* Contenu de la carte */}
                                <div className={Style.cardContent}>
                                    {/* Ligne décorative */}
                                    <div className={Style.decorativeLine}>
                                        <Image src={fleche} alt="Fleche" width={300} height={24} />
                                    </div>
                                    <h3>{service.title}</h3>
                                    <p>{service.description}</p>

                                    {/* Boutons d'action */}
                                    <div className={Style.buttonGroup}>
                                        <Button
                                            text="voir plus"
                                            link={service.link}
                                            variant="secondary"
                                            leftVector={<Image src={StarBlack} alt="" width={16} height={16} />}
                                            rightVector={<Image src={StarBlack} alt="" width={16} height={16} />}
                                            style={{ whiteSpace: 'nowrap' }}
                                        />
                                        <Button
                                            text="réservez"
                                            onClick={() => openReservationModal(service)}
                                            variant="secondary"
                                            isReserveButton={true}
                                            leftVector={<Image src={StarBlack} alt="" width={16} height={16} />}
                                            rightVector={<Image src={StarBlack} alt="" width={16} height={16} />}
                                            style={{ whiteSpace: 'nowrap' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modal de réservation */}
            <Modal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                type={modalState.type}
                service={modalState.service}
            />
        </>
    );
}