"use client";
import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import styles from "../components/authForm/form.module.css";
import Button from "../components/button/button";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ResetPasswordPageInner() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Debug du token
    React.useEffect(() => {
        console.log("Token reçu:", token);
        if (!token) {
            setError("Token manquant dans l'URL.");
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!token) {
            setError("Token manquant.");
            return;
        }

        if (!password || !confirm) {
            setError("Veuillez remplir les deux champs.");
            return;
        }
        if (password !== confirm) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }
        if (password.length < 8) {
            setError("Le mot de passe doit contenir au moins 8 caractères.");
            return;
        }

        setLoading(true);
        try {
            console.log("Envoi du token:", token);
            const res = await fetch("/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });
            const data = await res.json();
            console.log("Réponse API:", data);

            if (res.ok) {
                setMessage("Mot de passe réinitialisé avec succès. Vous pouvez vous connecter.");
                setPassword("");
                setConfirm("");
            } else {
                setError(data.message || "Erreur lors de la réinitialisation.");
            }
        } catch (err) {
            console.error("Erreur:", err);
            setError("Erreur serveur.");
        }
        setLoading(false);
    };

    return (
        <div className={styles["form-container"]}>
            <h2>Réinitialiser le mot de passe</h2>
            {token && <p style={{ fontSize: "0.8em", opacity: 0.7 }}>Token: {token.substring(0, 10)}...</p>}
            <form onSubmit={handleSubmit}>
                <div className={styles["form-fields"]}>
                    {/* Champ mot de passe avec œil */}
                    <div style={{ position: "relative" }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Nouveau mot de passe"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className={styles["form-input"]}
                            style={{ paddingRight: "45px" }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: "absolute",
                                right: "15px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#7c6a46"
                            }}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {/* Champ confirmation avec œil */}
                    <div style={{ position: "relative" }}>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirmer le mot de passe"
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            required
                            className={styles["form-input"]}
                            style={{ paddingRight: "45px" }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{
                                position: "absolute",
                                right: "15px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#7c6a46"
                            }}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                <Button
                    type="submit"
                    text={loading ? "Réinitialisation..." : "RÉINITIALISER"}
                    className={styles["form-btn"]}
                    disabled={loading}
                    leftVector={<img src="/img/boutons/VectorStarBlack.svg" alt="" className={styles.leftVector} />}
                    rightVector={<img src="/img/boutons/VectorStarBlack.svg" alt="" className={styles.rightVector} />}
                />
            </form>
            {error && <p className={styles["form-message"]} style={{ color: "red" }}>{error}</p>}
            {message && <p className={styles["form-message"]} style={{ color: "green" }}>{message}</p>}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense>
            <ResetPasswordPageInner />
        </Suspense>
    );
}
// Suppression du code dupliqué et de la fonction Wrapper
