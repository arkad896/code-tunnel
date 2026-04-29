import type { Metadata } from "next";
import SubNavbar from "@/components/SubNavbar";
import SubFooter from "@/components/SubFooter";
import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = {
  title: "Web Development Blog — Code Tunnel Kolkata",
  description: "Insights on web development, React, Next.js, SEO, and digital strategy from the Code Tunnel team in Kolkata.",
  alternates: {
    canonical: "https://codetunnel.co.in/blog",
  },
};

export default function BlogPage() {
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Code Tunnel Web Development Blog",
    "description": "Expert digital insights on web design, Next.js tech scaling, and search presence from Code Tunnel Kolkata.",
    "publisher": {
      "@type": "ProfessionalService",
      "name": "Code Tunnel"
    }
  };

  const posts = [
    {
      title: "Why Your Kolkata Business Needs a Custom Website in 2026",
      excerpt: "A template website might look decent, but it won't rank, won't convert, and won't represent your brand the way a custom-built site will. Here's why Kolkata businesses are switching.",
      keyword: "custom website Kolkata",
    },
    {
      title: "React vs WordPress: Which is Right for Your Business?",
      excerpt: "WordPress powers 40% of the internet, but React is taking over for performance-critical sites. We break down which one suits your business and budget.",
      keyword: "React vs WordPress India",
    },
    {
      title: "5 SEO Mistakes Small Business Websites Make (And How to Fix Them)",
      excerpt: "Most small business websites are invisible to Google — not because of bad luck, but because of five fixable mistakes. Here's what they are and how to solve them.",
      keyword: "SEO mistakes small business website",
    }
  ];

  return (
    <>
      <SubNavbar />
      <BlogPageClient blogSchema={blogSchema} posts={posts} />
      <SubFooter />
    </>
  );
}
