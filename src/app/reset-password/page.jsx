"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "../components/authForm/form.module.css";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        if (!password || !confirm) {
            setError("Veuillez remplir les deux champs.");
            return;
        }
        if (password !== confirm) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage("Mot de passe réinitialisé avec succès. Vous pouvez vous connecter.");
                setPassword("");
                setConfirm("");
            } else {
                setError(data.message || "Erreur lors de la réinitialisation.");
            }
        } catch (err) {
            setError("Erreur réseau.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles["form-container"]}>
            <h2>Réinitialiser le mot de passe</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles["form-fields"]}>
                    <input
                        type="password"
                        placeholder="Nouveau mot de passe"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        className={styles["form-input"]}
                    />
                    <input
                        type="password"
                        placeholder="Confirmer le mot de passe"
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                        required
                        className={styles["form-input"]}
                    />
                </div>
                <button type="submit" className={styles["form-btn"]} disabled={loading}>
                    {loading ? "Réinitialisation..." : "Réinitialiser"}
                </button>
            </form>
            {message && <p className={styles["form-message"]} style={{ color: "green" }}>{message}</p>}
            {error && <p className={styles["form-message"]} style={{ color: "red" }}>{error}</p>}
        </div>
    );
}
