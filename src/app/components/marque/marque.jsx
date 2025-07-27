import style from "./marque.module.css";

// Composant Marque : affiche un texte défilant personnalisable
const Marque = ({ 
    text = "Notre Univers est régi par une énergie complexe et invisible", // Texte à afficher
    direction = "left", // Direction du défilement
    speed = "normal", // Vitesse du défilement
    className = "", // Classes CSS additionnelles
    pauseOnHover = true // Pause au survol
}) => {
    // Génère la classe CSS complète
    const marqueClass = `${style.marque} ${style[direction]} ${style[speed]} ${className}`;
    
    return (
        // Conteneur principal avec options de pause
        <div className={marqueClass} data-pause-on-hover={pauseOnHover}>
            <div className={style.marqueContent}>
                {/* Répète le texte plusieurs fois pour l'effet défilant */}
                <span className={style.marqueText}>{text}</span>
                <span className={style.marqueText}>{text}</span>
                <span className={style.marqueText}>{text}</span>
                <span className={style.marqueText}>{text}</span>
                <span className={style.marqueText}>{text}</span>
            </div>
        </div>
    );
};

export default Marque; // Exporte le composant