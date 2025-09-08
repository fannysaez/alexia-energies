"use client"
import React, { useState } from 'react'; // Import React et useState
import Link from 'next/link'; // Import Next.js Link for navigation
import Image from 'next/image'; // Import Next.js Image for optimized images
import { FaInstagram, FaFacebook, FaLinkedin, FaYoutube } from 'react-icons/fa'; // Import social icons
import { IoArrowForward } from 'react-icons/io5'; // Import arrow icon for newsletter
import { RxTriangleRight } from 'react-icons/rx';
import styles from './footer.module.css'; // Import CSS module for styling

const Footer = () => { // Footer component
    // États pour afficher le message de confirmation ou d'erreur
    const [newsletterSent, setNewsletterSent] = useState(false);
    const [newsletterError, setNewsletterError] = useState("");
    const [cguChecked, setCguChecked] = useState(false);
    const cguRef = React.useRef();
    const emailRef = React.useRef();
    // Gestionnaire de soumission du formulaire newsletter
    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        const email = emailRef.current?.value;
        const cgu = cguRef.current?.checked;
        // Vérification basique de l'email
        if (!email || !email.includes("@") || !email.includes(".")) {
            setNewsletterError("Adresse email invalide. Veuillez vérifier.");
            setNewsletterSent(false);
            return;
        }
        // Vérification CGU
        if (!cgu) {
            setNewsletterError("Veuillez accepter les Conditions Générales d'Utilisation.");
            setNewsletterSent(false);
            return;
        }
        // Appel à l'API pour enregistrer l'email
        fetch('/api/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) {
                    setNewsletterError(data.error || 'Erreur lors de l\'inscription.');
                    setNewsletterSent(false);
                } else {
                    setNewsletterSent(true);
                    setNewsletterError("");
                    // Réinitialisation du formulaire
                    if (emailRef.current) emailRef.current.value = "";
                    setCguChecked(false);
                    // Masquer le message de confirmation après 3 secondes
                    setTimeout(() => {
                        setNewsletterSent(false);
                    }, 3000);
                }
            })
            .catch(() => {
                setNewsletterError('Erreur serveur.');
                setNewsletterSent(false);
            });
    };
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Section principale du footer */}
                <div className={styles.mainContent}>
                    {/* Logo et description */}
                    <div className={styles.brandSection}>
                        <div className={styles.logo} style={{ marginTop: "5px" }}>
                            <Link href="/">
                                <Image
                                    src="/img/accueil/logo/Logo.svg"
                                    alt="Logo"
                                    width={180}
                                    height={180}
                                />
                            </Link>
                        </div>
                        <p className={styles.description}>
                            Situé à Lilas, près de Lens, je propose des séances de magnétisme et sophrologie pour vous accompagner vers un mieux-être global.
                        </p>
                        <div className={styles.socialLinks}>
                            <a href="#" className={styles.socialLink} aria-label="Instagram">
                                <FaInstagram />
                            </a>
                            <a href="#" className={styles.socialLink} aria-label="Facebook">
                                <FaFacebook />
                            </a>
                            <a href="#" className={styles.socialLink} aria-label="LinkedIn">
                                <FaLinkedin />
                            </a>
                            <a href="#" className={styles.socialLink} aria-label="YouTube">
                                <FaYoutube />
                            </a>
                        </div>
                        {/* Deux colonnes pour mobile/tablette */}
                        <div className={`${styles.linksRow} ${styles.mobileOnly}`}>
                            <div className={styles.linksSection}>
                                <h3>Liens Utiles</h3>
                                <ul>
                                    <li><Link href="/">
                                        <RxTriangleRight color="var(--primary-color)" size={22} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                                        Accueil
                                    </Link></li>
                                    <li><Link href="/a-propos">
                                        <RxTriangleRight color="var(--primary-color)" size={22} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                                        À propos
                                    </Link></li>
                                    <li><Link href="/articles">
                                        <RxTriangleRight color="var(--primary-color)" size={22} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                                        Articles
                                    </Link></li>
                                    <li><Link href="/FAQ">
                                        <RxTriangleRight color="var(--primary-color)" size={22} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                                        FAQ
                                    </Link></li>
                                </ul>
                            </div>
                            <div className={styles.linksSection}>
                                <h3>Services</h3>
                                <ul>
                                    <li><Link href="/services/magnetisme">
                                        <RxTriangleRight color="var(--primary-color)" size={22} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                                        Magnétisme
                                    </Link></li>
                                    <li><Link href="/services/sophrologie">
                                        <RxTriangleRight color="var(--primary-color)" size={22} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                                        Sophrologie
                                    </Link></li>
                                    <li><Link href="/services/human-design">
                                        <RxTriangleRight color="var(--primary-color)" size={22} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                                        Human Design
                                    </Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Desktop only : Liens Utiles */}
                    <div className={`${styles.linksSection} ${styles.desktopOnly}`}>
                        <h3>Liens Utiles</h3>
                        <ul>
                            <li><Link href="/">
                                <RxTriangleRight color="var(--primary-color)" size={22} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                                Accueil
                            </Link></li>
                            <li><Link href="/a-propos">
                                <RxTriangleRight color="var(--primary-color)" size={22} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                                À propos
                            </Link></li>
                            <li><Link href="/articles">
                                <RxTriangleRight color="var(--primary-color)" size={22} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                                Articles
                            </Link></li>
                            <li><Link href="/FAQ">
                                <RxTriangleRight color="var(--primary-color)" size={22} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                                FAQ
                            </Link></li>
                        </ul>
                    </div>

                    {/* Desktop only : Services */}
                    <div className={`${styles.linksSection} ${styles.desktopOnly}`}>
                        <h3>Services</h3>
                        <ul>
                            <li><Link href="/services/magnetisme">
                                <RxTriangleRight color="var(--primary-color)" size={22} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                                Magnétisme
                            </Link></li>
                            <li><Link href="/services/sophrologie">
                                <RxTriangleRight color="var(--primary-color)" size={22} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                                Sophrologie
                            </Link></li>
                            <li><Link href="/services/human-design">
                                <RxTriangleRight color="var(--primary-color)" size={22} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                                Human Design
                            </Link></li>
                        </ul>
                    </div>

                    {/* Informations */}
                    <div className={styles.linksSection}>
                        <h3>Informations</h3>
                        <ul>
                            <li><Link href="/mentions-legales">
                                <RxTriangleRight color="var(--primary-color)" size={22} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                                Mentions Légales
                            </Link></li>
                            <li><Link href="/contact">
                                <RxTriangleRight color="var(--primary-color)" size={22} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                                Contact
                            </Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className={styles.newsletterSection}>
                        <h3>Newsletter</h3>
                        <form className={styles.newsletterForm} onSubmit={handleNewsletterSubmit}>
                            <input
                                type="email"
                                ref={emailRef}
                                placeholder="Votre email*"
                                className={styles.emailInput}
                                required
                            />
                            <button type="submit" className={styles.submitButton} aria-label="S'inscrire à la newsletter">
                                <IoArrowForward />
                            </button>
                        </form>
                        <label className={styles.checkbox} style={{ display: 'block', marginTop: '16px' }}>
                            <input
                                type="checkbox"
                                ref={cguRef}
                                checked={cguChecked}
                                onChange={e => setCguChecked(e.target.checked)}
                            />
                            <span> J'accepte les conditions générales d'utilisation </span>
                        </label>
                        {newsletterError && (
                            <div className={styles.confirmationMessage} style={{ color: 'red', marginTop: '10px' }}>
                                {newsletterError}
                            </div>
                        )}
                        {newsletterSent && !newsletterError && (
                            <div className={styles.confirmationMessage} style={{ color: 'green', marginTop: '10px' }}>
                                Merci, votre email a bien été reçu !
                            </div>
                        )}
                    </div>
                </div>

                {/* Copyright */}
                <div className={styles.copyright}>
                    <span>2025</span>
                    <span className={styles.separator}>|</span>
                    <span>Fanny SAEZ</span>
                    <span className={styles.separator}>|</span>
                    <span>© Tous droits réservés.</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;