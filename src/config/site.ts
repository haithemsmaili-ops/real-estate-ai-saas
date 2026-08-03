export const siteConfig = {
  name: "PropAI",
  tagline: "AI-Powered Real Estate Platform",
  description:
    "Modular AI SaaS for real estate agencies — qualify leads, automate omnichannel communication, and answer property questions with zero hallucinations.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  supportEmail: "hello@propai.io",
  social: {
    linkedin: "https://linkedin.com/company/propai",
    twitter: "https://twitter.com/propai",
  },
} as const;
