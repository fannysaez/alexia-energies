import React, { useState } from "react";
import styles from "../components/authForm/form.module.css";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        // Ici, tu pourras ajouter la logique d'appel à l'API pour réinitialiser le mot de passe
        if (!email) {
            setError("Veuillez entrer votre adresse email.");
            return;
        }
        // Simulation d'envoi
        setMessage("Si cette adresse existe, un email de réinitialisation a été envoyé.");
    };

    return (
        <div className={styles["form-container"]}>
            <h2>Réinitialiser le mot de passe</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles["form-fields"]}>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles["form-input"]}
                        placeholder="Adresse email"
                    />
                </div>
                <button type="submit" className={styles["form-btn"]}>
                    Envoyer le lien de réinitialisation
                </button>
            </form>
            {message && <p className={styles["form-message"]} style={{ color: "green" }}>{message}</p>}
            {error && <p className={styles["form-message"]} style={{ color: "red" }}>{error}</p>}
        </div>
    );
}
