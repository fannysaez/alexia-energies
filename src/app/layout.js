import "./globals.css";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";

export const metadataOpenGraph = {
  title: "AstroNex - Bien-être, relaxation et accompagnement personnalisé",
  description: "Située à Lens, je vous propose des séances de magnétisme, sophrologie et de human design pour vous accompagner vers un mieux-être global.",
  openGraph: {
    title: "AstroNex - Bien-être, relaxation et accompagnement personnalisé",
    description: "Située à Lens, je vous propose des séances de magnétisme, sophrologie et de human design pour vous accompagner vers un mieux-être global.",
    type: "website",
    images: [
      {
        url: "https://alexia-energies.vercel.app/openGraph/OpenGraph.png",
        width: 1200,
        height: 630,
        alt: "AstroNex - Bien-être, relaxation et accompagnement personnalisé",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body suppressHydrationWarning style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}