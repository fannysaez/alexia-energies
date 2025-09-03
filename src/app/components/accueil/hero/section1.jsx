// Importation des dépendances nécessaires pour la section d'accueil
import React from "react";
import style from "./style.module.css"; // Import des styles CSS modules
import Button from "@/app/components/button/button"; // Composant bouton personnalisé
import Image from "next/image"; // Composant Next.js pour l'optimisation des images
import fleche from "/public/img/accueil/HeroSection/VectorFlecheAccueil.svg"; // SVG décoratif
import StarWhite from "/public/img/boutons/VectorStarWhite.svg"; // Icône étoile blanche
import StarBlack from "/public/img/boutons/VectorStarBlack.svg"; // Icône étoile noire

// Composant Section1 pour la section d'accueil
// Ce composant affiche un titre, une description, une ligne décorative et deux boutons pour naviguer vers les services et le contact.
export default function HeroSection() {
    // Vérification : la classe "buttons" existe-t-elle dans le fichier style.module.css ?
    // Si elle n'existe pas, les boutons n'auront pas de style ou seront invisibles selon le CSS global.
    // Ajoute ceci dans style.module.css si ce n'est pas déjà fait :

    return (
        // {/* Section 1 */}
        <section className={style.section}>
            {/* L'overlay */}
            <div className={style.overlay}></div>
            <div className={style.container}>
                <h1>Magnétisme & Sophrologie Près De Lens <span className={style.line}></span> Bien-Être Et Relaxation</h1>
                <p>
                    Situé à Lilas, près de Lens, je propose des séances de
                    magnétisme et sophrologie pour vous accompagner vers un mieux-être
                    global.
                </p>
                {/* Ligne décorative avec le SVG */}
                <div className={style.decorativeLine}>
                    <Image src={fleche} alt="Fleche" width={380} height={20}/>
                </div>
                {/* Si style.buttons n'existe pas, on peut utiliser une div sans classe ou ajouter le style en ligne pour tester */}
                <div className={style.buttons ? style.buttons : undefined} style={!style.buttons ? { display: "flex", gap: "20px", justifyContent: "center", marginTop: "20px" } : {}}>
                    {/* Bouton menant à la page des services */}
                    <Button
                        text="Mes services"
                        link="#services"
                        variant="primary"
                        leftVector={<Image src={StarWhite} alt="" width={16} height={16} />}
                        rightVector={<Image src={StarWhite} alt="" width={16} height={16} />}
                    />
                    {/* Bouton menant à la page de contact */}
                    <Button
                        text="Contactez-moi"
                        link="/contact"
                        variant="secondary"
                        leftVector={<Image src={StarBlack} alt="" width={16} height={16} />}
                        rightVector={<Image src={StarBlack} alt="" width={16} height={16} />}
                    />
                </div>
            </div>
        </section>
    );
}
