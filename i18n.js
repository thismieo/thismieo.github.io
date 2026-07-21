(() => {
  "use strict";

  const arabic = new Map([
    ["Skip to content", "تخطَّ إلى المحتوى"],
    ["Welcome", "مرحباً"],
    ["About", "نبذة"],
    ["Journey", "المسيرة"],
    ["Projects", "المشاريع"],
    ["Contact", "تواصل"],
    ["Hello, I’m", "مرحباً، أنا"],
    ["AI Engineering Student", "طالب هندسة الذكاء الاصطناعي"],
    ["Building the future with code & intelligence.", "نبني المستقبل بالبرمجة والذكاء."],
    ["I’m learning Python, machine learning, and modern AI technologies while building practical projects step by step.", "أتعلّم بايثون وتعلّم الآلة وتقنيات الذكاء الاصطناعي الحديثة، وأبني مشاريع عملية خطوة بعد خطوة."],
    ["Explore My Journey", "استكشف مسيرتي"],
    ["View My Projects", "شاهد مشاريعي"],
    ["About me", "نبذة عني"],
    ["Learning with purpose.", "أتعلّم بهدف."],
    ["Building with patience.", "وأبني بصبر."],
    ["I’m an AI Engineering student based in Baghdad, Iraq. Alongside my studies, I work in the private sector while building a strong foundation in Python, machine learning, and modern AI technologies, with the goal of creating intelligent projects and systems that benefit society and make a positive impact on the world.", "أنا طالب هندسة ذكاء اصطناعي من بغداد، العراق. أعمل إلى جانب دراستي في القطاع الخاص، وأبني أساساً قوياً في بايثون وتعلّم الآلة وتقنيات الذكاء الاصطناعي الحديثة، بهدف تطوير مشاريع وأنظمة ذكية تخدم المجتمع وتصنع أثراً إيجابياً في العالم."],
    ["I believe meaningful progress is built step by step through learning, practice, and real projects.", "أؤمن أن التقدّم الحقيقي يُبنى خطوة بعد خطوة، من خلال التعلّم والممارسة والمشاريع الواقعية."],
    ["Based in", "الموقع"],
    ["Baghdad, Iraq", "بغداد، العراق"],
    ["Work sector", "قطاع العمل"],
    ["Private Sector", "القطاع الخاص"],
    ["Current focus", "التركيز الحالي"],
    ["Python & AI Fundamentals", "بايثون وأساسيات الذكاء الاصطناعي"],
    ["Learning path", "مسار التعلّم"],
    ["AI Engineering", "هندسة الذكاء الاصطناعي"],
    ["My journey", "مسيرتي"],
    ["From foundations to intelligent systems.", "من الأساسيات إلى الأنظمة الذكية."],
    ["Each stage builds the foundation for the next.", "كل مرحلة تمهّد الطريق للمرحلة التالية."],
    ["Currently learning", "أتعلّمه حالياً"],
    ["Python Programming & OOP", "برمجة بايثون والبرمجة كائنية التوجّه"],
    ["Learning Python fundamentals, functions, data structures, classes, and objects.", "تعلّم أساسيات بايثون والدوال وهياكل البيانات والفئات والكائنات."],
    ["Next step", "الخطوة التالية"],
    ["Data Analysis & Python Libraries", "تحليل البيانات ومكتبات بايثون"],
    ["Exploring NumPy, Pandas, data cleaning, preprocessing, and clear visualization.", "استكشاف NumPy وPandas وتنظيف البيانات ومعالجتها المسبقة وعرضها بوضوح."],
    ["Upcoming", "قادم"],
    ["Machine Learning & Predictive Modeling", "تعلّم الآلة والنمذجة التنبؤية"],
    ["Understanding classification, regression, model training, and evaluation.", "فهم التصنيف والانحدار وتدريب النماذج وتقييمها."],
    ["Future direction", "توجّه مستقبلي"],
    ["Deep Learning & Neural Networks", "التعلّم العميق والشبكات العصبية"],
    ["Exploring neural networks, hidden layers, and computer vision foundations.", "استكشاف الشبكات العصبية والطبقات المخفية وأساسيات الرؤية الحاسوبية."],
    ["Advanced direction", "توجّه متقدّم"],
    ["NLP, LLMs, RAG & AI Agents", "معالجة اللغة والنماذج اللغوية وRAG والوكلاء الأذكياء"],
    ["Learning language processing, knowledge retrieval, and intelligent agent systems.", "تعلّم معالجة اللغة واسترجاع المعرفة وأنظمة الوكلاء الأذكياء."],
    ["Applied learning archive", "سجل التعلّم التطبيقي"],
    ["The Workshop", "الورشة"],
    ["Where learning becomes practice.", "حيث يتحوّل التعلّم إلى ممارسة."],
    ["Enter the workshop", "ادخل الورشة"],
    ["Project roadmap", "خارطة المشاريع"],
    ["Learning by building.", "أتعلّم من خلال البناء."],
    ["Future projects shaped by each stage of the journey.", "مشاريع مستقبلية تتشكّل مع كل مرحلة من المسيرة."],
    ["Next project", "المشروع القادم"],
    ["Machine learning · Classification", "تعلّم الآلة · تصنيف"],
    ["Heart Disease", "أمراض القلب"],
    ["Prediction", "التنبؤ"],
    ["Preparing patient health data and training a classification model to recognize patterns associated with possible heart disease.", "تهيئة بيانات المرضى الصحية وتدريب نموذج تصنيف للتعرّف على الأنماط المرتبطة باحتمال الإصابة بأمراض القلب."],
    ["Planned", "مخطط له"],
    ["Machine learning · Predictive modeling", "تعلّم الآلة · نمذجة تنبؤية"],
    ["House Price Prediction", "التنبؤ بأسعار المنازل"],
    ["A predictive model that learns from property features to estimate or classify house prices.", "نموذج تنبؤي يتعلّم من خصائص العقارات لتقدير أسعار المنازل أو تصنيفها."],
    ["Computer vision · Deep learning", "رؤية حاسوبية · تعلّم عميق"],
    ["Smart City Violation Detection", "رصد مخالفات المدينة الذكية"],
    ["A future vision system designed to identify traffic violations from street and camera footage.", "نظام رؤية مستقبلي مصمم لاكتشاف المخالفات المرورية من تسجيلات الشوارع والكاميرات."],
    ["Machine learning · Anomaly detection", "تعلّم الآلة · اكتشاف الحالات الشاذة"],
    ["Financial Fraud Detection", "اكتشاف الاحتيال المالي"],
    ["A future machine learning system designed to recognize suspicious patterns in financial transactions.", "نظام مستقبلي لتعلّم الآلة مصمم للتعرّف على الأنماط المشبوهة في المعاملات المالية."],
    ["Advanced goal", "هدف متقدّم"],
    ["Generative AI", "الذكاء الاصطناعي التوليدي"],
    ["Multilingual Knowledge Assistant", "مساعد معرفي ذكي متعدد اللغات"],
    ["An advanced multilingual assistant designed to retrieve trusted knowledge, answer questions across languages, and evolve into a personal AI agent.", "مساعد معرفي متعدد اللغات يسترجع المعرفة الموثوقة ويجيب عن الأسئلة بلغات مختلفة، ويمكن تخصيصه كوكيل ذكي للأفراد أو تطويره كحل معرفي للشركات والمؤسسات."],
    ["Let’s connect", "لنتواصل"],
    ["Good conversations", "الأحاديث الجميلة"],
    ["can start anywhere.", "قد تبدأ من أي مكان."],
    ["I’m always open to learning, sharing ideas, and connecting with people interested in technology and AI.", "أرحب دائماً بالتعلّم وتبادل الأفكار والتواصل مع المهتمين بالتقنية والذكاء الاصطناعي."],
    ["Personal email", "البريد الشخصي"],
    ["Public email", "البريد العام"],
    ["GitHub projects", "مشاريع GitHub"],
    ["A note for visitors", "رسالة للزوار"],
    ["Thank you for being here.", "شكراً لوجودك هنا."],
    ["This is where I document what I learn, build, and improve: one concept and one project at a time. I hope it grows into a home for my work, future projects, and meaningful collaborations with people, companies, and organizations in Iraq and around the world. Enjoy the journey, and come back to see what is built next.", "هنا أوثّق ما أتعلّمه وما أبنيه وأطوّره، مفهوماً بعد مفهوم ومشروعاً بعد آخر. أطمح أن تصبح هذه المساحة موطناً لأعمالي ومشاريعي المستقبلية وتعاونات هادفة مع الأفراد والشركات والمؤسسات داخل العراق وحول العالم. استمتع بالمسيرة، وعُد لترى ما سيُبنى لاحقاً."],
    ["Built with curiosity", "بُني بفضول"],
    ["Growing with purpose.", "وينمو بهدف."],
    ["Back to portfolio", "العودة إلى الموقع"],
    ["Knowledge", "المعرفة"],
    ["in progress.", "قيد التطوّر."],
    ["A focused record of what I learn, apply, and build as each concept becomes practical experience.", "سجل مركز لما أتعلّمه وأطبّقه وأبنيه، بينما يتحوّل كل مفهوم إلى خبرة عملية."],
    ["Understood", "مفهوم"],
    ["Applied", "مطبّق"],
    ["Foundation", "الأساسيات"],
    ["Concepts that shape the path.", "مفاهيم ترسم ملامح الطريق."],
    ["AI Foundations", "أساسيات الذكاء الاصطناعي"],
    ["AI types, supervised learning, features, labels, classification, regression, and the role of data.", "أنواع الذكاء الاصطناعي والتعلّم الموجّه والخصائص والتصنيفات والانحدار ودور البيانات."],
    ["Data Foundations", "أساسيات البيانات"],
    ["Structured and unstructured data, collection, labeling, quality, missing values, and cleaning.", "البيانات المنظمة وغير المنظمة وجمعها وتصنيفها وجودتها وقيمها المفقودة وتنظيفها."],
    ["Algorithms", "الخوارزميات"],
    ["Inputs, processing, outputs, pseudocode, flowcharts, efficiency, and an introduction to Big O.", "المدخلات والمعالجة والمخرجات والشيفرة الزائفة والمخططات الانسيابية والكفاءة ومقدمة في Big O."],
    ["LLMs & Chatbots", "النماذج اللغوية وروبوتات المحادثة"],
    ["Tokens, context windows, temporary memory, hallucinations, bias, limitations, and tool support.", "التوكنات ونوافذ السياق والذاكرة المؤقتة والهلوسة والتحيز والقيود ودعم الأدوات."],
    ["Applied practice", "الممارسة التطبيقية"],
    ["Knowledge used in real workflows.", "معرفة تُستخدم في مسارات عمل حقيقية."],
    ["Prompt Engineering", "هندسة الأوامر"],
    ["Using clear instructions, roles, context, examples, and structured reasoning to guide AI tools toward accurate and useful results.", "استخدام تعليمات وأدوار وسياق وأمثلة واستدلال منظم لتوجيه أدوات الذكاء الاصطناعي نحو نتائج دقيقة ومفيدة."],
    ["AI Automation", "أتمتة الذكاء الاصطناعي"],
    ["Building connected workflows that move information between AI tools, computers, and applications to complete practical tasks.", "بناء مسارات عمل مترابطة تنقل المعلومات بين أدوات الذكاء الاصطناعي والحاسوب والتطبيقات لإنجاز مهام عملية."],
    ["Generative AI Media", "وسائط الذكاء الاصطناعي التوليدي"],
    ["Creating and refining images, videos, and other digital media with AI tools through clear prompting, thoughtful iteration, and careful quality review.", "إنشاء الصور ومقاطع الفيديو والوسائط الرقمية الأخرى وتحسينها بأدوات الذكاء الاصطناعي، من خلال أوامر واضحة وتطوير مدروس ومراجعة دقيقة للجودة."],
    ["Current track", "المسار الحالي"],
    ["Python, one practical step at a time.", "بايثون، خطوة عملية في كل مرة."],
    ["Python Programming", "برمجة بايثون"],
    ["A practical path through Python fundamentals, focused on steady progress, hands-on practice, and building clear programming solutions.", "مسار عملي لتعلّم أساسيات بايثون وتطوير المهارات تدريجياً من خلال الشرح والتطبيق وبناء حلول برمجية واضحة."],
    ["Syntax & indentation", "الصياغة والمسافات البادئة"],
    ["Variables & data types", "المتغيرات وأنواع البيانات"],
    ["Lists, tuples, sets & dictionaries", "القوائم والصفوف والمجموعات والقواميس"],
    ["Operators & user input", "المعاملات ومدخلات المستخدم"],
    ["Return to portfolio", "العودة إلى الموقع"]
  ]);

  const originals = new WeakMap();
  const originalAttributes = new WeakMap();
  const translatedAttributes = [
    [".skip-link", "aria-label", "تخطَّ إلى المحتوى"],
    [".wordmark", "aria-label", "مرحباً، الصفحة الرئيسية"],
    [".site-nav", "aria-label", "التنقل الرئيسي"],
    ["#main-content", "aria-label", "الملف الشخصي"],
    [".portrait-frame img", "alt", "صورة محمد مؤيد"],
    ["[data-close-workshop][aria-label]", "aria-label", "العودة إلى الموقع"],
    ["[data-back-to-top]", "aria-label", "العودة إلى الأعلى"],
    ["[data-back-to-top]", "title", "العودة إلى الأعلى"],
    [".workshop-status", "aria-label", "دليل حالة التعلّم"]
  ];

  const textNodes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(node.parentElement?.tagName)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  while (walker.nextNode()) {
    const node = walker.currentNode;
    originals.set(node, node.nodeValue);
    textNodes.push(node);
  }

  const replaceText = (node, language) => {
    const original = originals.get(node);
    if (language === "en") {
      node.nodeValue = original;
      return;
    }
    const clean = original.trim();
    const translated = arabic.get(clean);
    if (!translated) return;
    node.nodeValue = original.replace(clean, translated);
  };

  const updateMetadata = (language) => {
    const values = language === "ar" ? {
      title: "محمد مؤيد | هندسة الذكاء الاصطناعي والتطبيقات العملية",
      description: "محمد مؤيد، طالب هندسة ذكاء اصطناعي يوثّق رحلته في الذكاء الاصطناعي التطبيقي والأتمتة وبايثون وتعلّم الآلة.",
      social: "نبني المستقبل بالبرمجة والذكاء. تابع رحلة حقيقية في الذكاء الاصطناعي التطبيقي والأتمتة والأنظمة الذكية."
    } : {
      title: "Mohammed Muayad | AI Engineering & Applied AI",
      description: "Mohammed Muayad is an AI Engineering student documenting applied AI, automation, Python, machine learning, and projects built step by step.",
      social: "Building the future with code & intelligence. Follow a real journey through applied AI, automation, and intelligent systems."
    };
    document.title = values.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", values.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", values.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", values.social);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", values.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", values.social);
  };

  const applyLanguage = (language) => {
    const selected = language === "ar" ? "ar" : "en";
    document.documentElement.lang = selected;
    document.documentElement.dir = selected === "ar" ? "rtl" : "ltr";
    document.body.classList.toggle("lang-ar", selected === "ar");
    textNodes.forEach((node) => replaceText(node, selected));

    translatedAttributes.forEach(([selector, attribute, value]) => {
      document.querySelectorAll(selector).forEach((element) => {
        if (!originalAttributes.has(element)) originalAttributes.set(element, new Map());
        const attributes = originalAttributes.get(element);
        if (!attributes.has(attribute)) attributes.set(attribute, element.getAttribute(attribute) || "");
        element.setAttribute(attribute, selected === "ar" ? value : attributes.get(attribute));
      });
    });

    const toggle = document.querySelector("[data-language-toggle]");
    if (toggle) {
      toggle.textContent = selected === "ar" ? "EN" : "AR";
      const label = selected === "ar" ? "Switch to English" : "Switch to Arabic";
      toggle.setAttribute("aria-label", label);
      toggle.setAttribute("title", label);
    }

    updateMetadata(selected);
    window.dispatchEvent(new CustomEvent("portfolio:languagechange", { detail: { language: selected } }));
  };

  // Every fresh visit starts in English; Arabic remains an on-demand view.
  applyLanguage("en");

  const toggle = document.querySelector("[data-language-toggle]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let languageIsChanging = false;

  toggle?.addEventListener("click", async () => {
    if (languageIsChanging) return;
    const nextLanguage = document.documentElement.lang === "ar" ? "en" : "ar";
    if (reduceMotion) {
      applyLanguage(nextLanguage);
      return;
    }

    languageIsChanging = true;
    toggle.disabled = true;
    document.body.classList.add("language-is-changing");
    await new Promise((resolve) => window.setTimeout(resolve, 170));
    applyLanguage(nextLanguage);
    await new Promise((resolve) => window.setTimeout(resolve, 45));
    document.body.classList.remove("language-is-changing");
    await new Promise((resolve) => window.setTimeout(resolve, 190));
    toggle.disabled = false;
    languageIsChanging = false;
  });

  window.PortfolioI18n = { applyLanguage };
})();
