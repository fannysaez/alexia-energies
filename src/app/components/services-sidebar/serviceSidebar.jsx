"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/app/components/button/button";
import fleche from "/public/img/accueil/HeroSection/VectorFlecheAccueil.svg";
import StarBlack from "/public/img/boutons/VectorStarBlack.svg";
import styles from "../services-sidebar/serviceSidebar.module.css";

const ServiceSidebar = ({
    activeService,
    pricing,
    articles,
    buttonText = "Réservez",
    onReserveClick
}) => {

    const services = [
        { name: 'Human Design', href: '/services/human-design' },
        { name: 'Magnétisme', href: '/services/magnetisme' },
        { name: 'Sophrologie', href: '/services/sophrologie' }
    ];

    return (
        <div className={styles.articlesSection}>
            {/* Bloc Services */}
            <div className={styles.sidebarServices}>
                <h4 className={styles.sidebarServicesTitle}>Services</h4>
                <div className={styles.sidebarServicesBtns}>
                    {(
                        [
                            ...services.filter((service) => service.name === activeService),
                            ...services.filter((service) => service.name !== activeService)
                        ]
                    ).map((service) => (
                        <Link
                            key={service.name}
                            href={service.href}
                            className={`${styles.sidebarServiceBtn} ${activeService === service.name ? styles.activeServiceBtn : ''}`}
                        >
                            {service.name}
                        </Link>
                    ))}
                </div>
            </div>
            {/* Tarifs dans la sidebar */}
                        <div className={styles.sidebarPricing}>
                            <h4 className={styles.sidebarTitle}>Tarifs</h4>
                            <ul className={styles.sidebarPricingList}>
                                {pricing.map((price, index) => (
                                    <li key={index}>
                                        {price.description} : <strong>{price.price}</strong>
                                        {price.duration && <span> ({price.duration})</span>}
                                    </li>
                                ))}
                            </ul>
                            <div className={styles.sidebarButton} style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    text={buttonText}
                                    variant="secondary"
                                    isReserveButton={true}
                                    leftVector={<Image src={StarBlack} alt="" width={16} height={16} />}
                                    rightVector={<Image src={StarBlack} alt="" width={16} height={16} />}
                                    onClick={onReserveClick}
                                    style={{ whiteSpace: 'nowrap' }}
                                    size="small"
                                />
                            </div>
                        </div>

                        {/* Articles */}
            <div className={styles.articlesGrid}>
                <h3 className={styles.articlesTitle}>Nos derniers articles</h3>
                <p className={styles.articlesSubtitle}>Enrichissez vos connaissances</p>
                {articles.map((article) => (
                    <Link href={article.link} key={article.id} className={styles.articleCard}>
                        <div className={styles.articleImage}>
                            <img
                                src={article.image}
                                alt={article.title}
                                className={styles.articleImg}
                            />
                        </div>
                        <div className={styles.articleContent}>
                            <h4 className={styles.articleTitle}>{article.title}</h4>
                            <p className={styles.articleDescription}>{article.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ServiceSidebar;