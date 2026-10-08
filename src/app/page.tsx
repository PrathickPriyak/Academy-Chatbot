import type { Metadata } from "next";

import { AudienceGrid } from "@/components/marketing/audience-grid";
import { CategoryGrid } from "@/components/marketing/category-grid";
import { FeaturedLearning } from "@/components/marketing/featured-learning";
import { FinalCta } from "@/components/marketing/final-cta";
import { HomeHero } from "@/components/marketing/home-hero";
import { InstructorSpotlight } from "@/components/marketing/instructor-spotlight";
import { PopularCourses } from "@/components/marketing/popular-courses";
import { StatsBand } from "@/components/marketing/stats-band";
import { Testimonials } from "@/components/marketing/testimonials";
import { WhyInfozub } from "@/components/marketing/why-infozub";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: { absolute: `${site.name} · ${site.tagline}` },
  description: site.description,
  openGraph: {
    title: `${site.name} · ${site.tagline}`,
    description: site.description,
    url: site.url,
  },
};

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <StatsBand />
      <PopularCourses />
      <CategoryGrid />
      <WhyInfozub />
      <FeaturedLearning />
      <AudienceGrid />
      <InstructorSpotlight />
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
            slogan: site.tagline,
          }),
        }}
      />
    </>
  );
}
