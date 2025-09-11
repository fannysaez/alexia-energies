"use client";
import styles from "./dashboard.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useEffect, useState, useCallback } from "react";
import Button from "@/app/components/button/button";


function DashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showWelcome, setShowWelcome] = useState(searchParams.get("welcome") === "1");
    const [admin, setAdmin] = useState(undefined); // undefined = loading, null = refusé, objet = ok
    const [selectedSection, setSelectedSection] = useState("infos");

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

    const [showLogoutMsg, setShowLogoutMsg] = useState(false);
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
    // On ne bloque plus l'accès aux utilisateurs simples

    return (
        <div className={styles["dashboard-layout"]}>
            <aside className={styles["dashboard-sidebar"]}>
                <h2>Mon espace</h2>
                <nav className={styles["dashboard-nav"]}>
                    <Button
                        text="Mes infos"
                        variant={selectedSection === "infos" ? "secondary" : "primary"}
                        className={styles["dashboard-nav-link"]}
                        onClick={() => setSelectedSection("infos")}
                        type="button"
                    />
                    <Button
                        text="Mes favoris"
                        variant={selectedSection === "favoris" ? "secondary" : "primary"}
                        className={styles["dashboard-nav-link"]}
                        onClick={() => setSelectedSection("favoris")}
                        type="button"
                    />
                </nav>
                <Button text="Se déconnecter" onClick={handleLogout} className={styles["dashboard-logout"]} type="button" variant="primary" />
            </aside>
            <main className={styles["dashboard-main"]}>
                {showWelcome && (
                    <div style={{
                        background: "#2C2520",
                        color: "#F7CBA4",
                        borderRadius: 10,
                        padding: "18px 0",
                        margin: "0 0 18px 0",
                        fontSize: "1.1rem",
                        textAlign: "center",
                        boxShadow: "0 2px 16px rgba(255, 254, 254, 0.1)"
                    }}>
                        Bienvenue, vous êtes bien connecté !
                    </div>
                )}
                {selectedSection === "infos" && (
                    <>
                        <h1 style={{ color: "var(--primary-color)", fontFamily: "'SortsMillGoudy-Regular', serif", fontSize: "2rem", marginBottom: 18 }}>
                            Votre espace personnel, {admin.firstname || admin.firstName || admin.email}
                        </h1>
                        <div style={{ color: "var(--paragraph-color)", fontSize: "1.1rem", marginBottom: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                            <span>Vous êtes connecté en tant qu'utilisateur.</span>
                            <span>Ce dashboard est réservé à vos informations personnelles.</span>
                        </div>
                    </>
                )}
                {selectedSection === "favoris" && (
                    <div>
                        <h2 style={{ color: "var(--primary-color)", fontFamily: "'SortsMillGoudy-Regular', serif", fontSize: "1.5rem", marginBottom: 18 }}>
                            Mes favoris
                        </h2>
                        <p style={{ color: "var(--paragraph-color)", fontSize: "1.1rem" }}>
                            (Section favoris à compléter)
                        </p>
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
