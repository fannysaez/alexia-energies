"use client";
import styles from "./dashboard.module.css";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/app/components/button/button";

function DashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showWelcome, setShowWelcome] = useState(searchParams.get("welcome") === "1");
    const [admin, setAdmin] = useState(undefined); // undefined = loading, null = refusé, objet = ok
    const [selectedSection, setSelectedSection] = useState("home");
    const [showLogoutMsg, setShowLogoutMsg] = useState(false);

    useEffect(() => {
        // Récupération de l'admin via le token JWT
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) {
            setAdmin(null);
            return;
        }
        fetch("/api/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then(setAdmin)
            .catch(() => setAdmin(null));
    }, []);

    useEffect(() => {
        if (showWelcome) {
            const timer = setTimeout(() => setShowWelcome(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showWelcome]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.setItem("showLogoutMsg", "1");
        setShowLogoutMsg(true);
        setTimeout(() => {
            setShowLogoutMsg(false);
            router.push("/login");
        }, 1800);
    };

    // Affichage du message de déconnexion si showLogoutMsg présent dans localStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            if (localStorage.getItem("showLogoutMsg") === "1") {
                setShowLogoutMsg(true);
                localStorage.removeItem("showLogoutMsg");
                setTimeout(() => {
                    setShowLogoutMsg(false);
                    router.push("/login");
                }, 1800);
            }
        }
    }, [router]);

    // Gestion de la redirection pour utilisateur non connecté uniquement
    useEffect(() => {
        if (admin === null) {
            router.replace("/login");
        }
    }, [admin, router]);

    if (admin === undefined) {
        return <p>Chargement...</p>;
    }
    if (admin === null) {
        router.replace("/login");
        return null;
    }
    if (showLogoutMsg) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: '#1a1816',
                width: '100vw',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 9999
            }}>
                <h2 style={{ color: '#FFD9A0', fontSize: '2rem', marginBottom: 16, fontWeight: 700, textAlign: 'center' }}>Merci ! À bientôt 👋</h2>
                <p style={{ color: '#fff', fontSize: '1.2rem', textAlign: 'center' }}>
                    Vous allez être redirigé vers la page de connexion...
                </p>
            </div>
        );
    }

    return (
        <div className={styles["dashboard-layout"]}>
            <aside className={styles["dashboard-sidebar"]}>
                <h2>Mon Espace</h2>
                <nav className={styles["dashboard-nav"]}>
                    <Button
                        text="Accueil"
                        variant={selectedSection === "home" ? "secondary" : "primary"}
                        className={styles["dashboard-nav-link"]}
                        onClick={() => setSelectedSection("home")}
                        type="button"
                    />
                    <Button
                        text="Mon profil"
                        variant={selectedSection === "profile" ? "secondary" : "primary"}
                        className={styles["dashboard-nav-link"]}
                        onClick={() => setSelectedSection("profile")}
                        type="button"
                    />
                    <Button
                        text="Mes Favoris"
                        variant={selectedSection === "favorites" ? "secondary" : "primary"}
                        className={styles["dashboard-nav-link"]}
                        onClick={() => setSelectedSection("favorites")}
                        type="button"
                    />
                </nav>
                <Button
                    text="Se déconnecter"
                    onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    }}
                    className={styles["dashboard-logout"]}
                    type="button"
                    variant="primary"
                />
            </aside>
            <main className={styles["dashboard-main"]}>
                {selectedSection === "home" ? (
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
                        <h1 style={{ color: "#FFD9A0", fontFamily: "'SortsMillGoudy-Regular', serif", fontSize: "2.5rem", marginBottom: 18, textAlign: "center" }}>
                            {admin && admin.firstName ? `Votre espace personnel, ${admin.firstName}` : "Votre espace personnel"}
                        </h1>
                        <p style={{ color: "#fff", fontSize: "1.2rem", textAlign: "center", marginBottom: 8 }}>
                            Vous êtes connecté en tant qu'utilisateur.<br />
                            Ce dashboard est réservé à vos informations personnelles.
                        </p>
                    </div>
                ) : selectedSection === "profile" ? (
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <h1 style={{ color: "var(--primary-color)", fontFamily: "'SortsMillGoudy-Regular', serif", fontSize: "2rem", marginBottom: 18 }}>
                            Mon profil
                        </h1>
                        {/* Affichage des infos utilisateur */}
                        {admin ? (
                            <div style={{ background: "rgba(44,34,23,0.85)", border: "2px solid #FFD9A0", borderRadius: 16, boxShadow: "0 2px 16px #0002", padding: "32px 28px", minWidth: 320, maxWidth: 500 }}>
                                <p><strong>Nom :</strong> {admin.firstName} {admin.lastName}</p>
                                <p><strong>Email :</strong> {admin.email}</p>
                                {/* Ajoute d'autres infos si besoin */}
                            </div>
                        ) : (
                            <div style={{ color: '#FFD9A0', textAlign: 'center' }}>Utilisateur non connecté.</div>
                        )}
                    </div>
                ) : (
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <h1 style={{ color: "var(--primary-color)", fontFamily: "'SortsMillGoudy-Regular', serif", fontSize: "2rem", marginBottom: 18 }}>
                            Mes Favoris
                        </h1>
                        {/* Ici tu pourras afficher la liste des favoris de l'utilisateur */}
                        <div style={{ background: "rgba(44,34,23,0.85)", border: "2px solid #FFD9A0", borderRadius: 16, boxShadow: "0 2px 16px #0002", padding: "32px 28px", minWidth: 320, maxWidth: 700 }}>
                            <p>Aucun favori pour le moment.</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div>Chargement du dashboard...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
