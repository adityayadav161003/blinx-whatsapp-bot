// Client Discovery Questionnaire — used by the bot to ask smart qualifying
// questions and classify leads into the right service pillar.
// Source: Client_Discovery_Questionnaire.docx

module.exports = {
  // The four service pillars — the bot uses these to classify what a prospect needs
  pillars: {
    BUILD: {
      problem: "Digital foundation missing or broken.",
      services: ["Website", "App", "Custom Software", "ERP"],
      signals: [
        "no website", "need a website", "need an app", "website is old",
        "want to go online", "move business online", "custom software",
        "need a portal", "admin dashboard", "e-commerce"
      ],
    },
    VISIBILITY: {
      problem: "Nobody knows the business exists.",
      services: ["SMM", "Content", "Meta Ads", "Google Ads", "Production"],
      signals: [
        "no one knows about us", "need followers", "need content",
        "social media", "instagram", "facebook", "reels", "brand awareness",
        "need ads", "want to run ads", "nobody finds us", "no online presence"
      ],
    },
    GROWTH: {
      problem: "Business is visible but is not generating enough demand.",
      services: ["SEO", "AEO", "Google Business", "Lead Generation", "Conversion"],
      signals: [
        "not enough customers", "need more leads", "need more sales",
        "google ranking", "seo", "search visibility", "low conversion",
        "people visit but don't buy", "need to grow"
      ],
    },
    SYSTEMIZE: {
      problem: "Business is growing but operations are messy.",
      services: ["ERP", "CRM", "Automation", "Dashboards", "Integrations"],
      signals: [
        "too much manual work", "data everywhere", "need automation",
        "need crm", "need erp", "operations are messy", "no system",
        "using excel for everything", "whatsapp for orders"
      ],
    },
  },

  // The ideal full-system client profile
  fullSystemClient: {
    description: "Weak digital presence + low visibility + growth opportunity + operational problems.",
    roadmap: "BUILD → VISIBILITY → GROWTH → SYSTEMIZE",
  },

  // Key qualifying questions the bot should weave into conversations
  // (not all at once — pick the most relevant 2-3 based on context)
  qualifyingQuestions: {
    basics: [
      "What's your business name?",
      "What does your business do — products/services and how you make money?",
      "How long have you been in business?",
      "Who are your primary customers?",
    ],
    currentState: [
      "How do customers currently find you?",
      "Do you have a website? What do you like/dislike about it?",
      "What digital assets do you currently have (website, social media, CRM, etc.)?",
      "What systems do you currently use to run your business?",
    ],
    problem: [
      "What is the biggest problem your business is facing right now?",
      "What is currently slowing your business down?",
      "What is one thing you wish your business could do automatically?",
      "What are you currently doing that isn't working?",
    ],
    goals: [
      "What is your primary goal for the next 6-12 months?",
      "What would make this project a success for you?",
      "Where do you want the business to be 2-3 years from now?",
    ],
    budget: [
      "What investment range have you allocated for this?",
      "When do you want to start?",
      "Is there a specific launch date or deadline?",
    ],
    competition: [
      "Who are your top 3 competitors?",
      "Is there a competitor whose digital presence you like?",
    ],
    critical: [
      "If we could solve only ONE problem for your business, what would you want us to solve?",
    ],
  },

  // Budget ranges (for qualifying)
  budgetRanges: [
    "₹25K–₹50K",
    "₹50K–₹1L",
    "₹1L–₹3L",
    "₹3L–₹5L",
    "₹5L+",
    "Not sure yet",
  ],

  // Timeline options
  timelines: [
    "Immediately",
    "Within 2 weeks",
    "Within 1 month",
    "1–3 months",
    "Just exploring",
  ],

  // Internal classification guide (for lead summaries)
  classificationGuide:
    "After qualifying a lead, summarize: (1) Where they are today, (2) Their biggest constraint, (3) Their desired outcome, (4) Recommended services, (5) Expected first milestone. Recommend the smallest set of interventions that can create a meaningful business outcome — don't sell everything.",
};
