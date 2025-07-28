"use client"; // Indique que ce composant est côté client (Next.js)
import { useState, useEffect } from "react"; // Hooks React pour état et effets
import { usePathname } from 'next/navigation'; // Hook Next.js pour obtenir le chemin courant
import Link from "next/link"; // Composant de navigation Next.js
import Image from "next/image"; // Composant d'image optimisée Next.js
import style from "./header.module.css"; // Styles CSS modules pour le header
import Button from "@/app/components/button/button"; // Composant bouton personnalisé
import StarBlack from "/public/img/boutons/VectorStarBlack.svg"; // Icône étoile noire pour les boutons
import { FaChevronRight, FaUser } from "react-icons/fa";

// Composant principal Header
export default function Header() {
    // État pour le menu burger mobile et le sous-menu services
    const [menuOpen, setMenuOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [isLogged, setIsLogged] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const pathname = usePathname();

    // Vérifie la session admin
    useEffect(() => {
        const checkToken = () => {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            setIsLogged(!!token);
            if (token) {
                try {
                    // Décodage du token JWT pour récupérer le rôle
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    setIsAdmin(payload.role === 'admin');
                } catch (e) {
                    setIsAdmin(false);
                }
            } else {
                setIsAdmin(false);
            }
        };
        checkToken();
        window.addEventListener('storage', checkToken);
        const interval = setInterval(checkToken, 1000);
        return () => {
            window.removeEventListener('storage', checkToken);
            clearInterval(interval);
        };
    }, []);

    // Ferme le sous-menu services si le menu principal est fermé
    useEffect(() => {
        if (!menuOpen) setServicesOpen(false);
    }, [menuOpen]);

    // Monte le composant
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Fonctions pour ouvrir/fermer le menu mobile
    const closeMenu = () => {
        setMenuOpen(false);
    };
    const openMenu = () => {
        setMenuOpen(true);
    };

    return (
        <header className={style.header}>
            <div className={style.container}>
                {/* Logo */}
                <div className={style.logo} style={{ marginTop: "5px" }}>
                    <Link href="/">
                        <Image
                            src="/img/accueil/logo/Logo.svg"
                            alt="Logo"
                            width={180}
                            height={180}
                            priority
                        />
                    </Link>
                </div>

                {/* Navigation principale (desktop) */}
                <nav className={style.nav}>
                    <Link href="/" className={`${style.navLink} ${pathname === '/' ? style.active : ''}`}>Accueil</Link>
                    <Link href="/a-propos" className={`${style.navLink} ${pathname === '/a-propos' ? style.active : ''}`}>À Propos</Link>

                    {/* Dropdown Services (desktop) */}
                    <div className={style.servicesDropdown}>
                        <div className={`${style.servicesLink} ${pathname === '/services' || pathname.startsWith('/services/') ? style.active : ''}`}>
                            Services
                            <span className={style.chevronIcon}><FaChevronRight /></span>
                        </div>
                        <div className={style.dropdownMenu}>
                            <Link href="/services/human-design" className={style.dropdownItem}>
                                Human Design
                            </Link>
                            <Link href="/services/magnetisme" className={style.dropdownItem}>
                                Magnétisme
                            </Link>
                            <Link href="/services/sophrologie" className={style.dropdownItem}>
                                Sophrologie
                            </Link>
                        </div>
                    </div>

                    <Link href="/articles" className={`${style.navLink} ${pathname === '/articles' ? style.active : ''}`}>Articles</Link>
                    <Link href="/FAQ" className={`${style.navLink} ${pathname === '/FAQ' ? style.active : ''}`}>FAQ</Link>
                </nav>

                {/* Bouton principal (desktop) + icône user */}
                <div className={`${style.buttons} ${style.buttonOffset}`} style={{ display: 'flex', flexDirection: 'row', marginTop: '5px', alignItems: 'center', gap: '16px' }}>
                    <Button
                        className={style.ButtonRdv}
                        text="Prendre rdv"
                        link="/contact"
                        variant="secondary"
                        leftVector={<Image src={StarBlack} alt="" width={16} height={16} />}
                        rightVector={<Image src={StarBlack} alt="" width={16} height={16} />}
                    />
                    {/* Bouton Connexion/Profil visible uniquement pour admin connecté */}
                    {isMounted && isLogged && isAdmin && (
                        <Button
                            className={style.ButtonConnexionMonProfil}
                            text="Mon Profil"
                            link="/admin/dashboard"
                            variant="primary"
                            leftVector={<Image src="/img/boutons/VectorStarWhite.svg" alt="" width={16} height={16} />}
                            rightVector={<Image src="/img/boutons/VectorStarWhite.svg" alt="" width={16} height={16} />}
                        />
                    )}
                </div>

                {/* Bouton burger pour menu mobile */}
                <button
                    className={style.burger}
                    style={{ marginTop: "-10px" }}
                    aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                    onClick={menuOpen ? closeMenu : openMenu}
                >
                    {/* Icône burger ou croix selon l'état */}
                    {menuOpen ? (
                        <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                            <circle
                                cx="25"
                                cy="25"
                                r="24"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="transparent"
                            />
                            <path d="M16 16L34 34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M34 16L16 34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    ) : (
                        <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                            <circle
                                cx="25"
                                cy="25"
                                r="24"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="transparent"
                            />
                            <line
                                x1="16"
                                y1="20"
                                x2="34"
                                y2="20"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <line
                                x1="16"
                                y1="25"
                                x2="34"
                                y2="25"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <line
                                x1="16"
                                y1="30"
                                x2="34"
                                y2="30"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    )}
                </button>
            </div>

            {/* Menu mobile (overlay) */}
            {menuOpen && (
                <div className={style.mobileOverlay} onClick={closeMenu}>
                    <div className={style.mobileMenu} onClick={(e) => e.stopPropagation()}>
                        <nav className={style.mobileNav}>
                            {/* Liens du menu mobile */}
                            <MenuItem label="Accueil" href="/" onClick={closeMenu} pathname={pathname} />
                            <Separator />
                            <MenuItem label="À Propos" href="/a-propos" onClick={closeMenu} pathname={pathname} />
                            <Separator />
                            {/* Sous-menu Services (mobile) */}
                            <div className={style.mobileItem}>
                                <button
                                    className={`${style.mobileDropdownBtn} ${(pathname === '/services' || pathname.startsWith('/services/')) ? style.active : ''}`}
                                    onClick={() => setServicesOpen(o => !o)}
                                    aria-expanded={servicesOpen}
                                >
                                    <span>Services</span>
                                    <span
                                        className={`${style.chevronMobile} ${servicesOpen ? style.chevronOpen : ''}`}
                                    >
                                        <FaChevronRight />
                                    </span>
                                </button>
                                {servicesOpen && (
                                    <div className={style.mobileSubMenu}>
                                        <SubMenuItem label="Human Design" href="/services/human-design" onClick={closeMenu} pathname={pathname} />
                                        <SubMenuItem label="Magnétisme" href="/services/magnetisme" onClick={closeMenu} pathname={pathname} />
                                        <SubMenuItem label="Sophrologie" href="/services/sophrologie" onClick={closeMenu} pathname={pathname} />
                                    </div>
                                )}
                            </div>
                            <Separator />
                            <MenuItem label="Articles" href="/articles" onClick={closeMenu} pathname={pathname} />
                            <Separator />
                            <MenuItem label="FAQ" href="/FAQ" onClick={closeMenu} pathname={pathname} />
                            {/* Boutons mobile : Prendre rdv + Mon Profil (si admin connecté) + Contactez-moi */}
                            <div className={style.mobileFooter} style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', marginTop: 20 }}>
                                <Button
                                    className={style.mobileFooterButtonRdv}
                                    text="Prendre rdv"
                                    link="/contact"
                                    variant="secondary"
                                    leftVector={<Image src={StarBlack} alt="" width={16} height={16} />}
                                    rightVector={<Image src={StarBlack} alt="" width={16} height={16} />}
                                    onClick={closeMenu}
                                />
                                {isMounted && isLogged && isAdmin && (
                                    <Button
                                        className={style.mobileFooterButtonConnexion}
                                        text="Mon Profil"
                                        link="/admin/dashboard"
                                        variant="primary"
                                        leftVector={<Image src="/img/boutons/VectorStarWhite.svg" alt="" width={16} height={16} />}
                                        rightVector={<Image src="/img/boutons/VectorStarWhite.svg" alt="" width={16} height={16} />}
                                        onClick={closeMenu}
                                    />
                                )}
                                <Button
                                    className={style.mobileFooterButtonContact}
                                    text="Contactez-moi"
                                    link="/contact"
                                    variant="secondary"
                                    leftVector={<Image src={StarBlack} alt="" width={16} height={16} />}
                                    rightVector={<Image src={StarBlack} alt="" width={16} height={16} />}
                                    onClick={closeMenu}
                                />
                            </div>
                        </nav>

                    </div>
                </div>
            )}
        </header>
    );
}

// Composant pour un item du menu mobile
function MenuItem({ label, href, onClick, pathname }) {
    const isActive = href === '/services'
        ? pathname === '/services' || pathname.startsWith('/services/')
        : pathname === href;

    return (
        <div className={style.mobileItem}>
            <Link href={href} className={`${style.mobileLink} ${isActive ? style.active : ''}`} onClick={onClick}>
                {label}
            </Link>
        </div>
    );
}

// Séparateur graphique pour le menu mobile
function Separator() {
    return (
        <div className={style.mobileSeparator}>
            <span className={style.sepCircle}></span>
            <div className={style.sepLine}></div>
            <span className={style.sepCircle}></span>
        </div>
    );
}

// Item du sous-menu Services (mobile)
function SubMenuItem({ label, href, onClick }) {
    return (
        <Link href={href} className={style.mobileSubLink} onClick={onClick}>
            <span className={style.subArrow}>▶</span> {label}
        </Link>
    );
}