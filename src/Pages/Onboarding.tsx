import Navigation from "../components/Navigation";
import { Theme } from "@radix-ui/themes";
import Hero from "../components/Hero";
import Image from "../assets/image/pixel.png";
const pixelLink = import.meta.env.VITE_PIXEL_LINK;
const Onboarding = () => {
  return (
    <>
      <Theme
        grayColor="sand"
        // radius="large"
        scaling="95%"
      >
        <div className="relative h-screen   ">
          <Navigation />
          <Hero />

          <div className="absolute bottom-5 right-5">
            <a href={pixelLink} target="_blank">
              <img src={Image} alt="" width="60px" />
              
            </a>
          </div>

          {/* <OnboardingFooter/> */}

          <div className="absolute h-full inset-0 -z-10  w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#4978ce_100%)]"></div>
        </div>
      </Theme>
    </>
  );
};

export default Onboarding;
