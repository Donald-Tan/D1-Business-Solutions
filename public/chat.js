(function () {
  // ── D1 Chat Widget — Scripted + smart lead capture ────────────────────────────
  const WEB3FORMS_KEY = '2095928f-a811-4850-8120-ad58ae85756a';

  // ── Knowledge Base ────────────────────────────────────────────────────────────
  const KB = [
    // PRICING
    {
      patterns: ['price','cost','how much','pricing','charge','rate','fee','affordable','cheap','expensive','budget','invest'],
      answer: `Our projects are priced for small businesses — no agency markups:<br><br>
🌐 <strong>Launch Ready</strong> — $800–$1,500<br>
&nbsp;&nbsp;&nbsp;Simple, fast business site · 3–7 day turnaround<br><br>
🤖 <strong>AI-Powered Pro</strong> — $1,500–$3,500<br>
&nbsp;&nbsp;&nbsp;Custom design + AI features · 1–2 weeks<br><br>
🚀 <strong>Full Stack Growth</strong> — $3,500+<br>
&nbsp;&nbsp;&nbsp;Full platform build · 3–5 weeks<br><br>
All are one-time fees. Want a precise quote for your project?`,
      chips: [{ label: 'Maintenance costs?', msg: 'How much is maintenance?' }, { label: 'Get a quote', msg: '__quote__' }]
    },
    // MAINTENANCE & HOSTING
    {
      patterns: ['maintenance','hosting','monthly','recurring','subscription','ongoing','after launch','upkeep'],
      answer: `Maintenance plans are optional and include hosting:<br><br>
🌐 <strong>Launch Ready</strong> — $20/mo or $200/yr<br>
🤖 <strong>AI-Powered Pro</strong> — $50/mo or $500/yr<br>
🚀 <strong>Full Stack Growth</strong> — $100/mo or $1,000/yr<br><br>
No plan needed if you prefer to self-host — we hand over all your files and code with no lock-in.`,
      chips: [{ label: "What's included?", msg: 'What does the maintenance plan include?' }, { label: 'Get a quote', msg: '__quote__' }]
    },
    // MAINTENANCE DETAILS
    {
      patterns: ['maintenance include','plan include','what do i get','whats included'],
      answer: `Maintenance plans include:<br><br>
✓ Managed hosting (fast CDN, SSL, uptime monitoring)<br>
✓ Security updates and backups<br>
✓ Minor content edits and tweaks<br>
✓ Priority support — same-day replies<br>
✓ Support for the life of your contract<br><br>
No contracts — cancel anytime.`
    },
    // TIMELINE
    {
      patterns: ['how long','timeline','turnaround','time','when','deadline','fast','quick','rush','days','weeks'],
      answer: `Timelines depend on scope:<br><br>
⚡ <strong>Launch Ready</strong> — 3–7 days<br>
&nbsp;&nbsp;&nbsp;First draft in 48 hours<br><br>
🛠 <strong>AI-Powered Pro</strong> — 1–2 weeks<br><br>
🏗 <strong>Full Stack Growth</strong> — 3–5 weeks<br><br>
Rush delivery is available on most projects — just let us know your deadline and we'll make it work.`,
      chips: [{ label: "What's the process?", msg: 'What is your process?' }, { label: 'Get a quote', msg: '__quote__' }]
    },
    // SERVICES OVERVIEW
    {
      patterns: ['what do you do','what services','what can you','offer','what do you build','what do you make','help with','capabilities'],
      answer: `We build the full digital stack for small businesses:<br><br>
🌐 <strong>Business Websites</strong> — fast, modern, mobile-first, SEO-ready<br>
🤖 <strong>AI Agents & Chatbots</strong> — lead capture on autopilot 24/7<br>
🛒 <strong>E-commerce Stores</strong> — Stripe, PayPal, Apple Pay ready<br>
⚡ <strong>Speed & SEO</strong> — page one rankings, sub-2s load times<br>
🔗 <strong>Workflow Automation</strong> — cut 5–10 hrs of busywork weekly<br>
📊 <strong>Analytics Dashboards</strong> — know exactly what's working<br><br>
Which one interests you most?`,
      chips: [
        { label: 'Websites', msg: 'Tell me about your websites' },
        { label: 'AI Agents', msg: 'Tell me about AI agents' },
        { label: 'E-commerce', msg: 'Tell me about e-commerce' },
        { label: 'SEO', msg: 'Tell me about SEO' },
      ]
    },
    // WEBSITES
    {
      patterns: ['website','web site','web design','landing page','business site','homepage','pages'],
      answer: `Our websites are built to convert visitors into customers — not just look nice:<br><br>
✓ Custom design — no templates, built to your brand<br>
✓ Up to 10 pages (Home, About, Services, Blog, Contact & more)<br>
✓ Sub-2-second load times on mobile and desktop<br>
✓ On-page SEO: meta tags, schema, sitemap, robots.txt<br>
✓ Google Analytics 4 + Search Console connected from day one<br>
✓ Contact forms, click-to-call, lead capture built in<br>
✓ 48-hour first draft · unlimited revisions<br>
✓ Support included for life of contract<br><br>
Starting at <strong>$800</strong>.`,
      chips: [{ label: 'How long does it take?', msg: 'How long does a website take?' }, { label: 'Get a quote', msg: '__quote__' }]
    },
    // AI AGENTS
    {
      patterns: ['ai agent','chatbot','chat bot','ai chat','automation agent','lead bot','bot'],
      answer: `Our AI agents are trained on <em>your specific business</em> — not a generic template:<br><br>
✓ Answers questions, qualifies leads, books appointments 24/7<br>
✓ Works on your website, Facebook, or Instagram<br>
✓ Instant email or SMS alert when a hot lead is captured<br>
✓ Connects to your CRM, Google Sheets, or Notion<br>
✓ Fully branded — your name, your tone<br><br>
From <strong>$349 setup</strong> · optional $49/mo hosting.<br><br>
Most clients recoup the cost in the first month.`,
      chips: [{ label: 'Get a quote', msg: '__quote__' }]
    },
    // ECOMMERCE
    {
      patterns: ['ecommerce','e-commerce','online store','shop','sell online','products','shopify','woocommerce','stripe'],
      answer: `We build stores that guide every visitor toward buying:<br><br>
✓ Unlimited products with smart filtering and search<br>
✓ Stripe, PayPal, Apple Pay, and Google Pay checkout<br>
✓ Abandoned cart emails + post-purchase follow-up<br>
✓ Inventory management and low-stock alerts<br>
✓ Discount codes, bundles, and upsell prompts<br>
✓ Order tracking + automated shipping emails<br>
✓ Shopify, WooCommerce, or fully custom<br><br>
No monthly platform fees beyond your payment processor.`,
      chips: [{ label: 'Get a quote', msg: '__quote__' }]
    },
    // SEO & SPEED
    {
      patterns: ['seo','search engine','google rank','ranking','traffic','found online','page one','speed','slow','performance','core web vitals','lighthouse'],
      answer: `We audit your site, find every bottleneck, and fix it:<br><br>
✓ Full technical SEO audit: errors, crawlability, Core Web Vitals<br>
✓ Image compression, lazy loading, and CDN setup<br>
✓ Google Business Profile optimization for local search<br>
✓ Keyword research + on-page content recommendations<br>
✓ Schema markup for rich snippets<br>
✓ Monthly rank tracking + performance reports<br>
✓ Competitor gap analysis included<br><br>
Average <strong>58% load time improvement</strong> and measurable ranking movement within 60 days.`,
      chips: [{ label: 'Get an SEO audit', msg: '__quote__' }]
    },
    // AUTOMATION
    {
      patterns: ['automat','workflow','zapier','make.com','integrat','crm','hubspot','mailchimp','slack','save time','busywork','connect'],
      answer: `We connect your website to the tools you already use so data flows without you touching it:<br><br>
✓ CRM connections: HubSpot, Salesforce, Pipedrive, Notion, Airtable<br>
✓ Booking: Calendly, Acuity, Cal.com, or custom-built<br>
✓ Email marketing: Mailchimp, Klaviyo, ActiveCampaign<br>
✓ Form submissions → Slack, email, or SMS instantly<br>
✓ Zapier / Make automations built and documented<br>
✓ Payment collection and invoice automation<br><br>
Most clients save <strong>5–10 hours per week</strong> within the first month.`,
      chips: [{ label: 'Get a quote', msg: '__quote__' }]
    },
    // ANALYTICS / DASHBOARDS
    {
      patterns: ['analytics','dashboard','data','reporting','tracking','google analytics','looker','metrics','traffic source'],
      answer: `We build plain-English dashboards that show the numbers that actually matter:<br><br>
✓ Custom Looker Studio dashboard for your goals<br>
✓ Lead source tracking (Google, social, referral, direct)<br>
✓ Conversion funnel: visits → leads → customers<br>
✓ Google Ads and Meta Ads performance in one view<br>
✓ Monthly email summary with plain-English commentary<br>
✓ Heatmaps and scroll tracking to improve pages<br><br>
Set up once, runs forever — no monthly retainer required.`
    },
    // PROCESS
    {
      patterns: ['process','how does it work','how do you work','steps','what happens','onboard','start','begin','discovery'],
      answer: `Our process is simple and fast:<br><br>
<strong>1. Discovery</strong> — We learn your goals, audience, and brand<br>
<strong>2. Design</strong> — Mockups tailored to your business (48 hrs)<br>
<strong>3. Build</strong> — Fast, clean development with your feedback<br>
<strong>4. Launch</strong> — We handle deployment, DNS, and testing<br>
<strong>5. Support</strong> — Ongoing for the life of your contract<br><br>
No long onboarding. No account managers. Just results.`,
      chips: [{ label: 'Get started', msg: '__quote__' }]
    },
    // SUPPORT
    {
      patterns: ['support','after launch','warranty','guarantee','contract','life of','included','help after'],
      answer: `Support is included for the <strong>life of your contract</strong> — not just 30 days. As long as you're working with us, we're in your corner.<br><br>
On maintenance plans you also get same-day replies, priority fixes, and managed hosting.`
    },
    // OWNERSHIP
    {
      patterns: ['own','ownership','lock in','lock-in','take it','my code','my files','keep','transfer'],
      answer: `Everything is yours from day one — all code, content, images, and domains. No lock-in, ever.<br><br>
If you ever want to move to another provider, we'll hand over a clean package of all your files. No strings attached.`
    },
    // LOCATION
    {
      patterns: ['where','location','based','seattle','local','area','in person','meet'],
      answer: `We're based in the <strong>Seattle, WA</strong> area and work with businesses locally and across the US. Everything is handled remotely — no in-person meetings required, though we're happy to jump on a call anytime.`
    },
    // CONTACT
    {
      patterns: ['contact','reach','phone','email','call','talk','speak','get in touch','number'],
      answer: `You can reach our team directly:<br><br>
📞 <a href="tel:2067134204" style="color:#82aaff">(206) 713-4204</a><br>
✉️ <a href="mailto:hello@d1businesssolutions.com" style="color:#82aaff">hello@d1businesssolutions.com</a><br>
🤖 <a href="mailto:ai@d1businesssolutions.com" style="color:#82aaff">ai@d1businesssolutions.com</a> (AI & automation)<br><br>
Or leave your info below and a team member will reach out within 24 hours.`,
      chips: [{ label: 'Leave my info', msg: '__quote__' }]
    },
    // WHY D1
    {
      patterns: ['why d1','why you','why choose','what makes you','different','unique','better','trust'],
      answer: `A few reasons clients choose us:<br><br>
⚡ <strong>Fast delivery</strong> — first draft in 48 hours, most sites live in a week<br>
💰 <strong>Startup pricing</strong> — built for small businesses, not enterprise budgets<br>
🔒 <strong>You own everything</strong> — all code and assets are yours, no lock-in<br>
📞 <strong>Real support</strong> — talk to the person building your site, no middlemen<br>
📄 <strong>No surprise fees</strong> — transparent pricing, always<br><br>
<em>D1 gets it done.</em>`,
      chips: [{ label: 'Get a quote', msg: '__quote__' }]
    },
    // REVISION / CHANGES
    {
      patterns: ['revision','change','edit','update','modify','tweak','feedback','adjust'],
      answer: `Unlimited revisions are included throughout the project. We work in rounds — you review, you give feedback, we refine.<br><br>
Post-launch changes are covered under your maintenance plan or billed at a flat hourly rate for one-off requests.`
    },
    // DOMAIN / HOSTING STANDALONE
    {
      patterns: ['domain','dns','cloudflare','firebase','hosting only','where is it hosted'],
      answer: `We handle all hosting and domain setup as part of every project. We typically host on Firebase (Google infrastructure) with Cloudflare as a CDN — giving you fast global load times and 99.9% uptime.<br><br>
You keep full ownership of your domain and can transfer it anytime.`
    },
  ];

  // ── Conversation state ────────────────────────────────────────────────────────
  let leadState = { step: 'idle', name: '', email: '', project: '' };
  let lastAnswer = null;

  // ── Styles ────────────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #d1-chat-btn {
      position: fixed; bottom: 28px; right: 28px; z-index: 9999;
      width: 56px; height: 56px; border-radius: 50%;
      background: #c792ea; border: none; cursor: pointer;
      box-shadow: 0 4px 20px rgba(199,146,234,0.4);
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #d1-chat-btn:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(199,146,234,0.55); }
    #d1-chat-btn svg { width: 26px; height: 26px; fill: #0b0d12; }
    #d1-chat-btn.open svg.icon-chat { display: none; }
    #d1-chat-btn:not(.open) svg.icon-close { display: none; }

    #d1-chat-box {
      position: fixed; bottom: 96px; right: 28px; z-index: 9998;
      width: 345px; max-height: 540px;
      background: #11141b; border: 1px solid #252a38; border-radius: 16px;
      display: flex; flex-direction: column;
      box-shadow: 0 20px 60px rgba(0,0,0,0.6);
      transform: scale(0.92) translateY(12px); opacity: 0; pointer-events: none;
      transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), opacity 0.18s;
      overflow: hidden;
    }
    #d1-chat-box.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }

    .d1-chat-header {
      padding: 14px 16px; border-bottom: 1px solid #252a38;
      display: flex; align-items: center; gap: 10px;
      background: #171b24; flex-shrink: 0;
    }
    .d1-chat-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: linear-gradient(135deg, #c792ea, #82aaff);
      display: flex; align-items: center; justify-content: center;
      font-size: 17px; flex-shrink: 0;
    }
    .d1-chat-header-info { flex: 1; }
    .d1-chat-header-name { font-family: 'Outfit', sans-serif; font-size: 0.86rem; font-weight: 600; color: #e9eaf2; }
    .d1-chat-header-status { font-size: 0.7rem; color: #8d94ad; display: flex; align-items: center; gap: 5px; margin-top: 1px; }
    .d1-chat-header-status::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: #c3e88d; box-shadow: 0 0 6px #c3e88d; display: inline-block; flex-shrink: 0; }

    .d1-chat-messages {
      flex: 1; overflow-y: auto; padding: 14px 12px;
      display: flex; flex-direction: column; gap: 10px;
      scrollbar-width: thin; scrollbar-color: #252a38 transparent;
    }
    .d1-chat-messages::-webkit-scrollbar { width: 4px; }
    .d1-chat-messages::-webkit-scrollbar-thumb { background: #252a38; border-radius: 4px; }

    .d1-msg {
      max-width: 90%; font-family: 'Outfit', sans-serif; font-size: 0.82rem; line-height: 1.6;
      padding: 9px 13px; border-radius: 12px; animation: d1-pop 0.18s ease;
    }
    .d1-msg a { color: #82aaff; }
    @keyframes d1-pop { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    .d1-msg.bot { background: #1c2030; color: #e9eaf2; border-bottom-left-radius: 4px; align-self: flex-start; }
    .d1-msg.user { background: #c792ea; color: #0b0d12; border-bottom-right-radius: 4px; align-self: flex-end; font-weight: 500; }

    .d1-chat-chips {
      padding: 4px 12px 10px; display: flex; flex-wrap: wrap; gap: 6px; flex-shrink: 0;
    }
    .d1-chip {
      font-family: 'Outfit', sans-serif; font-size: 0.74rem; padding: 5px 12px;
      border-radius: 100px; border: 1px solid #2e3448; background: #1c2030;
      color: #8d94ad; cursor: pointer; transition: border-color 0.15s, color 0.15s, background 0.15s;
      white-space: nowrap;
    }
    .d1-chip:hover { border-color: #c792ea; color: #c792ea; background: rgba(199,146,234,0.06); }

    .d1-chat-input-row {
      display: flex; gap: 8px; padding: 10px 12px; border-top: 1px solid #252a38;
      background: #11141b; flex-shrink: 0;
    }
    .d1-chat-input {
      flex: 1; background: #1c2030; border: 1px solid #252a38; border-radius: 8px;
      color: #e9eaf2; font-family: 'Outfit', sans-serif; font-size: 0.82rem;
      padding: 8px 12px; outline: none; transition: border-color 0.15s;
    }
    .d1-chat-input:focus { border-color: #c792ea; }
    .d1-chat-input::placeholder { color: #555d78; }
    .d1-chat-send {
      width: 34px; height: 34px; border-radius: 8px; background: #c792ea;
      border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: opacity 0.15s; align-self: center;
    }
    .d1-chat-send:hover { opacity: 0.85; }
    .d1-chat-send:disabled { opacity: 0.35; cursor: not-allowed; }
    .d1-chat-send svg { width: 15px; height: 15px; fill: #0b0d12; }

    .d1-typing {
      display: flex; gap: 4px; align-items: center; padding: 10px 14px;
      background: #1c2030; border-radius: 12px; border-bottom-left-radius: 4px;
      align-self: flex-start;
    }
    .d1-typing span { width: 7px; height: 7px; border-radius: 50%; background: #555d78; animation: d1-bounce 1.2s infinite; }
    .d1-typing span:nth-child(2) { animation-delay: 0.15s; }
    .d1-typing span:nth-child(3) { animation-delay: 0.3s; }
    @keyframes d1-bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-5px); } }

    @media (max-width: 480px) {
      #d1-chat-box { width: calc(100vw - 32px); right: 16px; bottom: 88px; }
      #d1-chat-btn { right: 16px; bottom: 16px; }
    }
  `;
  document.head.appendChild(style);

  document.body.insertAdjacentHTML('beforeend', `
    <button id="d1-chat-btn" aria-label="Chat with us">
      <svg class="icon-chat" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.04 2 11c0 2.67 1.19 5.07 3.08 6.74L4 22l4.54-1.51C9.61 20.83 10.78 21 12 21c5.52 0 10-4.04 10-9S17.52 2 12 2zm1 13H7v-2h6v2zm4-4H7V9h10v2z"/></svg>
      <svg class="icon-close" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
    </button>
    <div id="d1-chat-box" role="dialog" aria-label="D1 Business Solutions chat">
      <div class="d1-chat-header">
        <div class="d1-chat-avatar">💬</div>
        <div class="d1-chat-header-info">
          <div class="d1-chat-header-name">D1 Assistant</div>
          <div class="d1-chat-header-status">Online · usually replies instantly</div>
        </div>
      </div>
      <div class="d1-chat-messages" id="d1-msgs"></div>
      <div class="d1-chat-chips" id="d1-chips"></div>
      <div class="d1-chat-input-row">
        <input class="d1-chat-input" id="d1-input" type="text" placeholder="Ask anything…" autocomplete="off" maxlength="300">
        <button class="d1-chat-send" id="d1-send" aria-label="Send">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
  `);

  const btn     = document.getElementById('d1-chat-btn');
  const box     = document.getElementById('d1-chat-box');
  const msgs    = document.getElementById('d1-msgs');
  const input   = document.getElementById('d1-input');
  const sendBtn = document.getElementById('d1-send');
  const chips   = document.getElementById('d1-chips');

  let isOpen = false;
  let greeted = false;

  // ── Toggle ────────────────────────────────────────────────────────────────────
  btn.addEventListener('click', () => {
    isOpen = !isOpen;
    btn.classList.toggle('open', isOpen);
    box.classList.toggle('open', isOpen);
    if (isOpen && !greeted) {
      greeted = true;
      setTimeout(() => {
        botTypeThen(`Hi there 👋 I'm the D1 assistant. Ask me anything about our services, pricing, or process — or I can connect you with a team member directly.`, showMainChips);
      }, 350);
    }
    if (isOpen) setTimeout(() => input.focus(), 280);
  });

  // ── Chips ─────────────────────────────────────────────────────────────────────
  const MAIN_CHIPS = [
    { label: 'Pricing',    msg: 'What are your prices?' },
    { label: 'Services',   msg: 'What services do you offer?' },
    { label: 'Timeline',   msg: 'How long does a project take?' },
    { label: 'Get a quote', msg: '__quote__' },
  ];

  function showMainChips() { setChips(MAIN_CHIPS); }

  function setChips(list) {
    chips.innerHTML = '';
    list.forEach(({ label, msg }) => {
      const c = document.createElement('button');
      c.className = 'd1-chip';
      c.textContent = label;
      c.addEventListener('click', () => {
        chips.innerHTML = '';
        if (msg === '__quote__') { startLeadCapture(); }
        else { handleMessage(msg); }
      });
      chips.appendChild(c);
    });
  }

  // ── Messages ──────────────────────────────────────────────────────────────────
  function addMsg(html, who) {
    const d = document.createElement('div');
    d.className = `d1-msg ${who}`;
    d.innerHTML = who === 'user' ? escHtml(html) : html;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }

  function botTypeThen(html, cb, delay) {
    const t = document.createElement('div');
    t.className = 'd1-typing';
    t.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(t);
    msgs.scrollTop = msgs.scrollHeight;
    const wait = delay || Math.min(500 + html.replace(/<[^>]*>/g,'').length * 6, 1200);
    setTimeout(() => {
      t.remove();
      addMsg(html, 'bot');
      if (cb) cb();
    }, wait);
  }

  function escHtml(t) {
    return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // ── Lead capture ──────────────────────────────────────────────────────────────
  function startLeadCapture() {
    leadState = { step: 'collect_name', name: '', email: '', project: '' };
    chips.innerHTML = '';
    botTypeThen(`I'd love to get you connected with our team! What's your name?`);
  }

  function handleLeadStep(text) {
    if (leadState.step === 'collect_name') {
      leadState.name = text;
      leadState.step = 'collect_email';
      botTypeThen(`Nice to meet you, ${escHtml(text)}! What's your email address?`);
      return true;
    }
    if (leadState.step === 'collect_email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
        botTypeThen(`Hmm, that doesn't look right — could you double-check your email?`);
        return true;
      }
      leadState.email = text;
      leadState.step = 'collect_project';
      botTypeThen(`Got it! Briefly — what kind of project are you thinking about?`);
      return true;
    }
    if (leadState.step === 'collect_project') {
      leadState.project = text;
      leadState.step = 'done';
      submitLead(leadState.name, leadState.email, leadState.project);
      botTypeThen(
        `Thanks, ${escHtml(leadState.name)}! A team member will be in touch within 24 hours 🙌<br><br>In the meantime, feel free to keep asking me anything.`,
        showMainChips
      );
      return true;
    }
    return false;
  }

  // ── Main handler ──────────────────────────────────────────────────────────────
  function handleMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    addMsg(trimmed, 'user');
    input.value = '';
    chips.innerHTML = '';

    // Lead capture flow
    if (leadState.step !== 'idle' && leadState.step !== 'done') {
      handleLeadStep(trimmed);
      return;
    }

    // Direct quote/contact intent
    if (/\bquote\b|get started|reach out|talk to someone|connect me|leave my info/i.test(trimmed)) {
      startLeadCapture();
      return;
    }

    // Match KB
    const lower = trimmed.toLowerCase();
    const match = KB.find(k => k.patterns.some(p => lower.includes(p)));

    if (match) {
      lastAnswer = match;
      botTypeThen(match.answer, () => {
        if (match.chips && match.chips.length) {
          setChips(match.chips);
        } else {
          setChips([
            { label: 'Get a quote', msg: '__quote__' },
            { label: 'Something else', msg: 'what else can you help with' },
          ]);
        }
      });
      return;
    }

    // "What else can you help with"
    if (/what else|other services|anything else|more info/i.test(lower)) {
      botTypeThen(`Here's everything we can help with:<br><br>
🌐 Business Websites · 🤖 AI Agents · 🛒 E-commerce<br>
⚡ Speed & SEO · 🔗 Automation · 📊 Analytics<br><br>
What sounds most relevant to you?`, showMainChips);
      return;
    }

    // Greetings
    if (/^(hi|hello|hey|yo|sup|howdy|good morning|good afternoon|good evening)[\s!.,?]*$/i.test(trimmed)) {
      botTypeThen(`Hey! 👋 How can I help you today?`, showMainChips, 400);
      return;
    }

    // Fallback
    botTypeThen(
      `Great question — I want to make sure you get the right answer. Our team can help with that directly.<br><br>Want me to connect you?`,
      () => setChips([
        { label: 'Yes, connect me', msg: '__quote__' },
        { label: 'Ask something else', msg: 'what else can you help with' },
      ])
    );
  }

  input.addEventListener('keydown', e => { if (e.key === 'Enter') handleMessage(input.value); });
  sendBtn.addEventListener('click', () => handleMessage(input.value));

  // ── Submit lead ───────────────────────────────────────────────────────────────
  async function submitLead(name, email, project) {
    try {
      const fd = new FormData();
      fd.append('access_key', WEB3FORMS_KEY);
      fd.append('subject', `New lead from D1 chat — ${name}`);
      fd.append('from_name', 'D1 Chat Widget');
      fd.append('name', name);
      fd.append('email', email);
      fd.append('message', project);
      await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd });
    } catch (_) {}
  }

})();
