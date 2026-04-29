import React from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: Record<string, any>;
}

/**
 * In Next.js App Router, metadata (title, description, og, canonical) is handled 
 * via the exported `metadata` object in page.tsx or layout.tsx.
 * 
 * This SEO component is specifically used for injecting structured data (JSON-LD) 
 * inside the component tree if needed, maintaining compatibility with the requested interface.
 */
export default function SEO({ jsonLd }: SEOProps) {
  if (!jsonLd) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
