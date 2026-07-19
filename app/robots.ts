import type { MetadataRoute } from "next";

const SITE_URL = "https://midecollectives.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/checkout", "/order/success", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
