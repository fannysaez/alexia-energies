"use client";
import styles from "./form.module.css";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Button from "@/app/components/button/button"; // Composant bouton personnalisé
import Image from "next/image"; // Composant Next.js pour l'optimisation des images
import StarBlack from "/public/img/boutons/VectorStarBlack.svg"; // Icône étoile noire


export default function AuthForm({
    title,
    apiEndpoint,
    buttonText,
    linkText,
    linkHref,
    linkLabel,
    onSuccess,
    logoutMessage
}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [firstname, setFirstname] = useState("");
    // Le rôle n'est plus choisi côté front, il sera toujours 'user' à l'inscription
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            let endpoint = apiEndpoint;
            let body;
            if (apiEndpoint.includes("register")) {
                endpoint = "/api/register";
                body = { email, password, firstname };
            }
            if (apiEndpoint.includes("login")) {
                // Connexion : on tente d'abord sur admin, puis user si échec
                let res = await fetch("/api/admin/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });
                let data = await res.json();
                if (res.ok) {
                    if (data.token) {
                        localStorage.setItem("token", data.token);
                    }
                    router.push("/admin/dashboard");
                    setLoading(false);
                    return;
                }
                // Si pas admin, on tente user
                res = await fetch("/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });
                data = await res.json();
                if (res.ok) {
                    if (data.token) {
                        localStorage.setItem("token", data.token);
                    }
                    router.push("/dashboard");
                } else {
                    setMessage(data.message || "Identifiants incorrects");
                }
                setLoading(false);
                return;
            }

            // Inscription classique
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (res.ok) {
                if (apiEndpoint.includes("register")) {
                    setMessage("Votre inscription a bien été prise en compte ! Vous pouvez maintenant vous connecter.");
                    setEmail("");
                    setPassword("");
                    setFirstname("");
                    // Rien à faire, le rôle est toujours 'user'
                    setLoading(false);
                    return;
                }
                if (data.token) {
                    localStorage.setItem("token", data.token);
                }
                // Redirection selon le rôle renvoyé par le backend
                if (data.role === "admin") {
                    router.push("/admin/dashboard");
                } else {
                    router.push("/dashboard");
                }
            } else {
                setMessage(data.message || "Erreur");
            }
        } catch (err) {
            setMessage("Erreur réseau");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles["form-container"]}>
            {logoutMessage && (
                <div style={{
                    background: "#2C2520",
                    color: "#F7CBA4",
                    borderRadius: 10,
                    padding: "18px 0",
                    margin: "0 0 18px 0",
                    fontSize: "1.1rem",
                    textAlign: "center",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.10)"
                }}>
                    {logoutMessage}
                </div>
            )}
            <h2>{title}</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles["form-fields"]}>
                    <input
                        type="text"
                        placeholder="Prénom"
                        value={firstname}
                        onChange={e => setFirstname(e.target.value)}
                        required
                        className={styles["form-input"]}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className={styles["form-input"]}
                    />
                    <div style={{ position: "relative" }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mot de passe"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className={styles["form-input"]}
                            style={{ paddingRight: "38px" }}
                        />
                        <span
                            onClick={() => setShowPassword((v) => !v)}
                            style={{
                                position: "absolute",
                                right: 15,
                                top: "55%", // Descendu de 33% à 55%
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                color: "#A88B6F",
                                fontSize: "1.2rem"
                            }}
                            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    {/* Le choix du rôle a été retiré pour la sécurité */}
                </div>
                <Button
                    text={loading ? buttonText + "..." : buttonText}
                    type="submit"
                    className={styles["form-btn"]}
                    disabled={loading}
                    variant="secondary"
                    leftVector={<Image src={StarBlack} alt="" width={16} height={16} />}
                    rightVector={<Image src={StarBlack} alt="" width={16} height={16} />}
                />
            </form>
            {message && <p className={styles["form-message"]}>{message}</p>}
            <div className={styles["form-link-container"]}>
                <span className={styles["form-link-label"]}>{linkLabel} </span>
                <a href={linkHref} className={styles["register-link"]}>{linkText}</a>
            </div>
        </div>
    );
}
