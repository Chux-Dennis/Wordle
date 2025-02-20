import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
const Onboarding = () => {
  return (
    <>
      <div className="relative h-screen   ">
        <Navigation />
        <Hero />
        <div className="absolute h-full inset-0 -z-10  w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#4978ce_100%)]"></div>
      </div>
    </>
  );
};

export default Onboarding;
