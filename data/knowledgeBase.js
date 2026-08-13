// This is what the bot "knows." Edit freely — the more accurate and specific
// this is, the better the bot's answers will be. No need to touch any other
// file to update what the bot says about the business.

module.exports = {
  brand: {
    name: "blinx_ LAB",
    tagline: "High Velocity Creative",
    oneLiner:
      "We engineer high-velocity creative for brands ready to break the algorithm — ads, content, branding and growth strategy built to get noticed and convert.",
    website: "https://blinxlab.in",
    contactEmail: "hello@blinxlab.com",
  },

  // Edit this to reflect how YOU want the bot to talk about the process.
  howWeWork: [
    {
      step: "Audit & Attack Plan",
      detail:
        "We review the client's current marketing, find what's underperforming, and map out a focused plan to fix it.",
    },
    {
      step: "Creative Production",
      detail:
        "Our team produces the ads, content, or brand assets — built for the specific platform they'll run on.",
    },
    {
      step: "Deploy & Optimize",
      detail:
        "We launch, track performance closely, and keep iterating so results improve over time rather than stalling after week one.",
    },
  ],

  // Services pulled from blinxlab.in/services — edit descriptions/results as needed.
  services: [
    { name: "High-Velocity Ads", summary: "Performance ad creative that's tested fast, with losers killed and winners scaled aggressively." },
    { name: "Content Engines", summary: "Organic content strategy built to grow a loyal, engaged following, not just impressions." },
    { name: "Brand Identity", summary: "Visual identity systems (logo, colors, guidelines) designed to stand out while scrolling." },
    { name: "Growth Strategy", summary: "Data-driven roadmap to find and fix the leaks in a client's marketing funnel." },
    { name: "Social Media Management", summary: "Full social handling — content, posting, community engagement." },
    { name: "Meta Ads", summary: "Facebook & Instagram ad campaigns optimized for ROAS and scale." },
    { name: "Google Ads", summary: "Search, Shopping and Display campaigns aimed at capturing buying intent." },
    { name: "SEO", summary: "Technical, on-page and off-page SEO for sustainable organic traffic." },
    { name: "AIO (all-in-one growth)", summary: "Combined ads + SEO + content working together as one growth engine." },
    { name: "Photo Shoots", summary: "Professional product/brand photography for ads, social and branding use." },
    { name: "Video Shoots", summary: "End-to-end video production for platform-native brand storytelling." },
    { name: "Influencer Marketing", summary: "Influencer partnerships to extend reach and add credibility." },
    { name: "Web Development", summary: "Fast, conversion-focused websites." },
    { name: "App Development", summary: "iOS/Android apps built for retention and monetization." },
    { name: "Editing", summary: "Photo/video post-production and polish." },
  ],

  // Freeform FAQs — add real ones as clients ask them. The bot uses this
  // plus everything above as its source of truth; it should not invent
  // facts that aren't here.
  faqs: [
    {
      q: "How is Blinx different from a regular agency?",
      a: "We don't run 'best practice' generic campaigns — we build sharp, algorithm-aware creative meant to actually stop the scroll, and we track performance closely rather than just delivering content and moving on.",
    },
    {
      q: "Do you work with small businesses or only big brands?",
      a: "We work with brands at different stages — what matters most is fit between what they need and what we're strong at. Best to discuss your specific situation.",
    },
    {
      q: "How long does a typical project take?",
      a: "Depends heavily on scope — a brand identity project and an ongoing ads retainer run on very different timelines. Happy to give a real estimate once we know what's needed.",
    },
  ],
};
