// IMPORTANT: Fill in your real ranges before going live. Everything here is
// a placeholder. Keep ranges (min-max) rather than fixed numbers — the bot
// is instructed to always present these as "starting from" / "typically
// between" estimates, never as a final locked price, and to say a human
// will confirm the exact number.

module.exports = {
  currency: "INR",

  // Monthly retainer-style services
  retainers: {
    "Social Media Management": { min: 15000, max: 40000, unit: "per month" },
    "Content Engines": { min: 20000, max: 60000, unit: "per month" },
    "SEO": { min: 15000, max: 50000, unit: "per month" },
    "Growth Strategy": { min: 25000, max: 75000, unit: "per month" },
    "AIO (all-in-one growth)": { min: 40000, max: 120000, unit: "per month" },
  },

  // Ad spend management (usually a % of ad spend + a base fee — edit model as needed)
  adManagement: {
    "Meta Ads": { managementFeeMin: 10000, managementFeeMax: 30000, note: "plus ad spend, billed separately to the platform" },
    "Google Ads": { managementFeeMin: 10000, managementFeeMax: 30000, note: "plus ad spend, billed separately to the platform" },
    "High-Velocity Ads": { managementFeeMin: 15000, managementFeeMax: 45000, note: "plus ad spend, billed separately to the platform" },
  },

  // One-off project-based services
  projects: {
    "Brand Identity": { min: 25000, max: 100000, unit: "one-time" },
    "Web Development": { min: 20000, max: 150000, unit: "one-time, depends on pages/complexity" },
    "App Development": { min: 80000, max: 500000, unit: "one-time, depends on platform/features" },
    "Photo Shoots": { min: 8000, max: 30000, unit: "per shoot day" },
    "Video Shoots": { min: 15000, max: 75000, unit: "per video" },
    "Editing": { min: 2000, max: 10000, unit: "per asset" },
    "Influencer Marketing": { min: 20000, max: 100000, unit: "per campaign, varies hugely by influencer tier" },
  },

  // Shown alongside every estimate
  disclaimer:
    "This is a rough starting estimate based on typical projects — your final quote depends on scope, timeline and specifics, and will be confirmed by our team.",
};
