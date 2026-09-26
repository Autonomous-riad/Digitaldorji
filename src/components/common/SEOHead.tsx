import React, { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: object;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Digital Dorji - Bespoke Tailoring & Doorstep Fabric Service',
  description = 'বাংলাদেশের প্রথম ডিজিটাল দর্জি সেবা। হোম পিকআপ, লাইভ ট্র্যাকিং এবং নিখুঁত ফিটিং গ্যারান্টি।',
  canonicalUrl,
  ogImage = '/images/garments/panjabi-kurta.jpg',
  structuredData,
}) => {
  useEffect(() => {
    // Set document title
    document.title = title;

    const siteOrigin = typeof window !== 'undefined' 
      ? ((import.meta as any).env?.VITE_SITE_URL || window.location.origin) 
      : '';
    
    const effectiveCanonicalUrl = canonicalUrl || (typeof window !== 'undefined' 
      ? `${siteOrigin}${window.location.pathname}` 
      : '/');

    const effectiveOgImage = ogImage.startsWith('http') 
      ? ogImage 
      : `${siteOrigin}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Update OpenGraph Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    // Update OpenGraph Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    // Update OpenGraph Image
    let ogImg = document.querySelector('meta[property="og:image"]');
    if (ogImg) ogImg.setAttribute('content', effectiveOgImage);

    // Update OpenGraph URL
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', effectiveCanonicalUrl);

    // Update or Insert Canonical Link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', effectiveCanonicalUrl);

    // If dynamic structured data is provided, insert or update JSON-LD tag
    if (structuredData) {
      const scriptId = 'dynamic-page-jsonld';
      let script = document.getElementById(scriptId);
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }
  }, [title, description, canonicalUrl, ogImage, structuredData]);

  return null;
};
