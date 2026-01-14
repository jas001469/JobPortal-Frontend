import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import JobsSection from "@/components/JobSection"; // Add this import

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <JobsSection /> {/* Add this line */}
    </>
  );
}