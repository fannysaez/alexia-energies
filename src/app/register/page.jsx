"use client";
import AuthForm from "../components/authForm/AuthForm";
import StarBlack from "/public/img/boutons/VectorStarBlack.svg";

export default function RegisterPage() {
    // La redirection est gérée dans AuthForm selon le rôle
    return (
        <AuthForm
            title="Inscription"
            apiEndpoint="/api/register"
            buttonText="S'inscrire"
            linkText="Se connecter"
            linkHref="/login"
            linkLabel="Déjà inscrit ?"
            leftVector={<StarBlack />}
        />
    );
}
