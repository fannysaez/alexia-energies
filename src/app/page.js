export const metadata = {
  title: "Accueil | Alexia Énergies",
  description: "Découvrez Alexia Énergies : accompagnement au mieux-être, magnétisme, sophrologie, human design, conseils et articles pour votre épanouissement personnel.",
  keywords: [
    "Alexia Énergies",
    "bien-être",
    "magnétisme",
    "sophrologie",
    "human design",
    "développement personnel",
    "accompagnement",
    "articles",
    "énergie",
    "consultation"
  ],
};

import Image from "next/image";
import HeroSection from "@/app/components/accueil/hero/section1"; // Import du composant HeroSection
import About from "@/app/components/accueil/about/section2";
import Marque from "@/app/components/marque/marque";
import Process from "@/app/components/accueil/process/section3"; // Import du composant Process
import Testimonials from "@/app/components/testimonials/testimonials";
import MesArticles from "@/app/components/accueil/mesArticles/mesArticles"; // Import du composant MesArticles

export default function Home() {
  return (
    <>
      <HeroSection />
      <About />
      <Process />
      <Marque />
      <Testimonials />
      <MesArticles />
    </>
  );
}
