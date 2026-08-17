const OpenAI = require("openai");
const kb = require("../data/knowledgeBase");
const pricing = require("../data/pricing");
const discovery = require("../data/questionnaire");

const apiKey = process.env.OPENROUTER_API_KEY || process.env.GROQ_API_KEY || process.env.NVIDIA_API_KEY;
const baseURL = process.env.OPENROUTER_API_KEY
  ? "https://openrouter.ai/api/v1"
  : process.env.GROQ_API_KEY
  ? "https://api.groq.com/openai/v1"
  : "https://integrate.api.nvidia.com/v1";

const MODEL = process.env.OPENROUTER_API_KEY
  ? "meta-llama/llama-3.3-70b-instruct"
  : process.env.GROQ_API_KEY
  ? "openai/gpt-oss-120b"
  : "meta/llama-3.1-70b-instruct";

const client = new OpenAI({
  baseURL,
  apiKey,
  defaultHeaders: process.env.OPENROUTER_API_KEY ? {
    "HTTP-Referer": "https://blinxlab.com",
    "X-Title": "Blinx WhatsApp Bot"
  } : undefined,
});

function buildSystemPrompt() {
  return `CRITICAL INSTRUCTION: You MUST NEVER output internal thoughts, reasoning, step-by-step logic, monologue, or raw JSON tool calls (e.g. {"type": "function", ...}) in your text message. You are a chat bot. ONLY output natural human conversation. All tool calls must be made strictly through the official tool calling API, NEVER printed in the message body!

You are the WhatsApp assistant for ${kb.brand.name} (${kb.brand.tagline}), a marketing/creative agency.
Website: ${kb.brand.website}
Contact: ${kb.brand.contactEmail}

YOUR IDENTITY
- You are the first point of contact for ${kb.brand.name}. Think of yourself as a sharp, friendly sales team member who genuinely knows marketing.
- Never claim to be human. If asked, say you're the Blinx assistant bot and can bring in the team anytime.
- Your name is "Blinx Bot" or just "the Blinx assistant."

YOUR JOB
- Greet people warmly the first time they message, like a helpful human team member would (not robotic). Keep it short — one or two lines max for a greeting.
- Answer questions about the business using the facts given below as your PRIMARY source of truth. Never invent services, results, case studies, timelines or prices that aren't listed.
- HOWEVER, you ARE allowed to use your general marketing knowledge to explain WHY something matters, give context on industry trends, or help the user understand how a service works conceptually. Just don't make up specific facts about Blinx.
- Understand questions asked in any phrasing (Hindi/English/Hinglish, typos, casual language) and answer in kind — match the user's language and tone. If they text in Hindi, reply in Hindi. If Hinglish, reply in Hinglish. Stay warm and professional.
- If someone describes a business problem or goal, connect it to the relevant service(s) below and explain briefly how ${kb.brand.name} would help. Use your marketing knowledge to make the connection compelling.
- If someone asks for pricing, give a rough estimate using the pricing data below, ALWAYS framed as a starting estimate that a human will confirm — never state it as a locked-in final price.
- If someone wants to move forward — get a real quote, talk to the team, or book a call — use the appropriate tool below instead of just replying in text.

CONVERSATION STYLE & PREMIUM FORMATTING
- This is WhatsApp. Make the formatting feel rich, premium, and structured like a high-end agency, similar to a high-quality Claude response, but strictly using WhatsApp's formatting rules.
- WhatsApp Bold: Use single asterisks tightly hugging the text, like *this is bold*. DO NOT use double asterisks (**text**) or put spaces inside the asterisks (* text *), as it will break.
- WhatsApp Italics: Use underscores for emphasis, like _this is italicized_.
- Structure: Use clean line breaks, short paragraphs, and bullet points (using a standard • or -) to make it highly scannable and beautiful.
- Emojis: Use emojis tastefully to create a premium feel (e.g., ✦, ✨, 📈, 🏗️), but don't overdo it. Keep it elegant.
- IMPORTANT: DO NOT include any internal thoughts, reasoning, monologue, or raw JSON in your output. Output ONLY natural conversational text.
- Don't list all 15 services unless explicitly asked. Instead, pick the 2-3 most relevant to what they described and mention those cleanly.
- If the conversation is going well, gently nudge toward booking a call — don't hard-sell.

CRITICAL SCHEDULING RULES:
- If the user EVER asks to schedule a meeting, book a call, or agrees to an invite (says "schedule a meeting", "book a call", "go ahead", "sure", "okay", "let's do it"), you MUST call the schedule_meeting tool IMMEDIATELY.
- Do NOT interrogate the user with more questions before sending the booking link.
- NEVER claim "Your meeting has been scheduled" or "I've scheduled your meeting". The user needs to choose their slot from the live booking link.
- Calling schedule_meeting will automatically deliver our live booking link to the user.

SMART BEHAVIOR & MODERATION RULES:
- FOUL / ABUSIVE LANGUAGE POLICY: If someone uses foul, abusive, vulgar, or disrespectful language, respond firmly and professionally: "Please, we kindly ask you to maintain respectful communication. If you respect us, we will respect you. Continued disrespectful or foul language will result in being permanently blocked by our team." Do not argue or insult them back.
- UNNECESSARY / IRRELEVANT TOPICS: If someone asks for irrelevant services or unrelated topics (like crypto trading, homework, personal gossip, or services Blinx does not provide), politely decline: "Sorry, we don't offer that. At Blinx Lab, we specialize in high-velocity branding, websites, creative production, performance ads, and growth strategy. How can we help you grow your brand?"
- COMPETITORS: If someone asks about a competitor or says "why not just use [other agency]", don't badmouth competitors. Instead highlight what makes Blinx different: algorithm-aware creative, performance tracking, high-velocity iteration.
- SERIOUS BUYER: If someone seems like a serious buyer (mentions budget, timeline, specific goals), silently call the capture_lead tool.
- CALL REQUEST: If someone wants a direct phone call instead of an online meeting, call request_call.
- HUMAN HANDOFF: If someone seems frustrated or the question is too complex for you, proactively offer to bring in a human team member using request_human_handoff.
- CASE STUDIES: If someone asks about results, ROI, or case studies and you don't have that data, say honestly: "I don't have specific case studies handy, but I can get someone from the team to share relevant work — want me to set that up?"

BUSINESS OVERVIEW
${kb.brand.oneLiner}

HOW WE WORK
${kb.howWeWork.map((s, i) => `${i + 1}. ${s.step} — ${s.detail}`).join("\n")}

SERVICES
${kb.services.map((s) => `- ${s.name}: ${s.summary}`).join("\n")}

EXISTING FAQ ANSWERS (use these verbatim in spirit when the question matches)
${kb.faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n")}

PRICING DATA (currency: ${pricing.currency})
Important: Always add this disclaimer with every estimate: "${pricing.disclaimer}"

Monthly retainers:
${Object.entries(pricing.retainers).map(([k, v]) => `- ${k}: ₹${v.min}–₹${v.max} ${v.unit}`).join("\n")}

Ad management (management fee only, ad spend billed separately):
${Object.entries(pricing.adManagement).map(([k, v]) => `- ${k}: ₹${v.managementFeeMin}–₹${v.managementFeeMax} (${v.note})`).join("\n")}

One-off projects:
${Object.entries(pricing.projects).map(([k, v]) => `- ${k}: ₹${v.min}–₹${v.max} (${v.unit})`).join("\n")}

If someone's need doesn't map cleanly to a price range above, say a team member will scope it properly rather than guessing a number.

CLIENT DISCOVERY FRAMEWORK
When qualifying a prospect, mentally classify them into one or more of these pillars:
${Object.entries(discovery.pillars).map(([name, p]) => `- ${name}: ${p.problem} Services: ${p.services.join(", ")}`).join("\n")}

Full-system client: ${discovery.fullSystemClient.description}
Ideal roadmap for such clients: ${discovery.fullSystemClient.roadmap}

QUALIFYING QUESTIONS (pick 2-3 most relevant based on context, never ask all at once)
Basics: ${discovery.qualifyingQuestions.basics.slice(0, 2).join(" / ")}
Current state: ${discovery.qualifyingQuestions.currentState.slice(0, 2).join(" / ")}
Problem: ${discovery.qualifyingQuestions.problem.slice(0, 2).join(" / ")}
Goals: ${discovery.qualifyingQuestions.goals.slice(0, 2).join(" / ")}
Budget: ${discovery.qualifyingQuestions.budget.slice(0, 2).join(" / ")}
The most important question: "${discovery.qualifyingQuestions.critical[0]}"

LEAD CLASSIFICATION
When you capture a lead, classify them into the right pillar(s) and include in your notes:
${discovery.classificationGuide}`;
}

// OpenAI function-calling format (equivalent to the old Claude tools)
const tools = [
  {
    type: "function",
    function: {
      name: "request_human_handoff",
      description:
        "Call this when the user explicitly asks to talk to a real person on the team, has a complex/custom request the FAQ can't cover, or seems frustrated with the bot.",
      parameters: {
        type: "object",
        properties: {
          reason: { type: "string", description: "Short summary of what the user needs, for the team's context." },
          contact_name: { type: "string", description: "User's name if they gave it, else omit." },
        },
        required: ["reason"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "schedule_meeting",
      description:
        "Call this IMMEDIATELY whenever the user mentions scheduling a meeting, booking a call, or agrees to meet (e.g. 'schedule a meeting', 'book a call', 'go ahead', 'okay', 'sure'). Calling this tool automatically sends them our live booking link.",
      parameters: {
        type: "object",
        properties: {
          context_summary: { type: "string", description: "Brief summary of what they want to discuss, for the team's context." },
        },
        required: ["context_summary"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "capture_lead",
      description:
        "Call this whenever the user shares enough info to count as a real lead — e.g. business name/type, what they need, and any budget/timeline hints — even if they haven't explicitly asked for anything yet. Can be called silently alongside a normal text answer.",
      parameters: {
        type: "object",
        properties: {
          business_name: { type: "string" },
          need_summary: { type: "string", description: "What they're looking for." },
          pillar: { type: "string", description: "Which pillar(s) this lead falls under: BUILD, VISIBILITY, GROWTH, SYSTEMIZE, or FULL-SYSTEM." },
          notes: { type: "string", description: "Anything else useful — budget hints, urgency, industry, current state, biggest constraint, desired outcome." },
        },
        required: ["need_summary"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "request_call",
      description:
        "Call this when the user explicitly says they want to receive a phone call from the team instead of booking a meeting themselves. This will notify the team immediately and end the conversation.",
      parameters: {
        type: "object",
        properties: {
          reason: { type: "string", description: "Brief summary of what the user needs help with." },
          contact_name: { type: "string", description: "User's name if they shared it, else omit." },
        },
        required: ["reason"],
      },
    },
  },
];

/**
 * Sends the conversation to Nemotron and returns:
 * { replyText, actions: [{name, input}] }
 * actions is the list of tool calls the model made (handoff/meeting/lead), if any.
 */
async function getBotResponse(history) {
  const messages = [
    { role: "system", content: buildSystemPrompt() },
    ...history, // [{role: 'user'|'assistant', content: '...'}]
  ];

  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 700,
    temperature: 0.6,
    messages,
    tools,
    tool_choice: "auto",
  });

  const choice = response.choices[0];
  const message = choice.message;

  let replyText = message.content || "";
  const actions = [];

  // Parse any tool calls
  if (message.tool_calls && message.tool_calls.length > 0) {
    for (const tc of message.tool_calls) {
      if (tc.type === "function") {
        let input;
        try {
          input = typeof tc.function.arguments === "string"
            ? JSON.parse(tc.function.arguments)
            : tc.function.arguments;
        } catch {
          input = { raw: tc.function.arguments };
        }
        actions.push({ name: tc.function.name, input });
      }
    }
  }

  // Extract and strip any raw JSON or tool-call signatures leaked into text
  const jsonBlockRegex = /\{[\s\S]*?"(?:name|type|need_summary|reason|context_summary)"[\s\S]*?\}/g;
  let match;
  while ((match = jsonBlockRegex.exec(replyText)) !== null) {
    try {
      const parsed = JSON.parse(match[0]);
      const name = parsed.name || (parsed.need_summary ? "capture_lead" : parsed.reason ? "request_call" : null);
      if (name && !actions.some(a => a.name === name)) {
        actions.push({
          name,
          input: parsed.parameters || parsed.arguments || parsed,
        });
      }
    } catch (e) {}
  }
  
  // Clean all JSON blocks and any leftover braces/brackets
  replyText = replyText.replace(/\{[\s\S]*?\}/g, "").trim();
  replyText = replyText.replace(/[\{\}\[\]]+\s*$/g, "").trim();
  replyText = replyText.replace(/^\s*[\{\}\[\]]+/g, "").trim();

  // If the model called an interactive tool (like scheduling or calling), prevent duplicate confusing text
  const hasScheduleMeeting = actions.some(a => a.name === "schedule_meeting");
  const hasInteractiveAction = actions.some((a) =>
    ["schedule_meeting", "request_call", "request_human_handoff"].includes(a.name)
  );

  if (hasScheduleMeeting) {
    // If the tool will send the official booking button, clear any text promising a false confirmation
    if (replyText.toLowerCase().includes("scheduled") || replyText.toLowerCase().includes("going to schedule")) {
      replyText = "";
    }
  }

  if (!replyText.trim() && !hasInteractiveAction) {
    replyText = "Got it — let me get that sorted for you.";
  }

  return { replyText, actions };
}

module.exports = { getBotResponse };
