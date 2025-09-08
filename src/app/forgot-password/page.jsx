"use client";
import React, { useState } from "react";
import styles from "../components/authForm/form.module.css";
import StarBlack from "/public/img/boutons/VectorStarBlack.svg";
import Button from "../components/button/button";
import Image from "next/image";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!email) {
            setError("Veuillez entrer votre adresse email.");
            return;
        }

        try {
            const response = await fetch("/api/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                // Rafraîchir la page après 3 secondes
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } else {
                setError(data.message || "Une erreur est survenue.");
            }
        } catch (error) {
            console.error("Erreur:", error);
            setError("Une erreur est survenue lors de l'envoi.");
        }
    };

    return (
        <div className={styles["form-container"]}>
            <h2>Réinitialiser votre <br /> mot de passe</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles["form-fields"]}>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles["form-input"]}
                        placeholder="votre adresse email"
                    />
                </div>
                <Button
                    type="submit"
                    text="Envoyer l’email"
                    className={styles["form-btn"]}
                    leftVector={<Image src="/img/boutons/VectorStarBlack.svg" alt="Icône étoile gauche" width={16} height={16} className={styles.leftVector} />}
                    rightVector={<Image src="/img/boutons/VectorStarBlack.svg" alt="Icône étoile droite" width={16} height={16} className={styles.rightVector} />}
                />
            </form>
            {message && <p className={styles["form-message"]} style={{ color: "green" }}>{message}</p>}
            {error && <p className={styles["form-message"]} style={{ color: "red" }}>{error}</p>}
        </div>
    );
}
