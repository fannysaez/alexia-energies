"use client";
import styles from "../../dashboard/dashboard.module.css";
import dynamic from "next/dynamic";
// Import dynamique pour éviter SSR
const NewsletterAdmin = dynamic(() => import("../newsletter/page"), { ssr: false });
const UsersAdmin = dynamic(() => import("../users/page"), { ssr: false });
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useEffect, useState, useCallback } from "react";
import ArticleForm from "@/app/admin/articles/ArticleForm";
import Button from "@/app/components/button/button";
import DeleteArticleModal from "@/app/components/modal/admin/dashboard/DeleteArticleModal";
// import EditArticleModal from "@/app/components/modal/admin/dashboard/EditArticleModal";




function DashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showWelcome, setShowWelcome] = useState(searchParams.get("welcome") === "1");
    const [admin, setAdmin] = useState(undefined); // undefined = loading, null = refusé, objet = ok
    const [selectedSection, setSelectedSection] = useState("welcome");

    // Onglet actif pour la gestion des articles
    const [articleTab, setArticleTab] = useState('add');

    // Pagination states
    const [editPage, setEditPage] = useState(1);
    const [deletePage, setDeletePage] = useState(1);
    const ARTICLES_PER_PAGE = 3;

    // Gestion des articles (fetch, delete, edit)
    const [articles, setArticles] = useState([]);
    const [loadingArticles, setLoadingArticles] = useState(false);
    const [errorArticles, setErrorArticles] = useState('');
    const [editArticle, setEditArticle] = useState(null); // Pour édition future
    const [deleteArticle, setDeleteArticle] = useState(null);
    const [successDelete, setSuccessDelete] = useState("");
    const [successEdit, setSuccessEdit] = useState("");

    const fetchArticles = useCallback(async () => {
        setLoadingArticles(true);
        setErrorArticles('');
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const res = await fetch('/api/admin/articles', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }); // Utiliser la route admin pour voir tous les articles
            const data = await res.json();
            console.log(data);

            if (!res.ok) throw new Error(data.error || 'Erreur lors du chargement');
            setArticles(data);
        } catch (err) {
            setErrorArticles(err.message);
        } finally {
            setLoadingArticles(false);
        }
    }, []);


    useEffect(() => {
        if (selectedSection === 'articles') fetchArticles();
    }, [selectedSection, fetchArticles]);

    // Reset pagination when switching tabs
    useEffect(() => {
        setEditPage(1);
        setDeletePage(1);
    }, [articleTab]);

    const handleDelete = async (id) => {
        try {
            // On suppose que tu passes l'article complet ou que tu as accès au slug
            const article = articles.find(a => a.id === id);
            if (!article) throw new Error('Article introuvable');
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const res = await fetch(`/api/articles/${article.slug}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erreur lors de la suppression');
            setArticles(articles => articles.filter(a => a.id !== id));
            setSuccessDelete("Votre article a bien été supprimé.");
            setTimeout(() => setSuccessDelete(""), 3000);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleEdit = (article) => {
        setEditArticle(article);
    };

    const handleEditSave = async (updatedArticle) => {
        // Appel API pour update (à adapter selon ton API)
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const res = await fetch(`/api/articles/${updatedArticle.slug}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedArticle),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erreur lors de la modification');
            setArticles(articles => articles.map(a => a.id === updatedArticle.id ? data : a));
            setEditArticle(null);
            setSuccessEdit("Votre article a été modifié avec succès.");
            setTimeout(() => setSuccessEdit(""), 3000);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDeleteClick = (article) => {
        setDeleteArticle(article);
    };

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
        router.push("/login");
    };

    // On ne redirige plus, on ne fait rien de spécial si l'utilisateur n'est pas admin ou non connecté
    if (admin === undefined) {
        return <p>Chargement...</p>;
    }

    return (
        <div className={styles["dashboard-layout"]}>
            <aside className={styles["dashboard-sidebar"]}>
                <h2>Admin Panel</h2>
                <nav className={styles["dashboard-nav"]}>
                    <Button
                        text="Articles"
                        variant={selectedSection === "articles" ? "secondary" : "primary"}
                        className={styles["dashboard-nav-link"]}
                        onClick={() => setSelectedSection("articles")}
                        type="button"
                    />
                    <Button
                        text="Utilisateurs"
                        variant={selectedSection === "users" ? "secondary" : "primary"}
                        className={styles["dashboard-nav-link"]}
                        onClick={() => setSelectedSection("users")}
                        type="button"
                    />
                    <Button
                        text="Newsletter"
                        variant={selectedSection === "newsletter" ? "secondary" : "primary"}
                        className={styles["dashboard-nav-link"]}
                        onClick={() => setSelectedSection("newsletter")}
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
                {selectedSection === "articles" ? (
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <h1 style={{ color: "var(--primary-color)", fontFamily: "'SortsMillGoudy-Regular', serif", fontSize: "2rem", marginBottom: 18 }}>
                            Gestion des articles
                        </h1>
                        {/* Sous-menu onglets */}
                        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                            <button
                                style={{
                                    background: articleTab === 'add' ? '#FFD9A0' : '#2C2520',
                                    color: articleTab === 'add' ? '#2C2520' : '#FFD9A0',
                                    border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 16
                                }}
                                onClick={() => setArticleTab('add')}
                            >Ajouter</button>
                            <button
                                style={{
                                    background: articleTab === 'edit' ? '#FFD9A0' : '#2C2520',
                                    color: articleTab === 'edit' ? '#2C2520' : '#FFD9A0',
                                    border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 16
                                }}
                                onClick={() => setArticleTab('edit')}
                            >Modifier</button>
                            <button
                                style={{
                                    background: articleTab === 'delete' ? '#FFD9A0' : '#2C2520',
                                    color: articleTab === 'delete' ? '#2C2520' : '#FFD9A0',
                                    border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 16
                                }}
                                onClick={() => setArticleTab('delete')}
                            >Supprimer</button>
                        </div>
                        {/* Contenu selon l'onglet */}
                        {articleTab === 'add' && (
                            <>
                                <div style={{
                                    width: '100%',
                                    borderBottom: '1.5px solid var(--decorative-line-color)',
                                    margin: '18px 0 36px 0',
                                }} />
                                <div style={{ width: '100%', maxWidth: 800, minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{
                                        width: '100%',
                                        margin: '0 auto',
                                        background: 'rgba(44, 34, 23, 0.85)',
                                        border: '2px solid #FFD9A0',
                                        borderRadius: 16,
                                        boxShadow: '0 2px 16px #0002',
                                        padding: '32px 28px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}>
                                        <ArticleForm onSuccess={fetchArticles} />
                                    </div>
                                </div>
                            </>
                        )}
                        {articleTab === 'edit' && (
                            <>
                                <div style={{
                                    width: '100%',
                                    borderBottom: '1.5px solid var(--decorative-line-color)',
                                    margin: '18px 0 36px 0',
                                }} />
                                <div style={{ width: '100%', maxWidth: 900, minHeight: '60vh', margin: '0 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: 'rgba(44,34,23,0.7)', borderRadius: 18, boxShadow: '0 4px 32px #0003', padding: '32px 18px' }}>
                                    <div style={{ width: '100%' }}>
                                        {/* Titre supprimé car déjà affiché dans ArticleForm */}
                                        {successEdit && (
                                            <div style={{ color: '#4BB543', background: '#fffbe6', border: '1.5px solid #FFD9A0', borderRadius: 8, padding: '10px 18px', margin: '0 auto 18px auto', textAlign: 'center', maxWidth: 400, fontWeight: 600, fontSize: 16 }}>
                                                {successEdit}
                                            </div>
                                        )}
                                        {editArticle ? (
                                            <div style={{
                                                width: '100%',
                                                margin: '0 auto',
                                                background: 'rgba(44, 34, 23, 0.85)',
                                                border: '2px solid #FFD9A0',
                                                borderRadius: 16,
                                                boxShadow: '0 2px 16px #0002',
                                                padding: '32px 28px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                maxWidth: 700
                                            }}>
                                                <ArticleForm
                                                    mode="edit"
                                                    article={editArticle}
                                                    onSuccess={async () => {
                                                        setEditArticle(null);
                                                        await fetchArticles();
                                                        setSuccessEdit("Votre article a été modifié avec succès.");
                                                        setTimeout(() => setSuccessEdit(""), 3000);
                                                    }}
                                                    onCancel={() => setEditArticle(null)}
                                                />
                                            </div>
                                        ) : null}
                                        {!editArticle && (
                                            loadingArticles ? (
                                                <div style={{ color: '#FFD9A0', textAlign: 'center' }}>Chargement...</div>
                                            ) : errorArticles ? (
                                                <div style={{ color: 'red', textAlign: 'center' }}>{errorArticles}</div>
                                            ) : (
                                                <>
                                                    <div style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                                                        gap: 24,
                                                        width: '100%',
                                                        paddingBottom: 8,
                                                        justifyItems: 'center',
                                                        alignItems: 'stretch',
                                                    }}>
                                                        {articles.length === 0 && <div style={{ color: '#FFD9A0', textAlign: 'center' }}>Aucun article.</div>}
                                                        {articles
                                                            .slice((editPage - 1) * ARTICLES_PER_PAGE, editPage * ARTICLES_PER_PAGE)
                                                            .map(article => (
                                                                <div
                                                                    key={article.id}
                                                                    style={{
                                                                        background: 'rgba(44,34,23,0.93)',
                                                                        border: '2px solid #FFD9A0',
                                                                        borderRadius: 16,
                                                                        boxShadow: '0 4px 18px #0003',
                                                                        padding: 18,
                                                                        display: 'flex',
                                                                        flexDirection: 'column',
                                                                        alignItems: 'center',
                                                                        width: '100%',
                                                                        minWidth: 0,
                                                                        maxWidth: 320,
                                                                        minHeight: 320,
                                                                        position: 'relative',
                                                                        transition: 'transform 0.15s, box-shadow 0.15s',
                                                                        cursor: 'pointer',
                                                                    }}
                                                                    onMouseOver={e => {
                                                                        e.currentTarget.style.transform = 'translateY(-4px) scale(1.025)';
                                                                        e.currentTarget.style.boxShadow = '0 8px 32px #0005';
                                                                    }}
                                                                    onMouseOut={e => {
                                                                        e.currentTarget.style.transform = '';
                                                                        e.currentTarget.style.boxShadow = '0 4px 18px #0003';
                                                                    }}
                                                                >
                                                                    {article.image && (
                                                                        <img src={article.image} alt={article.titre} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 14, border: '1.5px solid #FFD9A0', background: '#1a1816' }} />
                                                                    )}
                                                                    <strong style={{ fontSize: 18, color: '#FFD9A0', marginBottom: 6, textAlign: 'center', lineHeight: 1.2 }}>{article.titre}</strong>
                                                                    {article.description && (
                                                                        <div style={{ fontSize: 13, color: '#bfae8f', marginBottom: 8, textAlign: 'center', fontStyle: 'italic', lineHeight: 1.3 }}>
                                                                            {article.description.length > 30
                                                                                ? article.description.slice(0, 30) + '...'
                                                                                : article.description}
                                                                        </div>
                                                                    )}
                                                                    {article.auteur && (
                                                                        <div style={{ fontSize: 14, color: '#bfae8f', fontStyle: 'italic', marginBottom: 2, textAlign: 'center' }}>par {article.auteur}</div>
                                                                    )}
                                                                    <div style={{ fontSize: 13, color: '#FFD9A0', marginBottom: 12, textAlign: 'center', opacity: 0.8 }}>{article.slug}</div>
                                                                    <div style={{
                                                                        fontSize: 12,
                                                                        marginBottom: 12,
                                                                        textAlign: 'center',
                                                                        color: article.statut === 'publié' ? '#4BB543' : '#FFA500',
                                                                        fontWeight: 'bold'
                                                                    }}>
                                                                        {article.statut === 'publié' ? '✅ Publié' : '📝 Brouillon'}
                                                                    </div>
                                                                    <button style={{
                                                                        background: '#FFD9A0',
                                                                        color: '#2C2520',
                                                                        border: 'none',
                                                                        borderRadius: 7,
                                                                        padding: '8px 18px',
                                                                        fontWeight: 600,
                                                                        cursor: 'pointer',
                                                                        fontSize: 15,
                                                                        marginTop: 'auto',
                                                                        alignSelf: 'center',
                                                                        boxShadow: '0 2px 8px #0002',
                                                                        transition: 'background 0.15s, color 0.15s',
                                                                    }} onClick={() => handleEdit(article)}>
                                                                        Modifier
                                                                    </button>
                                                                </div>
                                                            ))}
                                                    </div>
                                                    {/* Pagination controls */}
                                                    {articles.length > ARTICLES_PER_PAGE && (
                                                        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 24 }}>
                                                            <button
                                                                onClick={() => setEditPage(p => Math.max(1, p - 1))}
                                                                disabled={editPage === 1}
                                                                style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: '#FFD9A0', color: '#2C2520', fontWeight: 600, cursor: editPage === 1 ? 'not-allowed' : 'pointer', opacity: editPage === 1 ? 0.5 : 1 }}
                                                            >Précédent</button>
                                                            <span style={{ color: '#FFD9A0', fontWeight: 600, fontSize: 16 }}>Page {editPage} / {Math.ceil(articles.length / ARTICLES_PER_PAGE)}</span>
                                                            <button
                                                                onClick={() => setEditPage(p => Math.min(Math.ceil(articles.length / ARTICLES_PER_PAGE), p + 1))}
                                                                disabled={editPage === Math.ceil(articles.length / ARTICLES_PER_PAGE)}
                                                                style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: '#FFD9A0', color: '#2C2520', fontWeight: 600, cursor: editPage === Math.ceil(articles.length / ARTICLES_PER_PAGE) ? 'not-allowed' : 'pointer', opacity: editPage === Math.ceil(articles.length / ARTICLES_PER_PAGE) ? 0.5 : 1 }}
                                                            >Suivant</button>
                                                        </div>
                                                    )}
                                                </>
                                            )
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                        {articleTab === 'delete' && (
                            <>
                                <div style={{
                                    width: '100%',
                                    borderBottom: '1.5px solid var(--decorative-line-color)',
                                    margin: '18px 0 36px 0',
                                }} />
                                <div style={{ width: '100%', maxWidth: 900, minHeight: '60vh', margin: '0 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: 'rgba(44,34,23,0.7)', borderRadius: 18, boxShadow: '0 4px 32px #0003', padding: '32px 18px' }}>
                                    <div style={{ width: '100%' }}>
                                        <h2 style={{ fontSize: '1.3rem', marginBottom: 18, color: '#FFD9A0', textAlign: 'center', letterSpacing: 0.5 }}>Supprimer un article</h2>
                                        {successDelete && (
                                            <div style={{ color: '#4BB543', background: '#fffbe6', border: '1.5px solid #FFD9A0', borderRadius: 8, padding: '10px 18px', margin: '0 auto 18px auto', textAlign: 'center', maxWidth: 400, fontWeight: 600, fontSize: 16 }}>
                                                {successDelete}
                                            </div>
                                        )}
                                        {/* Confirmation inline suppression */}
                                        {loadingArticles ? (
                                            <div style={{ color: '#FFD9A0', textAlign: 'center' }}>Chargement...</div>
                                        ) : errorArticles ? (
                                            <div style={{ color: 'red', textAlign: 'center' }}>{errorArticles}</div>
                                        ) : (
                                            <>
                                                <div style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                                                    gap: 24,
                                                    width: '100%',
                                                    paddingBottom: 8,
                                                    justifyItems: 'center',
                                                    alignItems: 'stretch',
                                                }}>
                                                    {articles.length === 0 && <div style={{ color: '#FFD9A0', textAlign: 'center' }}>Aucun article.</div>}
                                                    {articles
                                                        .slice((deletePage - 1) * ARTICLES_PER_PAGE, deletePage * ARTICLES_PER_PAGE)
                                                        .map(article => (
                                                            <div key={article.id} style={{
                                                                background: 'rgba(44,34,23,0.93)',
                                                                border: '2px solid #FFD9A0',
                                                                borderRadius: 16,
                                                                boxShadow: '0 4px 18px #0003',
                                                                padding: 18,
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'center',
                                                                width: '100%',
                                                                minWidth: 0,
                                                                maxWidth: 320,
                                                                minHeight: 320,
                                                                position: 'relative',
                                                                transition: 'transform 0.15s, box-shadow 0.15s',
                                                                cursor: 'pointer',
                                                                marginBottom: 24,
                                                            }}
                                                                onMouseOver={e => {
                                                                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.025)';
                                                                    e.currentTarget.style.boxShadow = '0 8px 32px #0005';
                                                                }}
                                                                onMouseOut={e => {
                                                                    e.currentTarget.style.transform = '';
                                                                    e.currentTarget.style.boxShadow = '0 4px 18px #0003';
                                                                }}
                                                            >
                                                                {article.image && (
                                                                    <img src={article.image} alt={article.titre} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 14, border: '1.5px solid #FFD9A0', background: '#1a1816' }} />
                                                                )}
                                                                <strong style={{ fontSize: 18, color: '#FFD9A0', marginBottom: 6, textAlign: 'center', lineHeight: 1.2 }}>{article.titre}</strong>
                                                                {article.description && (
                                                                    <div style={{ fontSize: 13, color: '#bfae8f', marginBottom: 8, textAlign: 'center', fontStyle: 'italic', lineHeight: 1.3 }}>
                                                                        {article.description.length > 30
                                                                            ? article.description.slice(0, 30) + '...'
                                                                            : article.description}
                                                                    </div>
                                                                )}
                                                                {article.auteur && (
                                                                    <div style={{ fontSize: 14, color: '#bfae8f', fontStyle: 'italic', marginBottom: 2, textAlign: 'center' }}>par {article.auteur}</div>
                                                                )}
                                                                <div style={{ fontSize: 13, color: '#FFD9A0', marginBottom: 12, textAlign: 'center', opacity: 0.8 }}>{article.slug}</div>
                                                                <div style={{
                                                                    fontSize: 12,
                                                                    marginBottom: 12,
                                                                    textAlign: 'center',
                                                                    color: article.statut === 'publié' ? '#4BB543' : '#FFA500',
                                                                    fontWeight: 'bold'
                                                                }}>
                                                                    {article.statut === 'publié' ? '✅ Publié' : '📝 Brouillon'}
                                                                </div>
                                                                <button style={{
                                                                    background: '#F76C5E',
                                                                    color: '#fff',
                                                                    border: 'none',
                                                                    borderRadius: 7,
                                                                    padding: '8px 18px',
                                                                    fontWeight: 600,
                                                                    cursor: 'pointer',
                                                                    fontSize: 15,
                                                                    marginTop: 'auto',
                                                                    alignSelf: 'center',
                                                                    boxShadow: '0 2px 8px #0002',
                                                                    transition: 'background 0.15s, color 0.15s',
                                                                }} onClick={() => setDeleteArticle(article)}>
                                                                    Supprimer
                                                                </button>
                                                            </div>
                                                        ))}
                                                    {/* Modale de confirmation suppression */}
                                                    <DeleteArticleModal
                                                        isOpen={!!deleteArticle}
                                                        article={deleteArticle}
                                                        onClose={() => setDeleteArticle(null)}
                                                        onConfirm={async () => {
                                                            await handleDelete(deleteArticle.id);
                                                            setDeleteArticle(null);
                                                        }}
                                                    />
                                                </div>
                                                {/* Pagination controls */}
                                                {articles.length > ARTICLES_PER_PAGE && (
                                                    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 24 }}>
                                                        <button
                                                            onClick={() => setDeletePage(p => Math.max(1, p - 1))}
                                                            disabled={deletePage === 1}
                                                            style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: '#FFD9A0', color: '#2C2520', fontWeight: 600, cursor: deletePage === 1 ? 'not-allowed' : 'pointer', opacity: deletePage === 1 ? 0.5 : 1 }}
                                                        >Précédent</button>
                                                        <span style={{ color: '#FFD9A0', fontWeight: 600, fontSize: 16 }}>Page {deletePage} / {Math.ceil(articles.length / ARTICLES_PER_PAGE)}</span>
                                                        <button
                                                            onClick={() => setDeletePage(p => Math.min(Math.ceil(articles.length / ARTICLES_PER_PAGE), p + 1))}
                                                            disabled={deletePage === Math.ceil(articles.length / ARTICLES_PER_PAGE)}
                                                            style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: '#FFD9A0', color: '#2C2520', fontWeight: 600, cursor: deletePage === Math.ceil(articles.length / ARTICLES_PER_PAGE) ? 'not-allowed' : 'pointer', opacity: deletePage === Math.ceil(articles.length / ARTICLES_PER_PAGE) ? 0.5 : 1 }}
                                                        >Suivant</button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ) : selectedSection === "users" ? (
                    <UsersAdmin />
                ) : selectedSection === "newsletter" ? (
                    <NewsletterAdmin />
                ) : (
                    <>
                        <h1 className={styles["dashboard-main-h1"]}>
                            Votre espace admin,  {admin.firstName ? admin.firstName : admin.email} !
                        </h1>
                        <div className={styles["dashboard-main-info"]}>
                            <span>Vous avez accès à toutes les fonctionnalités de gestion du contenu.</span>
                            <span>Pensez à sauvegarder vos modifications régulièrement.</span>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div>Chargement du dashboard admin...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
