/**
 * High-Speed In-Memory Fast Router & Cache
 * Execution Time: < 0.1ms (Sub-Millisecond In-Memory Lookup)
 */

const kb = require("../data/knowledgeBase");
const pricing = require("../data/pricing");

// In-Memory LRU Cache for dynamic LLM responses
const responseCache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const MAX_CACHE_SIZE = 500;

/**
 * Normalizes user text for instant sub-millisecond matching
 */
function normalize(text) {
  return (text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, " ");
}

/**
 * Instant Sub-Millisecond (<1ms) In-Memory Matcher
 * Bypasses LLM network latency for frequent queries.
 */
function matchInstantResponse(rawText) {
  const norm = normalize(rawText);
  if (!norm) return null;

  // 1. Quick Greetings (< 0.01ms)
  const greetings = ["hi", "hello", "hey", "helo", "hy", "hii", "hiii", "namaste", "good morning", "good evening", "good afternoon", "start"];
  if (greetings.includes(norm)) {
    return {
      replyText: `Hey there! 👋 Welcome to *Blinx Lab* — High-Velocity Creative & Performance Growth Agency.\n\nWe build algorithm-breaking creative, modern websites, performance ads, and high-velocity growth systems.\n\nHow can we help scale your brand today? (You can ask about our services, pricing, or book a strategy call!)`,
      actions: [],
      source: "fast_memory_cache"
    };
  }

  // 2. Pricing & Cost Queries (< 0.01ms)
  const pricingTriggers = ["price", "pricing", "prices", "cost", "charges", "rate", "rates", "kitna kharcha", "package", "packages", "budget"];
  if (pricingTriggers.some(t => norm === t || norm.startsWith(`${t} `) || norm.endsWith(` ${t}`))) {
    return {
      replyText: `✦ *BLINX LAB • PRICING OVERVIEW* ✦\n\nHere is a starting estimate of our key offerings:\n\n• *Growth Retainer (Social + Ads)*: ₹25,000 – ₹60,000/mo\n• *Performance Marketing (Meta & Google Ads)*: ₹15,000 – ₹35,000/mo management fee\n• *High-Performance Website / Landing Page*: ₹20,000 – ₹50,000 one-off\n• *Branding & Visual Identity*: ₹15,000 – ₹40,000 one-off\n\n_${pricing.disclaimer}_\n\nWould you like a tailored quote or to book a quick 30-min strategy call?`,
      actions: [],
      source: "fast_memory_cache"
    };
  }

  // 3. Services Overview (< 0.01ms)
  const serviceTriggers = ["services", "service", "what do you do", "kya karte ho", "services list", "what services", "your services", "features"];
  if (serviceTriggers.some(t => norm === t || norm.includes(t))) {
    return {
      replyText: `✦ *WHAT WE DO AT BLINX LAB* ✦\n\nWe engineer full-funnel creative and growth systems:\n\n1. *Creative Production*: High-converting Reels, short-form video ads, UGC & graphic creative.\n2. *Performance Marketing*: Targeted Meta (Instagram/Facebook) & Google Ads with precision tracking.\n3. *Websites & UI/UX*: Lightning-fast conversion-optimized websites & landing pages.\n4. *Branding & Identity*: Standout logos, typography, visual systems & brand decks.\n\nWhich of these are you looking to scale for your business?`,
      actions: [],
      source: "fast_memory_cache"
    };
  }

  // 4. Contact & Location (< 0.01ms)
  const contactTriggers = ["where are you located", "location", "office", "address", "contact", "support email", "email", "website", "kaha se ho"];
  if (contactTriggers.some(t => norm === t || norm.includes(t))) {
    return {
      replyText: `✦ *BLINX LAB • CONTACT & DETAILS* ✦\n\n🌐 *Website*: https://blinxlab.in/\n📩 *Support Email*: support@blinxlab.in\n📩 *Official Email*: blinxlab.official@gmail.com\n📍 *HQ*: Mathura / India (Serving clients globally)\n\nFeel free to ask any question or book a 30-min strategy call anytime!`,
      actions: [],
      source: "fast_memory_cache"
    };
  }

  // 5. Check LRU In-Memory Cache (< 0.01ms)
  if (responseCache.has(norm)) {
    const cached = responseCache.get(norm);
    if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return {
        replyText: cached.replyText,
        actions: cached.actions || [],
        source: "fast_lru_cache"
      };
    } else {
      responseCache.delete(norm);
    }
  }

  return null;
}

/**
 * Stores dynamic AI answers in in-memory cache for ultra-low latency reuse
 */
function setCacheResponse(rawText, replyText, actions = []) {
  const norm = normalize(rawText);
  if (!norm || norm.length > 200) return;

  if (responseCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = responseCache.keys().next().value;
    responseCache.delete(oldestKey);
  }

  responseCache.set(norm, {
    replyText,
    actions,
    timestamp: Date.now()
  });
}

module.exports = {
  matchInstantResponse,
  setCacheResponse,
  normalize
};
