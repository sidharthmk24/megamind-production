import Footer from "@/components/home/footer";
import Header from "@/components/home/header";
import WallOfFame from "@/components/home/wall-of-fame";
import OurTeam from "@/components/about/OurTeam";
import CommonHero from "@/components/ui/CommonHero";
import ImageCarousel from "@/components/about/ImageCarousel";
import CreativeNetworkSwiper from "@/components/about/CreativeNetworkSwiper";
import FooterVideo from "@/components/home/FooterVideo";


export default function Page() {
    return (
    <>
    <section>
        <Header />
        <CommonHero title= "ABOUT US" />
        <OurTeam />
        <ImageCarousel/>
        <CreativeNetworkSwiper/>
        <WallOfFame/>
        <Footer/>
        <FooterVideo/>
    </section> 
    </>    
    
    )
}