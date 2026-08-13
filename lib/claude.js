const Anthropic = require("@anthropic-ai/sdk");
const kb = require("../data/knowledgeBase");
const pricing = require("../data/pricing");

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODEL = "claude-haiku-4-5-20251001"; // cheap + fast, plenty for FAQ/quotation duty

function buildSystemPrompt() {
  return `You are the WhatsApp assistant for ${kb.brand.name} (${kb.brand.tagline}), a marketing/creative agency.
Website: ${kb.brand.website}

YOUR JOB
- Greet people warmly the first time they message, like a helpful human team member would (not robotic).
- Answer questions about the business using ONLY the facts given below. Never invent services, results, timelines or prices that aren't listed.
- Understand questions asked in any phrasing (Hindi/English/Hinglish, typos, casual language) and answer in kind — match the user's language and tone, stay warm and professional.
- If someone describes a business problem or goal, connect it to the relevant service(s) below and explain briefly how ${kb.brand.name} would help.
- If someone asks for pricing, give a rough estimate using the pricing data below, ALWAYS framed as a starting estimate that a human will confirm — never state it as a locked-in final price.
- If someone wants to move forward — get a real quote, talk to the team, or book a call — use the appropriate tool below instead of just replying in text.
- Keep replies conversational and not too long (this is WhatsApp, not email). Use line breaks for readability, not big blocks of text.
- Never claim to be human. If asked, say you're the Blinx assistant bot and can bring in the team anytime.

BUSINESS OVERVIEW
${kb.brand.oneLiner}

HOW WE WORK
${kb.howWeWork.map((s, i) => `${i + 1}. ${s.step} — ${s.detail}`).join("\n")}

SERVICES
${kb.services.map((s) => `- ${s.name}: ${s.summary}`).join("\n")}

EXISTING FAQ ANSWERS (use these verbatim in spirit when relevant)
${kb.faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n")}

PRICING DATA (currency: ${pricing.currency}; always add: "${pricing.disclaimer}")
Monthly retainers:
${Object.entries(pricing.retainers).map(([k, v]) => `- ${k}: ₹${v.min}–₹${v.max} ${v.unit}`).join("\n")}

Ad management (management fee only, ad spend billed separately):
${Object.entries(pricing.adManagement).map(([k, v]) => `- ${k}: ₹${v.managementFeeMin}–₹${v.managementFeeMax} (${v.note})`).join("\n")}

One-off projects:
${Object.entries(pricing.projects).map(([k, v]) => `- ${k}: ₹${v.min}–₹${v.max} (${v.unit})`).join("\n")}

If someone's need doesn't map cleanly to a price range above, say a team member will scope it properly rather than guessing a number.`;
}

const tools = [
  {
    name: "request_human_handoff",
    description:
      "Call this when the user explicitly asks to talk to a real person on the team, has a complex/custom request the FAQ can't cover, or seems frustrated with the bot.",
    input_schema: {
      type: "object",
      properties: {
        reason: { type: "string", description: "Short summary of what the user needs, for the team's context." },
        contact_name: { type: "string", description: "User's name if they gave it, else omit." },
      },
      required: ["reason"],
    },
  },
  {
    name: "schedule_meeting",
    description:
      "Call this when the user wants to book a call/meeting with the Blinx team to discuss their project further.",
    input_schema: {
      type: "object",
      properties: {
        context_summary: { type: "string", description: "Brief summary of what they want to discuss, for the team's context." },
      },
      required: ["context_summary"],
    },
  },
  {
    name: "capture_lead",
    description:
      "Call this whenever the user shares enough info to count as a real lead — e.g. business name/type, what they need, and any budget/timeline hints — even if they haven't explicitly asked for anything yet. Can be called silently alongside a normal text answer.",
    input_schema: {
      type: "object",
      properties: {
        business_name: { type: "string" },
        need_summary: { type: "string", description: "What they're looking for." },
        notes: { type: "string", description: "Anything else useful — budget hints, urgency, etc." },
      },
      required: ["need_summary"],
    },
  },
];

/**
 * Sends the conversation to Claude and returns:
 * { replyText, actions: [{name, input}] }
 * actions is the list of tool calls Claude made (handoff/meeting/lead), if any.
 */
async function getBotResponse(history) {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 700,
    system: buildSystemPrompt(),
    messages: history, // [{role: 'user'|'assistant', content: '...'}]
    tools,
  });

  let replyText = "";
  const actions = [];

  for (const block of response.content) {
    if (block.type === "text") replyText += block.text;
    if (block.type === "tool_use") actions.push({ name: block.name, input: block.input });
  }

  // If Claude only called tools with no accompanying text (rare), give a
  // sensible fallback so the user always gets a reply.
  if (!replyText.trim()) {
    replyText = "Got it — let me get that sorted for you.";
  }

  return { replyText, actions };
}

module.exports = { getBotResponse };
