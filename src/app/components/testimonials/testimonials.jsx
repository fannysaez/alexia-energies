'use client'; // Directive Next.js pour composant côté client

import { useCallback, useEffect, useState } from 'react'; // Hooks React pour état et effets
import useEmblaCarousel from 'embla-carousel-react'; // Hook pour carousel Embla
import Image from 'next/image'; // Composant Image optimisé de Next.js
import styles from './testimonials.module.css'; // Styles CSS modules
import fleche from "/public/img/accueil/HeroSection/VectorFlecheAccueil.svg"; // SVG décoratif
import VectorRightTopAttrapesreves from "/public/img/accueil/testimonials/VectorRightTop-Attrapes-reves.svg"; // Image décorative en haut à droite    
import VectorLeftBottomAttrapesreves from "/public/img/accueil/testimonials/VectorLeftBottom-Attrapes-reves.svg"; // Image décorative en bas à gauche 
// Données des témoignages statiques
const testimonialsData = [
    {
        id: 1,
        name: "Les Amis à Poils",
        type: "Entreprise",
        rating: 5,
        text: "Suspendisse elit eros, elementum quis massa sed, luctus pharetra risus. Morbi placerat fermentum mauris, eget egestas sem mollis ut. Proin vitae luctus at libero condimentum consectetur et anim.",
        avatar: "/img/accueil/testimonials/les-amis-a-poils.webp"
    },
    {
        id: 2,
        name: "Pierre A",
        type: "Particulier",
        rating: 5,
        text: "Suspendisse elit eros, elementum quis massa sed, luctus pharetra risus. Morbi placerat fermentum mauris, eget egestas sem mollis ut. Proin vitae luctus at libero condimentum consectetur et anim.",
        avatar: "/img/accueil/testimonials/PierreA.webp"
    },
    {
        id: 3,
        name: "François G.",
        type: "Particulier",
        rating: 5,
        text: "Suspendisse elit eros, elementum quis massa sed, luctus pharetra risus. Morbi placerat fermentum mauris, eget egestas sem mollis ut. Proin vitae luctus at libero condimentum consectetur et anim.",
        avatar: "/img/accueil/testimonials/FrançoisG.webp"
    },
    {
        id: 4,
        name: "Les Amis à Poils",
        type: "Entreprise",
        rating: 5,
        text: "Suspendisse elit eros, elementum quis massa sed, luctus pharetra risus. Morbi placerat fermentum mauris, eget egestas sem mollis ut. Proin vitae luctus at libero condimentum consectetur et anim.",
        avatar: "/img/accueil/testimonials/les-amis-a-poils.webp"
    },
    {
        id: 5,
        name: "Pierre A",
        type: "Particulier",
        rating: 5,
        text: "Suspendisse elit eros, elementum quis massa sed, luctus pharetra risus. Morbi placerat fermentum mauris, eget egestas sem mollis ut. Proin vitae luctus at libero condimentum consectetur et anim.",
        avatar: "/img/accueil/testimonials/PierreA.webp"
    },
    {
        id: 6,
        name: "François G.",
        type: "Particulier",
        rating: 5,
        text: "Suspendisse elit eros, elementum quis massa sed, luctus pharetra risus. Morbi placerat fermentum mauris, eget egestas sem mollis ut. Proin vitae luctus at libero condimentum consectetur et anim.",
        avatar: "/img/accueil/testimonials/FrançoisG.webp"
    },
];

const Testimonials = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        containScroll: 'trimSnaps',
        dragFree: false,
        loop: false,
        skipSnaps: false,
        slidesToScroll: 1,
        breakpoints: {
            '(min-width: 768px)': {
                slidesToScroll: 1
            },
            '(min-width: 1024px)': {
                slidesToScroll: 1
            }
        }
    });

    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

    const onSelect = useCallback((emblaApi) => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;

        onSelect(emblaApi);
        emblaApi.on('select', onSelect);

        return () => {
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi, onSelect]);

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <span
                key={index}
                className={`${styles.star} ${index < rating ? styles.starFilled : ''}`}
            >
                ★
            </span>
        ));
    };

    return (
        <section className={styles.testimonials}>
            <div className={styles.vectorRightTopAttrapesReves}>
                <Image
                    src={VectorRightTopAttrapesreves}
                    alt="Décoration en haut à droite"
                    sizes="(max-width: 480px) 100px, (max-width: 768px) 200px, 350px"
                    style={{
                        width: '100%',
                        height: 'auto',
                    }}
                />
            </div>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Témoignages</h2>
                </div>

                <div className={styles.embla} ref={emblaRef}>
                    <div className={styles.emblaContainer}>
                        {testimonialsData.map((testimonial) => (
                            <div className={styles.emblaSlide} key={testimonial.id}>
                                <div className={styles.testimonialCard}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.userInfo}>
                                            <div className={styles.avatar}>
                                                <Image
                                                    src={testimonial.avatar}
                                                    alt={testimonial.name}
                                                    width={60}
                                                    height={60}
                                                    className={styles.avatarImage}
                                                />
                                            </div>
                                            <div className={styles.userDetails}>
                                                <h3 className={styles.userName}>{testimonial.name}</h3>
                                                <p className={styles.userType}>{testimonial.type}</p>
                                            </div>
                                        </div>
                                        <div className={styles.quote}>
                                            <Image
                                                src="/img/accueil/testimonials/quote.svg"
                                                alt="Quote"
                                                width={80}
                                                height={80}
                                            />                                        </div>
                                    </div>

                                    <div className={styles.decorativeLine} style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Image src={fleche} alt="Fleche" width={290} />
                                    </div>

                                    <div className={styles.rating}>
                                        {renderStars(testimonial.rating)}
                                    </div>

                                    <p className={styles.testimonialText}>{testimonial.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.dots} style={{ display: 'flex', justifyContent: 'center' }}>
                    {testimonialsData.map((_, index) => (
                        <button
                            key={index}
                            className={`${styles.dot} ${index === selectedIndex ? styles.dotSelected : ''}`}
                            type="button"
                            onClick={() => scrollTo(index)}
                        />
                    ))}
                </div>
            </div>

            {/* Vecteur décoratif en bas à droite */}
            <div className={styles.vectorLeftBottomAttrapesReves}>
                <Image
                    src={VectorLeftBottomAttrapesreves}
                    alt="Décoration en bas à gauche"
                    sizes="(max-width: 480px) 100px, (max-width: 768px) 200px, 350px"
                    style={{
                        width: '100%',
                        height: 'auto',
                    }}
                />      
            </div>

        </section>
    );
};

export default Testimonials;