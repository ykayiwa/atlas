import { Navbar } from "@/components/shared/Navbar";
import { Hero } from "@/components/landing/Hero";
import { TopicsGrid } from "@/components/landing/TopicsGrid";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { DemoSection } from "@/components/landing/DemoSection";
import { DataSources } from "@/components/landing/DataSources";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/shared/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <TopicsGrid />
      <HowItWorks />
      <DemoSection />
      <DataSources />
      <CTASection />
      <Footer />
    </div>
  );
}
