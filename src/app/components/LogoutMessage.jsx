import React from "react";

export default function LogoutMessage() {
    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(26,24,22,0.98)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <h2 style={{ color: "#FFD9A0", fontSize: "2rem", marginBottom: 18, textAlign: "center", fontFamily: "'SortsMillGoudy-Regular', serif" }}>
                Merci ! À bientôt <span role="img" aria-label="bye">👋</span>
            </h2>
            <div style={{ color: "#FFD9A0", fontSize: "1.1rem", textAlign: "center" }}>
                Vous allez être redirigé vers la page de connexion...
            </div>
        </div>
    );
}
