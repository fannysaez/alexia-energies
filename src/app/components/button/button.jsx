import Link from "next/link"; // Import du composant Link de Next.js
import style from "./button.module.css"; // Import des styles CSS du bouton

export default function Button({
    text, // Texte du bouton
    link, // Lien si le bouton est un lien
    onClick, // Fonction de rappel au clic
    variant = "primary", // Variante du bouton (primary/secondary)
    className = "", // Classe CSS additionnelle
    leftVector, // Icône ou élément à gauche
    rightVector, // Icône ou élément à droite
    type = "button", // Type du bouton (button/submit)
    isReserveButton = false // Indique si c'est un bouton "réservez"
}) {
    // Attribution de la bonne classe CSS selon le variant
    const buttonClass = variant === "primary" ? style.primary : style.secondary;

    // Ajouter la classe spéciale pour le bouton réservez
    const reserveClass = isReserveButton ? style.reserveButton : '';

    // Contenu commun du bouton
    const buttonContent = (
        <>
            {leftVector && (
                <span className={style.leftVector} style={{ display: "flex", alignItems: "flex-end" }}>
                    {leftVector}
                </span>
            )}
            <span>{text}</span>
            {rightVector && (
                <span className={style.rightVector} style={{ display: "flex", alignItems: "flex-end" }}>
                    {rightVector}
                </span>
            )}
        </>
    );

    // Si onClick est fourni, utiliser un button
    if (onClick) {
        return (
            <button
                className={`${buttonClass} ${reserveClass} ${className}`}
                onClick={onClick}
                type={type}
                style={{ textDecoration: 'none', cursor: 'pointer' }}
            >
                {buttonContent}
            </button>
        );
    }

    // Si link commence par #, utiliser <a> natif pour smooth scroll
    if (link && link.startsWith("#")) {
        return (
            <a
                href={link}
                className={`${buttonClass} ${className}`}
                style={{ textDecoration: 'none', cursor: 'pointer' }}
            >
                {buttonContent}
            </a>
        );
    }

    // Si link est fourni (et n'est pas une ancre), utiliser Link Next.js
    if (link) {
        return (
            <Link href={link} className={`${buttonClass} ${className}`}>
                {buttonContent}
            </Link>
        );
    }

    // Par défaut, utiliser un button simple
    return (
        <button
            className={`${buttonClass} ${className}`}
            type={type}
            style={{ textDecoration: 'none', cursor: 'pointer' }}
        >
            {buttonContent}
        </button>
    );
};