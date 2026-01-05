"use client";
import AuthForm from "../components/authForm/AuthForm";
import Button from "../components/button/button";
// ...existing code...
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
    const [showLogoutMsg, setShowLogoutMsg] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined" && localStorage.getItem("showLogoutMsg") === "1") {
            setShowLogoutMsg(true);
            localStorage.removeItem("showLogoutMsg");
            const timer = setTimeout(() => {
                setShowLogoutMsg(false);
                window.location.reload();
            }, 1800);
            return () => clearTimeout(timer);
        }
    }, []);

    // La redirection est gérée dans AuthForm selon le rôle
    return (
        <AuthForm
            title="Connectez-vous"
            apiEndpoint="/api/login"
            buttonText="Se connecter"
            linkText="S'inscrire"
            linkHref="/register"
            linkLabel="Pas de compte ?"
            leftVector={<img src="/img/boutons/VectorStarBlack.svg" alt="Étoile noire" width={16} height={16} />}
            logoutMessage={undefined}
        />
    );
}
