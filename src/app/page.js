import AppShowcase from "@/components/LandingPage/Appshowcase/page";
import Footer from "@/components/LandingPage/Footer/page";
import Header from "@/components/LandingPage/Header/page"
import HeroSection from "@/components/LandingPage/HeroSection/page";
import OffersSlider from "@/components/LandingPage/OfferSlider/page";
import ServicesSection from "@/components/LandingPage/services/page";
import Standout from "@/components/LandingPage/Standout/page";

const LandingPage=()=>{
  return(
    <>
      <Header/>
      <HeroSection/>
      <OffersSlider/>
      <ServicesSection/>
      <Standout/>
      <AppShowcase/>
      <Footer/>
    </>
  )
}

export default LandingPage;