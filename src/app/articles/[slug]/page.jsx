"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "./article.module.css";
import Button from "../../components/button/button";
import StarBlack from "/public/img/boutons/VectorStarBlack.svg";

export default function ArticlePage() {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!slug) return;
        const fetchArticle = async () => {
            try {
                console.log('Tentative de chargement de l\'article avec slug:', slug);
                const url = `/api/articles/${slug}`;
                console.log('URL appelée:', url);

                const res = await fetch(url);
                console.log('Statut de la réponse:', res.status);

                if (res.ok) {
                    const data = await res.json();
                    console.log('Article chargé avec succès:', data);
                    setArticle(data);
                    setError(null);
                } else if (res.status === 404) {
                    const errorData = await res.json().catch(() => ({}));
                    // console.error("Article non trouvé:", errorData);
                    setError("Cet article n'existe pas ou n'est pas publié");
                    setArticle(null);
                } else {
                    const errorData = await res.json().catch(() => ({}));
                    console.error("Erreur HTTP:", res.status, errorData);
                    setError(`Erreur de chargement (${res.status})`);
                    setArticle(null);
                }
            } catch (error) {
                console.error("Erreur lors du chargement de l'article :", error);
                setError("Cet article n'est pas disponible, en cours de construction");
                setArticle(null);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [slug]);

    if (loading) return <div className={styles.loadingContainer}><p>Chargement...</p></div>;
    if (error || !article) return (
        <div className={styles.noArticles}>
            <p style={{ textAlign: 'center', width: '100%' }}>{error || "Article introuvable."}</p>
            <div className={styles.errorActions}>
                <Button
                    text="Retour aux articles"
                    link="/articles"
                    variant="secondary"
                    leftVector={<Image src={StarBlack} alt="" width={16} height={16} />}
                    rightVector={<Image src={StarBlack} alt="" width={16} height={16} />}
                />
            </div>
        </div>
    );

    // Debug : afficher les paragraphes reçus
    if (article && Array.isArray(article.paragraphs)) {
        console.log('Paragraphes reçus:', article.paragraphs);
    }

    return (
        <div className={styles.container}>
            {/* Section Hero */}
            <section
                className={styles.heroSection}
                style={{
                    backgroundImage: article.imageCouverture
                        ? `url(${article.imageCouverture})`
                        : undefined,
                }}
            >
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>{article.titre}</h1>
                    <nav className={styles.heroBreadcrumb}>
                        <Link href="/">Accueil</Link>
                        <span>›</span>
                        <Link href="/articles">Articles</Link>
                        <span>›</span>
                        <span>{article.titre}</span>
                    </nav>
                </div>
            </section>

            {/* Section Infos auteur/date */}
            <section className={styles.metaSection}>
                <div className={styles.metaFlex}>
                    {article.datePublication && (
                        <span className={styles.articleDate}>
                            {new Date(article.datePublication).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </span>
                    )}

                    {article.category && (
                        <div className={styles.articleCategory}>
                            <span>Catégorie :</span>
                            <span>{article.category.name}</span>
                        </div>
                    )}

                </div>
            </section>

            <div className={styles.metaSeparator} />

            {/* Section Image principale */}
            {article.image && (
                <section className={styles.imageSection}>
                    <div className={styles.articleImageContainer}>
                        <Image
                            src={article.image}
                            alt={article.titre}
                            width={1200}
                            height={400}
                            className={styles.articleImage}
                            priority
                        />
                    </div>
                </section>
            )}

            {/* Section contenu principal */}
            <section className={styles.contentSection}>
                <div className={styles.articleContent}>
                    <div dangerouslySetInnerHTML={{ __html: article.contenu }} />
                </div>
            </section>

            {/* Section blocs de contenu */}
            {Array.isArray(article.contentBlocks) && article.contentBlocks.length > 0 && (
                <section className={styles.blocksSection}>
                    <div className={styles.blocksWrapper}>
                        {article.contentBlocks
                            .sort((a, b) => a.order - b.order)
                            .map((block) => (
                                <div key={block.id} className={styles.blockItem}>
                                    {block.type === "LISTE" && block.textContent && (
                                        <ul className={styles.blockList}>
                                            {block.textContent.split('\n').map((item, i) => (
                                                <li key={i} className={styles.blockListItem}>{item}</li>
                                            ))}
                                        </ul>
                                    )}
                                    {block.type === "CITATION" && block.textContent && (
                                        block.textContent.split('\n').map((line, i) => (
                                            <blockquote key={i} className={styles.blockCitation}><em>{line}</em></blockquote>
                                        ))
                                    )}
                                    {block.type === "IMAGE" && block.mediaUrl && (
                                        <Image
                                            src={block.mediaUrl}
                                            alt={block.altText || "Image du contenu"}
                                            width={600}
                                            height={300}
                                            className={styles.blockImage}
                                        />
                                    )}
                                    {block.type === "TEXT" && block.textContent && (
                                        <div
                                            style={{ color: "var(--paragraph-color)", textShadow: "1px 1px 6px rgba(0,0,0,0.7)" }}
                                            dangerouslySetInnerHTML={{ __html: block.textContent }}
                                        />
                                    )}
                                    {block.type === "TITRE" && block.textContent && (
                                        React.createElement(
                                            block.titleLevel || 'h3',
                                            {
                                                className: block.titleLevel
                                                    ? styles[`blockTitle${block.titleLevel.toUpperCase()}`]
                                                    : styles.blockTitle
                                            },
                                            block.textContent
                                        )
                                    )}
                                    {block.type === "VIDEO" && block.mediaUrl && (
                                        <div className={styles.videoBlock}>
                                            <iframe src={block.mediaUrl} title="Vidéo" className={styles.contentBlockVideo} allowFullScreen />
                                            {/* Optionnel : lien vers la vidéo */}
                                            <a href={block.mediaUrl} target="_blank" rel="noopener noreferrer">Voir sur YouTube/Vimeo</a>
                                        </div>
                                    )}
                                    {block.type === "AUDIO" && block.mediaUrl && (
                                        <audio controls className={styles.blockAudio}>
                                            <source src={block.mediaUrl} type="audio/mpeg" />
                                            Votre navigateur ne supporte pas la lecture audio.
                                        </audio>
                                    )}
                                    {block.type === "CODE" && block.textContent && (
                                        <pre className={styles.blockCode}>
                                            <code>{block.textContent}</code>
                                        </pre>
                                    )}
                                    {/* Bloc PARAGRAPHE : affichage comme un bloc de texte stylé */}
                                    {(block.type === "PARAGRAPHE" || block.type === "PARAGRAPHES") && block.textContent && (
                                        <div className={styles.blockParagraph}>
                                            <div
                                                style={{ color: "var(--paragraph-color)", fontStyle: "justify", margin: "18px 0" }}
                                                dangerouslySetInnerHTML={{ __html: block.textContent }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                </section>
            )}

            {/* Section paragraphes */}
            {Array.isArray(article.paragraphs) && article.paragraphs.length > 0 && (
                <section className={styles.paragraphsSection}>
                    {/* <h1 className={styles.sectionTitle}>{article.titre}</h1> */}
                    <div className={styles.paragraphsWrapper}>
                        {article.paragraphs
                            .sort((a, b) => a.ordre - b.ordre)
                            .map((para) => (
                                <div key={para.id} className={styles.paragraphItem}>
                                    {para.titre && (
                                        <h4 className={styles.paragraphTitle}>{para.titre}</h4>
                                    )}
                                    {para.texte && (
                                        <div
                                            className={styles.paragraphText}
                                            dangerouslySetInnerHTML={{ __html: para.texte }}
                                        />
                                    )}
                                    <div className={styles.paragraphImagesRow}>
                                        {para.image_url && (
                                            <img
                                                src={para.image_url}
                                                alt={para.alt_text || `Image du paragraphe ${para.ordre}`}
                                            />
                                        )}
                                        {para.image_url2 && (
                                            <img
                                                src={para.image_url2}
                                                alt={para.alt_text || `Image 2 du paragraphe ${para.ordre}`}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                </section>
            )}

            <div className={styles.metaSeparator2} />

            {/* Section Infos auteur/date */}
            <section className={styles.metaSection}>
                <div className={styles.metaFlex}>
                    {article.dateCreation && (
                        <span className={styles.articleDate}>
                            {new Date(article.dateCreation).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </span>
                    )}

                    <span className={styles.articleAuthor}>Par {article.auteur}</span>
                </div>
            </section>



            {/* Bouton Retour */}
            <div style={{ display: "flex", justifyContent: "center", margin: "40px 0" }}>
                <div style={{ width: "auto" }}>
                    <Button
                        text="Retour"
                        link="/articles"
                        variant="secondary"
                        leftVector={<Image src={StarBlack} alt="" width={16} height={16} />}
                        rightVector={<Image src={StarBlack} alt="" width={16} height={16} />}
                        style={{ whiteSpace: 'nowrap' }}
                    />
                </div>
            </div>




        </div>
    );
}
