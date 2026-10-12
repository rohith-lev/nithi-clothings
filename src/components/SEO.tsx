import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
  structuredData?: object | object[];
}

const DEFAULT_TITLE = "Nithi Clothings | Pure Cotton Nighties, Feeding Nighties & Ethnic Wear";
const DEFAULT_DESCRIPTION =
  "Shop pure breathable cotton nighties, zip feeding nighties, maternity nightwear, collar & frock models at Nithi Clothings. Handcrafted for supreme comfort with fast all-India delivery.";
const DEFAULT_KEYWORDS =
  "pure cotton nighties, feeding nighties, zip nighty, collar nighty, titanic model nighty, cotton night dress, feeding kurtis, south indian cotton nighty, maternity nightwear, buy nighties online, Nithi Clothings";
const SITE_URL = typeof window !== "undefined" ? window.location.origin : "https://nithiclothings.com";
const DEFAULT_OG_IMAGE = "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=1200&h=630&fit=crop&q=85";

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  structuredData,
}: SEOProps) {
  const fullTitle = title ? `${title} | Nithi Clothings` : DEFAULT_TITLE;
  const currentUrl = canonical
    ? `${SITE_URL}${canonical.startsWith("/") ? canonical : `/${canonical}`}`
    : typeof window !== "undefined"
    ? window.location.href
    : SITE_URL;

  useEffect(() => {
    // 1. Update Title
    document.title = fullTitle;

    // Helper to update or create meta tags
    const setMetaTag = (attrName: string, attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // 2. Standard Meta
    setMetaTag("name", "description", description);
    setMetaTag("name", "keywords", keywords);
    setMetaTag("name", "author", "Nithi Clothings");
    setMetaTag("name", "robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");

    // 3. OpenGraph
    setMetaTag("property", "og:title", fullTitle);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:url", currentUrl);
    setMetaTag("property", "og:type", ogType);
    setMetaTag("property", "og:image", ogImage);
    setMetaTag("property", "og:site_name", "Nithi Clothings");
    setMetaTag("property", "og:locale", "en_IN");

    // 4. Twitter Card
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", fullTitle);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", ogImage);

    // 5. Canonical Link
    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.setAttribute("rel", "canonical");
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute("href", currentUrl);

    // 6. Structured Data / JSON-LD
    const scriptId = "dynamic-json-ld";
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement;
    if (structuredData) {
      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.id = scriptId;
        scriptTag.type = "application/ld+json";
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(structuredData);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [fullTitle, description, keywords, currentUrl, ogImage, ogType, structuredData]);

  return null;
}
