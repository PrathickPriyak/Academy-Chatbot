import { AudienceGrid } from "@/components/marketing/audience-grid";
import { CategoryGrid } from "@/components/marketing/category-grid";
import { FinalCta } from "@/components/marketing/final-cta";
import { FounderBlock } from "@/components/marketing/founder-block";
import { HomeHero } from "@/components/marketing/home-hero";
import { PopularCourses } from "@/components/marketing/popular-courses";
import { StatsBand } from "@/components/marketing/stats-band";
import { Testimonials } from "@/components/marketing/testimonials";
import { WhyInfozub } from "@/components/marketing/why-infozub";
import { site } from "@/data/site";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <StatsBand />
      <PopularCourses />
      <CategoryGrid />
      <WhyInfozub />
      <AudienceGrid />
      <FounderBlock />
      <Testimonials />
      <FinalCta />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: site.name,
            url: site.url,
            email: site.email,
            telephone: site.phone,
            description: site.description,
          }),
        }}
      />
    </>
  );
}
