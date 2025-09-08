"use client";
import React, { useState } from "react";
import { GiMagnet } from "react-icons/gi";
import { GiLotus } from "react-icons/gi";
import { GiSparkles } from "react-icons/gi";
import styles from "./serviceChoiceModal.module.css";

const services = [
    {
        icon: <GiMagnet size={32} />,
        title: "Magnétisme",
        description: "Séances de magnétisme pour équilibrer vos énergies",
        button: "Choisir ce service",
        serviceKey: "magnetisme"
    },
    {
        icon: <GiLotus size={32} />,
        title: "Sophrologie",
        description: "Techniques de relaxation et de bien-être",
        button: "Choisir ce service",
        serviceKey: "sophrologie"
    },
    {
        icon: <GiSparkles size={32} />,
        title: "Human Design",
        description: "Découvrez votre design énergétique unique",
        button: "Choisir ce service",
        serviceKey: "humandesign"
    },
];

export default function ServiceChoiceModal({ onServiceSelect, onClose }) {
    const [selected, setSelected] = useState(null);

    const handleServiceSelect = (service) => {
        onServiceSelect(service.serviceKey);
    };

    return (
        <div className={`${styles.container} ${styles.serviceChoiceModal_container}`}>
            <h2 className={styles.title}>Choisissez votre service</h2>
            <hr className={styles.separator} />
            <p className={styles.subtitle}>
                Sélectionnez le service pour lequel vous souhaitez prendre rendez-vous
            </p>
            <div className={styles.servicesContainer}>
                {services.map((service, idx) => (
                    <div
                        className={`${styles.serviceCard} ${selected === idx ? styles.selected : ""}`}
                        key={service.title}
                        onMouseEnter={() => setSelected(idx)}
                        onMouseLeave={() => setSelected(null)}
                    >
                        <div className={styles.icon}>{service.icon}</div>
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                        <button
                            className={styles.chooseBtn}
                            onClick={() => handleServiceSelect(service)}
                            aria-label={`Choisir le service : ${service.title}`}
                        >
                            {service.button}
                        </button>
                    </div>
                ))}
            </div>
            <hr className={styles.separator} />
            <p className={styles.info}>
                Les Rendez-vous doivent être annulés au moins 24h à l'avance.
            </p>
        </div>
    );
}
