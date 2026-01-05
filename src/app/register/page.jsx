"use client";
import AuthForm from "../components/authForm/AuthForm";
// ...existing code...

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
            leftVector={<img src="/img/boutons/VectorStarBlack.svg" alt="Étoile noire" width={16} height={16} />}
        />
    );
}
