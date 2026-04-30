export function Schema() {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Code Tunnel",
    "url": "https://codetunnel.co.in",
    "logo": "https://codetunnel.co.in/logo.png",
    "description": "Custom web development agency in Kolkata, India",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kolkata",
      "addressRegion": "West Bengal",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "22.5726",
      "longitude": "88.3639"
    },
    "telephone": "+91-XXXXXXXXXX",
    "priceRange": "₹₹",
    "openingHours": "Mo-Fr 09:00-18:00",
    "sameAs": [
      "https://www.linkedin.com/company/codetunnel",
      "https://twitter.com/codetunnel",
      "https://www.instagram.com/codetunnel"
    ]
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Code Tunnel",
    "url": "https://codetunnel.co.in",
    "logo": "https://codetunnel.co.in/logo.png",
    "foundingDate": "2024",
    "founders": [{ "@type": "Person", "name": "Founder Name" }],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "hello@codetunnel.co.in"
    }
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Code Tunnel",
    "url": "https://codetunnel.co.in",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://codetunnel.co.in/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
