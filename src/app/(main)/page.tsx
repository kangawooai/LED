import Cta from "@/sections/cta";
import Features from "@/sections/features";
import Hero from "@/sections/hero";
import Process from "@/sections/industries";
import Reviews from "@/sections/reviews";
import Stats from "@/sections/stats";

const HomePage = () => {
  return (
    <div>
      <Hero />
      <Stats />
      <Features />
      <Process />
      <Reviews />
      <Cta />
    </div>
  );
};

export default HomePage;
