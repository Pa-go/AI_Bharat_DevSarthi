"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import {
  Code2, Globe, ChevronRight, ArrowRight,
  Sparkles, Zap, Github, Youtube,
  FileSearch, Cpu, Columns3, LayoutDashboard,
  ShieldCheck, Database, Cloud, HardDrive, 
  WifiOff, BookText, Video, Map, Languages,
  Target, Rocket, Layers, Check, CreditCard,
  FileText, Share2, Terminal, BookOpen
} from "lucide-react";

const translations = {
  en: {
    navHome: "Home", navFeatures: "Tech Stack", navVault: "The Vault", navPricing: "Cost Strategy", navAbout: "About",
    heroTag: "BHARAT'S VERNACULAR AI MISSION",
    heroTitle: "Empowering Bharat's Students,",
    heroTitleGrad: "in Your Mother Tongue.",
    heroSub: "The all-in-one vernacular workspace powered by Amazon Bedrock. Optimized for Mumbai University students.",
    getStarted: "Get Started (Demo Access)", signIn: "Sign In", 
    journeyTitle: "The AWS Journey",
    journeySub: "Built for Bharat-scale with Serverless Efficiency.",
    adaptiveTitle: "Adaptive 3-Panel Mastery",
    adaptiveDesc: "Stop switching tabs. Our fluid 3-panel environment—Context, Reasoning, and Vault—breaks the language barrier. Analyze MU PDFs or debug code with AI tutoring in Marathi, Hindi, and 22+ official Indian languages.",
    vaultTitle: "The Vault: Academic RAG",
    vaultDesc: "Powered by Amazon S3 and Bedrock, the Vault turns static syllabus PDFs into interactive personal tutors. Real-time tutoring that understands your mother tongue.",
    aboutTitle: "Our Mission for Bharat",
    aboutDesc: "DevSathi bridges the digital divide for students across Bharat. By combining AWS Generative AI with native regional language logic, we are democratizing technical education for every student.",
    impact1Title: "Bridging the Vernacular Gap",
    impact1Desc: "Converting English-heavy technical curriculum into native logic for better conceptual clarity and faster learning.",
    impact2Title: "Tier-2/3 Empowerment",
    impact2Desc: "Bringing Mumbai-standard AI tutoring to students who lack access to expensive coaching or high-end resources.",
    impact3Title: "NEP 2020 Alignment",
    impact3Desc: "Built to support the government's vision of technical education in regional languages through scalable AI.",
    pricingTitle: "Zero-Entry Strategy",
    pricingSub: "AWS-First Implementation for Maximum Cost Efficiency.",
    footerTag: "Empowering the next generation of IT professionals in Bharat.",
    resources: "Resources", demoVideo: "Demo Video", architecture: "AWS Architecture", techDocs: "Technical Docs"
  },
  mr: {
    navHome: "मुख्यपृष्ठ", navFeatures: "टेक स्टॅक", navVault: "व्हॉल्ट", navPricing: "किंमत धोरण", navAbout: "बद्दल",
    heroTag: "भारताचे प्रादेशिक AI अभियान",
    heroTitle: "भारतातील विद्यार्थ्यांना सक्षम करणे,",
    heroTitleGrad: "तुमच्या मातृभाषेत.",
    heroSub: "Amazon Bedrock द्वारे समर्थित पहिले प्रादेशिक वर्कस्पेस. मुंबई विद्यापीठाच्या विद्यार्थ्यांसाठी विशेषतः डिझाइन केलेले.",
    getStarted: "सुरुवात करा (डेमो)", signIn: "प्रवेश करा", 
    adaptiveTitle: "अडॅप्टिव्ह ३-पॅनेल मास्टरी",
    adaptiveDesc: "टॅब बदलणे थांबवा. आमचे ३-पॅनेल वातावरण भाषेचा अडथळा दूर करते. मराठी, हिंदी आणि २२+ भारतीय भाषांमध्ये मार्गदर्शन मिळवा.",
    vaultTitle: "व्हॉल्ट: शैक्षणिक RAG",
    vaultDesc: "S3 आणि Bedrock द्वारे समर्थित, हा व्हॉल्ट तुमच्या सिलॅबसला एका वैयक्तिक ट्यूटरमध्ये रूपांतरित करतो जो तुमच्या भाषेत बोलतो.",
    aboutTitle: "भारतासाठी आमचे ध्येय",
    aboutDesc: "प्रादेशिक भाषा समर्थनासह AWS GenAI ला जोडून, आम्ही भारतातील प्रत्येक विद्यार्थ्यासाठी तांत्रिक शिक्षण सुलभ करत आहोत.",
    impact1Title: "प्रादेशिक भाषेतील शिक्षण",
    impact1Desc: "इंग्रजी तांत्रिक अभ्यासक्रम स्थानिक भाषेत समजून घेण्यास मदत करणे.",
    impact2Title: "ग्रामीण सक्षमीकरण",
    impact2Desc: "दुर्गम भागातील विद्यार्थ्यांना जागतिक दर्जाचे AI मार्गदर्शन उपलब्ध करून देणे.",
    impact3Title: "NEP २०२० सुसंगतता",
    impact3Desc: "प्रादेशिक भाषेतून तांत्रिक शिक्षण देण्याच्या सरकारच्या व्हिजनला पाठिंबा देणे.",
    pricingTitle: "झिरो-एंट्री स्ट्रॅटेजी",
    pricingSub: "जास्तीत जास्त खर्च कार्यक्षमतेसाठी AWS-First अंमलबजावणी.",
    footerTag: "भारतातील आयटी व्यावसायिकांच्या पुढच्या पिढीला सक्षम करणे.",
    resources: "संसाधने", demoVideo: "डेमो व्हिडिओ", architecture: "AWS आर्किटेक्चर", techDocs: "तांत्रिक दस्तऐवज"
  },
  hi: {
    navHome: "होम", navFeatures: "टेक स्टैक", navVault: "वॉल्ट", navPricing: "लागत रणनीति", navAbout: "परिचय",
    heroTag: "भारत का क्षेत्रीय AI मिशन",
    heroTitle: "भारत के छात्रों को सशक्त बनाना,",
    heroTitleGrad: "अपनी मातृभाषा में।",
    heroSub: "Amazon Bedrock द्वारा संचालित ऑल-इन-वन क्षेत्रीय वर्कस्पेस। मुंबई विश्वविद्यालय के छात्रों के लिए विशेष रूप से निर्मित।",
    getStarted: "शुरू करें (डेमो)", signIn: "साइन इन करें", 
    adaptiveTitle: "अडॅप्टिव्ह 3-पैनल मास्टरी",
    adaptiveDesc: "टैब बदलना बंद करें। हमारा 3-पैनल वातावरण भाषा की बाधा को तोड़ता है। मराठी, हिंदी और 22+ भारतीय भाषाओं में ट्यूशन प्राप्त करें।",
    vaultTitle: "वॉल्ट: शैक्षणिक RAG",
    vaultDesc: "S3 और Bedrock द्वारा संचालित, यह वॉल्ट आपके सिलेबस को एक व्यक्तिगत ट्यूटर में बदल देता है जो आपकी अपनी भाषा समझता है।",
    aboutTitle: "भारत के लिए हमारा लक्ष्य",
    aboutDesc: "क्षेत्रीय भाषा समर्थन के साथ AWS GenAI को जोड़कर, हम भारत के हर छात्र के लिए तकनीकी शिक्षा का लोकतंत्रीकरण कर रहे हैं।",
    impact1Title: "क्षेत्रीय भाषा सेतु",
    impact1Desc: "कठिन अंग्रेजी तकनीकी पाठ्यक्रम को सरल क्षेत्रीय भाषा में परिवर्तित करना।",
    impact2Title: "छात्र सशक्तिकरण",
    impact2Desc: "Tier-2 और Tier-3 शहरों के छात्रों को विश्व स्तरीय AI ट्यूशन प्रदान करना।",
    impact3Title: "NEP 2020 का समर्थन",
    impact3Desc: "क्षेत्रीय भाषाओं में तकनीकी शिक्षा को बढ़ावा देने की सरकारी पहल का समर्थन करना।",
    pricingTitle: "जीरो-एंट्री रणनीति",
    pricingSub: "अधिकतम लागत दक्षता के लिए AWS-First कार्यान्वयन।",
    footerTag: "भारत के आईटी पेशेवरों की अगली पीढ़ी को सशक्त बनाना।",
    resources: "संसाधन", demoVideo: "डेमो वीडियो", architecture: "AWS आर्किटेक्चर", techDocs: "तकनीकी दस्तावेज़"
  }
};

const C = {
  bg0: "#020617", bg1: "#0f172a", bg2: "#1e293b",
  blue: "#6366f1", purple: "#7c3aed",
  grad: "linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)",
  gradSoft: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(124,58,237,0.15) 100%)",
  border: "#1e293b",
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');
  html { scroll-behavior: smooth; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; overflow-x: hidden; margin:0; padding:0; }
  .ds-btn {
    background: ${C.grad}; color: #fff !important; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 10px; border: none; cursor: pointer;
    display: inline-flex; align-items: center; gap: 8px; transition: 0.2s; text-decoration: none;
  }
  .ds-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(99,102,241,0.4); }
  .nav-link { color: inherit; text-decoration: none; font-size: 14px; font-weight: 600; opacity: 0.7; transition: 0.2s; }
  .nav-link:hover { opacity: 1; color: ${C.blue}; }
  .aws-card:hover { border-color: ${C.blue}; transform: translateY(-5px); box-shadow: 0 10px 30px rgba(99,102,241,0.1); }
`;

function Header({ t, locale, isDarkMode, setIsDarkMode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleLangChange = (e) => {
    const newLocale = e.target.value;
    localStorage.setItem("sathi_lang", newLocale); // Persist lang
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <header style={{ 
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 75, 
      background: isDarkMode ? (scrolled ? "rgba(2,6,23,0.85)" : "transparent") : (scrolled ? "rgba(255,255,255,0.9)" : "transparent"),
      backdropFilter: scrolled ? "blur(20px)" : "none", 
      borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, 
      display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", transition: "0.3s" 
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: C.grad, display: "flex", alignItems: "center", justifyContent: "center" }}><Code2 size={20} color="white" /></div>
        <div style={{ lineHeight: 1 }}>
          <div style={{ fontSize: 19, fontWeight: 800 }}>DevSathi</div>
          <div style={{ fontSize: 9, color: C.blue, fontWeight: "700", textTransform: "uppercase" }}>Empowering Bharat</div>
        </div>
      </div>
      <nav style={{ display: "flex", gap: 32 }}>
        <a href="#hero" className="nav-link">{t.navHome}</a>
        <a href="#features" className="nav-link">{t.navFeatures}</a>
        <a href="#vault" className="nav-link">{t.navVault}</a>
        <a href="#pricing" className="nav-link">{t.navPricing}</a>
        <a href="#about" className="nav-link">{t.navAbout}</a>
      </nav>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <Zap size={20} fill={isDarkMode ? "#fbbf24" : "none"} color={isDarkMode ? "#fbbf24" : "#64748b"} />
        </button>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <Globe size={16} style={{ position: "absolute", left: 10, color: C.blue }} />
          <select value={locale} onChange={handleLangChange} style={{ background: isDarkMode ? "#1e293b" : "#f1f5f9", color: "inherit", border: "none", padding: "6px 12px 6px 34px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", appearance: "none", cursor: "pointer" }}>
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="mr">मराठी (Marathi)</option>
          </select>
        </div>
        <button onClick={() => router.push(`/${locale}/signup`)} className="ds-btn">{t.signIn} <ArrowRight size={16} /> </button>
      </div>
    </header>
  );
}

export default function HomePage() {
  const params = useParams();
  const locale = params?.locale ?? "en";
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const t = translations[locale] || translations.en;

  useEffect(() => { 
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = C.bg0;
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = "#ffffff";
    }
  }, [isDarkMode]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <div style={{ background: isDarkMode ? C.bg0 : "#ffffff", color: isDarkMode ? "white" : "#020617", transition: "0.4s" }}>
        <Header t={t} locale={locale} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "140px 24px 80px" }}>
          <div style={{ textAlign: "center", maxWidth: 1100 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", background: C.gradSoft, borderRadius: 99, color: C.blue, fontSize: 12, fontWeight: 700, marginBottom: 24 }}><Sparkles size={14} /> {t.heroTag}</div>
            <h1 style={{ fontSize: "clamp(44px, 8vw, 76px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>{t.heroTitle} <br /><span style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t.heroTitleGrad}</span></h1>
            <p style={{ fontSize: 20, opacity: 0.7, maxWidth: 650, margin: "0 auto 48px" }}>{t.heroSub}</p>
            <button 
              onClick={() => {
                localStorage.setItem("user_authenticated", "true"); 
                localStorage.setItem("sathi_lang", locale);
                const demoUser = { name: "Priya", email: "judge@mu.edu", initials: "P", isDemo: true };
                localStorage.setItem("devSathiUser", JSON.stringify(demoUser));
                router.push(`/${locale}/dashboard`);
              }} 
              className="ds-btn" 
              style={{ padding: "18px 48px", fontSize: 18, marginBottom: 80 }}
            >
              {t.getStarted} <ChevronRight size={22} />
            </button>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 60, alignItems: "center", textAlign: "left", background: isDarkMode ? "#0f172a" : "#f8fafc", padding: 40, borderRadius: 32, border: `1px solid ${C.border}` }}>
               <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", border: `1px solid ${C.border}`, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
                  <div style={{ height: 300, background: C.bg0, display: "flex", padding: 10, gap: 10 }}>
                     <div style={{ flex: 1, background: "#1e293b", borderRadius: 8 }}></div>
                     <div style={{ flex: 1.5, background: C.grad, borderRadius: 8, opacity: 0.3 }}></div>
                     <div style={{ flex: 1, background: "#1e293b", borderRadius: 8 }}></div>
                  </div>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}><Columns3 size={48} color="white" /></div>
               </div>
               <div>
                  <h3 style={{ fontSize: 32, fontWeight: 800, marginBottom: 20 }}>{t.adaptiveTitle}</h3>
                  <p style={{ fontSize: 17, opacity: 0.7, lineHeight: 1.8 }}>{t.adaptiveDesc}</p>
               </div>
            </div>
          </div>
        </section>
        {/* ... (Features, Vault, Pricing Sections truncated for space, identical to yours) ... */}
        <footer style={{ padding: "80px 40px 40px", background: isDarkMode ? C.bg1 : "#f1f5f9", borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
          <p style={{ fontSize: 13, opacity: 0.5 }}>Handcrafted for Bharat’s Digital Future ✦ 2026. Powered by Amazon Bedrock.</p>
        </footer>
      </div>
    </>
  );
}