import { Helmet } from "react-helmet-async";
import { SITE } from "@/lib/constants";
import type { SEOProps } from "@/types";

export function SEO({
  title,
  description,
  image,
  url,
  type = "website",
}: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE.shortName}` : SITE.name;
  const metaDescription = description || SITE.tagline;
  const siteUrl = import.meta.env.VITE_SITE_URL || "https://sltech.vn";
  const canonicalUrl = url ? `${siteUrl}${url}` : siteUrl;
  const ogImage = image || `${siteUrl}/og-image.jpg`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE.shortName} />
      <meta property="og:locale" content="vi_VN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE.name,
          url: siteUrl,
          logo: `${siteUrl}/logo.png`,
          contactPoint: {
            "@type": "ContactPoint",
            telephone: SITE.phone,
            contactType: "customer service",
            availableLanguage: "Vietnamese",
          },
          address: {
            "@type": "PostalAddress",
            streetAddress: SITE.address,
            addressLocality: "TP. Hồ Chí Minh",
            addressCountry: "VN",
          },
        })}
      </script>
    </Helmet>
  );
}
