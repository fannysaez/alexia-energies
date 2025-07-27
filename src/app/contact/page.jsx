"use client";
import React, { useRef, useState } from "react";
import styles from "./contact.module.css";
import { FaInstagram, FaFacebook, FaLinkedin, FaYoutube } from "react-icons/fa";
// 1. Importer EmailJS
import emailjs from "@emailjs/browser";
emailjs.init('PiVdAe2tWh7_IHgah');

export default function ContactPage() {
    // 2. Créer la référence du formulaire
    const form = useRef();
    // État pour le message d'envoi
    const [statusMessage, setStatusMessage] = useState("");
    // 3. Fonction d'envoi EmailJS avec vérification du captcha
    const sendEmail = (e) => {
        e.preventDefault();
        setStatusMessage("");
        const captchaValue = form.current.captcha.value;
        if (captchaValue !== "11") {
            setStatusMessage("Captcha incorrect. Veuillez répondre correctement à la question.");
            return;
        }
        emailjs
            .sendForm(
                'service_awghmus',
                'template_4smt7tc',
                form.current,
                {
                    publicKey: 'PiVdAe2tWh7_IHgah',
                }
            )
            .then(
                () => {
                    setStatusMessage("Message envoyé avec succès");
                    form.current.reset();
                    setTimeout(() => setStatusMessage(""), 3000);
                },
                (error) => {
                    setStatusMessage("Erreur lors de l'envoi : " + error.text);
                }
            );
    };

    return (
        <>
            <div className={styles.contactHeader}>
                <h2 className={styles.contactTitle}>Contactez-moi</h2>
                <nav className={styles.heroBreadcrumb}>
                    <a href="/">Accueil</a>
                    <span>›</span>
                    <span>Contact</span>
                </nav>
            </div>
            <section className={styles.container}>
                <div className={styles.left}>
                    <div className={styles.subtitle}>Magnétisme & Sophrologie près d'Arras</div>
                    <h1 className={styles.title}>Bien-être, relaxation et accompagnement personnalisé</h1>
                    <div className={styles.text}>
                        Située à Villers-au-Bois, je vous propose des séances de magnétisme et sophrologie pour vous accompagner vers un mieux-être global.<br />
                        Besoin d’un conseil ou d’un renseignement&nbsp;? Je vous réponds avec bienveillance sous 48h, par téléphone, email ou via le formulaire ci-dessous.<br />
                        Prenez soin de vous, je suis là pour vous guider.
                    </div>
                    <div className={styles.socialLinks}>
                        <a href="https://instagram.com" target="_blank" rel="noopener" className={styles.socialLink}>
                            <FaInstagram />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener" className={styles.socialLink}>
                            <FaFacebook />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener" className={styles.socialLink}>
                            <FaLinkedin />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener" className={styles.socialLink}>
                            <FaYoutube />
                        </a>
                    </div>
                </div>
                {/* Bloc droit : formulaire */}
                <div className={styles.right}>
                    <div className={styles["form-container"]}>
                        {/* 5. Relier le formulaire à EmailJS */}
                        <form ref={form} className={styles["form-fields"]} onSubmit={sendEmail}>
                            <input className={styles["form-input"]} type="text" name="nom" placeholder="Votre nom" required />
                            <input className={styles["form-input"]} type="email" name="email" placeholder="Votre e-mail" required />
                            <textarea className={styles["form-input"]} name="message" rows={5} placeholder="Entrez votre message ici..." required />
                            <div className={styles.captcha}>10 + 1 = <input name="captcha" type="text" style={{ width: '40px', marginLeft: '8px' }} required /></div>
                            <button type="submit" className={styles["form-btn"]}>Envoyer un message</button>
                        </form>
                        {statusMessage && (
                            <div
                                className={
                                    statusMessage.startsWith('Message envoyé')
                                        ? styles.statusSuccess
                                        : styles.statusError
                                }
                            >
                                {statusMessage}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}