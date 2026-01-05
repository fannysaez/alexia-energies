// Importation des dépendances nécessaires
import React from "react"; // Importation de React
import Style from "../about/style.module.css"; // Styles CSS modulaires
import Image from "next/image"; // Composant Image optimisé de Next.js
// Import des SVG décoratifs depuis le dossier public
const VectorLeftTop = "/img/accueil/about/ImageLeftTopAbout.svg";
const Vector = "/img/accueil/about/ImageAbout.svg";
const VectorRightbottom = "/img/accueil/about/ImageRightBottomAbout.svg";
// ...existing code...

// Composant principal About
export default function About() {
    return (
        <section className={Style.section}>
            {/* Vecteur décoratif en haut à gauche */}
            <div className={Style.vectorLeftTop}>
                <Image
                    src={VectorLeftTop}
                    alt=""
                    sizes="(max-width: 480px) 100px, (max-width: 768px) 200px, 350px"
                    style={{
                        width: '100%',
                        height: 'auto',
                    }}
                />
            </div>

            {/* Conteneur principal avec vecteur central et texte */}
            <div className={Style.container}>
                {/* Vecteur central */}
                <div className={Style.vector}>
                    <Image
                        src={Vector}
                        alt="Décoration centrale"
                        sizes="(max-width: 480px) 80px, (max-width: 768px) 100px, 140px"
                        style={{
                            width: '100%',
                            height: 'auto',
                        }}
                    />
                </div>

                {/* Paragraphe avec éléments décoratifs */}
                <p>
                    Orci Varius Natoque Penatibus Et Magnis Dis Parturient
                    <span className={Style.line}></span> Nascetur Ridics
                    Mus. Etiam <span className={Style.linegrey}></span>
                    Sollicitudin Erat Dolor. Integer Interdum Neque Est, Et Commodo
                    Nisi Condimentum Non. Proin Id Metus Velit. Pellentesque Eget Potitor Leo <span className={Style.lineround}></span>
                </p>            
            </div>

            {/* Vecteur décoratif en bas à droite */}
            <div className={Style.vectorRightBottom}>
                <Image
                    src={VectorRightbottom}
                    alt=""
                    sizes="(max-width: 480px) 100px, (max-width: 768px) 200px, 350px"
                    style={{
                        width: '100%',
                        height: 'auto',
                    }}
                />
            </div>
        </section>
    );
}