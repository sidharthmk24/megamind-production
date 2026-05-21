import Footer from "@/components/home/footer";
import Header from "@/components/home/header";
import GridOverlay from "@/components/home/grid-overlay";
import NotesHero from "@/components/ProductionNote/NotesHero";
import Notes from "@/components/ProductionNote/Notes";
import FooterVideo from "@/components/home/FooterVideo";

export default function Page() {
  return (
    <>
      <Header />
      <GridOverlay />
      <NotesHero />
      <Notes />
     
      <Footer />
       <FooterVideo />
    </>
  );
}