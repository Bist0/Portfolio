import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";

// ── EMAILJS CONFIG — replace with your real IDs from emailjs.com ──
const EMAILJS_SERVICE_ID = "service_1vnleou";
const EMAILJS_TEMPLATE_ID = "template_6193sjz";
const EMAILJS_PUBLIC_KEY = "wYcOGuCVpoyNGoPQR";

import PHOTO from "./assets/ishwor.jpg";

const SKILLS = [
  { name: "React / Next.js", pct: 93, icon: "⚛️" },
  { name: "JavaScript / TypeScript", pct: 90, icon: "🟨" },
  { name: "Node.js / Express", pct: 85, icon: "🟢" },
  { name: "HTML & CSS / Tailwind", pct: 95, icon: "🎨" },
  { name: "MongoDB / PostgreSQL", pct: 78, icon: "🗄️" },
  { name: "Git / Docker / CI-CD", pct: 75, icon: "🛠️" },
];

const EDUCATION = [
  {
    degree: "Bachelor of Computer Applications (BCA)",
    school: "New Summit College, Tribhuvan University",
    period: "2023 – Running",
    running: true,
    desc: "Currently pursuing BCA — diving deep into software development, web technologies, database systems, and computer science fundamentals.",
    icon: "🎓",
  },
  {
    degree: "+2 Management",
    school: "Sudur Pashchimanchal Academy",
    period: "Completed",
    running: false,
    desc: "Completed higher secondary education with a focus on Management, Business Studies, and core academic subjects.",
    icon: "📚",
  },
];

const PROJECTS = [
  { title: "NovaMart", desc: "Full-stack e-commerce with real-time inventory, Stripe payments & admin dashboard.", tags: ["Next.js", "Node.js", "MongoDB", "Stripe"], color: "#00ffe7" },
  { title: "GuideWay", desc: "Tourist management system for discovering destinations, booking local guides & planning trips seamlessly.", tags: ["React", "Node.js", "MongoDB"], color: "#ff2d78" },
  { title: "AuraUI", desc: "Open-source React component library with 40+ accessible, animated components.", tags: ["React", "TypeScript", "Storybook"], color: "#a78bfa" },
  { title: "WeatherSphere", desc: "Beautiful weather app with animated skies, geolocation & 7-day forecasts.", tags: ["React", "OpenWeather API", "Framer"], color: "#fbbf24" },
];

/* ── PARTICLE CANVAS ── */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const ptRef = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const setSize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    setSize();
    const N = Math.min(110, Math.floor(window.innerWidth / 13));
    ptRef.current = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.32, vy: (Math.random() - 0.5) * 0.32,
      r: Math.random() * 1.5 + 0.4, alpha: Math.random() * 0.45 + 0.15,
    }));
    const onMouse = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("resize", setSize);
    window.addEventListener("mousemove", onMouse);
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pts = ptRef.current;
      pts.forEach((p) => {
        const dx = p.x - mouseRef.current.x, dy = p.y - mouseRef.current.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) { p.vx += (dx / d) * 0.07; p.vy += (dy / d) * 0.07; }
        p.vx *= 0.99; p.vy *= 0.99;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,231,${p.alpha})`; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 105) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(0,255,231,${0.1 * (1 - d / 105)})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", setSize); window.removeEventListener("mousemove", onMouse); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 0, opacity: 0.65 }} />;
}

/* ── TYPEWRITER ── */
const WORDS = [
  { label: "Frontend Developer", color: "#00ffe7" },
  { label: "Full-Stack Engineer", color: "#a78bfa" },
  { label: "Creative Developer", color: "#ff2d78" },
];

function Typewriter() {
  const wordRef = useRef(0);
  const charRef = useRef(0);
  const typingRef = useRef(true);
  const [display, setDisplay] = useState("");
  const [color, setColor] = useState(WORDS[0].color);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 530);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let timer;
    function tick() {
      const w = WORDS[wordRef.current];
      const len = w.label.length;
      if (typingRef.current) {
        charRef.current += 1;
        setDisplay(w.label.slice(0, charRef.current));
        setColor(w.color);
        if (charRef.current >= len) {
          typingRef.current = false;
          timer = setTimeout(tick, 1400);
        } else {
          timer = setTimeout(tick, 85 + Math.random() * 40);
        }
      } else {
        charRef.current -= 1;
        setDisplay(w.label.slice(0, charRef.current));
        if (charRef.current <= 0) {
          charRef.current = 0;
          typingRef.current = true;
          wordRef.current = (wordRef.current + 1) % WORDS.length;
          timer = setTimeout(tick, 400);
        } else {
          timer = setTimeout(tick, 40 + Math.random() * 20);
        }
      }
    }
    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", gap: "2px" }}>
      <span style={{ color, fontWeight: 700, letterSpacing: "-.01em", textShadow: `0 0 18px ${color}55`, transition: "color .4s ease" }}>
        {display}
      </span>
      <span style={{ color, opacity: blink ? 1 : 0, fontWeight: 300, fontSize: "1.18em", marginLeft: "1px", transition: "color .4s ease", textShadow: `0 0 8px ${color}` }}>|</span>
    </span>
  );
}

/* ── REVEAL ── */
function Reveal({ children, delay = 0, direction = "up" }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const t = { up: "translateY(36px)", left: "translateX(-36px)", right: "translateX(36px)" };
  return <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : t[direction], transition: `opacity .72s ease ${delay}s, transform .72s ease ${delay}s` }}>{children}</div>;
}

/* ── TILT CARD ── */
function TiltCard({ children, style = {} }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 15;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -15;
    ref.current.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateZ(8px)`;
  };
  const onLeave = () => { ref.current.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)"; };
  return <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ transition: "transform 0.18s ease", ...style }}>{children}</div>;
}

/* ── PHOTO ORB ── */
function PhotoOrb() {
  return (
    <div style={{ position: "relative", width: "300px", height: "300px", flexShrink: 0 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ position: "absolute", inset: `${-i * 22}px`, borderRadius: "50%", border: `1px solid rgba(0,255,231,${.12 - i * .03})`, animation: `pulse-ring ${2.5 + i}s ease-out infinite ${i * .6}s` }} />
      ))}
      <div style={{ position: "absolute", inset: "-30px", borderRadius: "50%", border: "1px dashed rgba(0,255,231,.18)", animation: "spin3d 14s linear infinite", transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", top: "-6px", left: "50%", transform: "translateX(-50%)", width: "12px", height: "12px", borderRadius: "50%", background: "#00ffe7", boxShadow: "0 0 14px #00ffe7, 0 0 28px rgba(0,255,231,.4)" }} />
      </div>
      <div style={{ position: "absolute", inset: "-16px", borderRadius: "50%", border: "1px dashed rgba(167,139,250,.2)", animation: "spin3d 20s linear infinite reverse", transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", bottom: "-5px", left: "50%", transform: "translateX(-50%)", width: "8px", height: "8px", borderRadius: "50%", background: "#a78bfa", boxShadow: "0 0 10px #a78bfa" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", border: "3px solid rgba(0,255,231,.4)", boxShadow: "0 0 40px rgba(0,255,231,.25), 0 0 80px rgba(0,255,231,.1)", animation: "float 6s ease-in-out infinite" }}>
        <img src={PHOTO} alt="Ishwor Bist" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 15%", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at bottom,rgba(5,5,8,.35) 0%,transparent 55%)", pointerEvents: "none" }} />
      </div>
      <div style={{ position: "absolute", bottom: "-4px", left: "50%", transform: "translateX(-50%)", background: "rgba(5,5,8,.92)", border: "1px solid rgba(0,255,231,.35)", borderRadius: "999px", padding: "5px 14px", display: "flex", alignItems: "center", gap: "6px", backdropFilter: "blur(12px)", whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(0,0,0,.5)", zIndex: 10 }}>
        <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#00ffe7", boxShadow: "0 0 8px #00ffe7", animation: "pulse-dot 2s ease-in-out infinite" }} />
        {/* INCREASED: badge text 0.6rem → 0.78rem */}
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "1.06rem", color: "#00ffe7", letterSpacing: ".1em" }}>AVAILABLE FOR WORK</span>
      </div>
    </div>
  );
}

/* ── MAIN APP ── */
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mob, setMob] = useState(false);
  const [active, setActive] = useState("home");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const ids = ["home", "about", "skills", "projects", "education", "experience", "contact"];
    const fn = () => {
      setScrolled(window.scrollY > 50);
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (window.scrollY >= top - 130) { setActive(ids[i]); break; }
      }
    };
    window.addEventListener("scroll", fn);
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const sendEmail = async () => {
    setError("");
    if (!formData.name.trim()) { setError("Please enter your name."); return; }
    if (!formData.email.trim()) { setError("Please enter your email address."); return; }
    if (!isValidEmail(formData.email)) { setError("Please enter a valid email address."); return; }
    if (!formData.message.trim()) { setError("Please enter a message."); return; }

    setSending(true);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name.trim(),
          from_email: formData.email.trim(),
          subject: formData.subject.trim() || "No Subject",
          message: formData.message.trim(),
        },
        EMAILJS_PUBLIC_KEY
      );
      setSent(true);
    } catch (err) {
      console.error("EmailJS error:", err);
      if (err?.status === 401 || err?.status === 403) {
        setError("Email service authentication failed. Please check the API keys.");
      } else if (err?.status === 422) {
        setError("Template error — make sure your EmailJS template variables match.");
      } else {
        setError("Failed to send. Please try again or email me directly at ishworbist99@gmail.com");
      }
    }
    setSending(false);
  };

  const go = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMob(false); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html, body { margin:0 !important; padding:0 !important; width:100%; background:#050508 !important; overflow-x:hidden; }
        #root { margin:0; padding:0; width:100%; background:#050508; }
        html { scroll-behavior:smooth; }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:#050508} ::-webkit-scrollbar-thumb{background:#00ffe7;border-radius:4px}
        ::selection{background:rgba(0,255,231,0.2)}
        .glitch{position:relative;display:inline-block}
        .glitch::before,.glitch::after{content:attr(data-text);position:absolute;left:0;top:0;width:100%;height:100%;background:transparent}
        .glitch::before{color:#ff2d78;animation:glitch1 3.5s infinite;clip-path:polygon(0 20%,100% 20%,100% 40%,0 40%)}
        .glitch::after{color:#00ffe7;animation:glitch2 3.5s infinite;clip-path:polygon(0 60%,100% 60%,100% 80%,0 80%)}
        @keyframes glitch1{0%,90%,100%{transform:translate(0);opacity:0}92%{transform:translate(-3px,1px);opacity:.8}94%{transform:translate(3px,-1px);opacity:.8}96%{transform:translate(-1px,2px);opacity:.8}}
        @keyframes glitch2{0%,90%,100%{transform:translate(0);opacity:0}91%{transform:translate(3px,-2px);opacity:.6}93%{transform:translate(-3px,1px);opacity:.6}95%{transform:translate(2px,2px);opacity:.6}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
        @keyframes spin3d{from{transform:rotateY(0deg) rotateX(15deg)}to{transform:rotateY(360deg) rotateX(15deg)}}
        @keyframes pulse-ring{0%{transform:scale(1);opacity:.4}100%{transform:scale(1.6);opacity:0}}
        @keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.75)}}
        @keyframes scanline{0%{top:-5%}100%{top:105%}}
        @keyframes fadeSlide{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes borderGlow{0%,100%{box-shadow:0 0 10px rgba(0,255,231,.15)}50%{box-shadow:0 0 26px rgba(0,255,231,.45)}}
        @keyframes eduGlow{0%,100%{box-shadow:0 0 10px rgba(167,139,250,.12)}50%{box-shadow:0 0 26px rgba(167,139,250,.35)}}
        @keyframes tagFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}

        /* INCREASED: nav links 0.78rem → 0.92rem */
        .nav-link{cursor:pointer;font-size:1.06rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#64748b;transition:color .2s;position:relative;padding-bottom:3px}
        .nav-link::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:#00ffe7;transition:width .3s}
        .nav-link:hover,.nav-link.active{color:#00ffe7}
        .nav-link:hover::after,.nav-link.active::after{width:100%}

        .skill-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,#00ffe7,#a78bfa);transition:width 1.4s cubic-bezier(.17,.67,.35,1)}
        .proj-card{background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.06);border-radius:20px;padding:1.8rem;position:relative;overflow:hidden;cursor:default;height:100%;transition:border-color .3s,box-shadow .3s}
        .proj-card:hover{border-color:rgba(0,255,231,.25);box-shadow:0 20px 60px rgba(0,0,0,.5)}
        .proj-card::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(0,255,231,.05) 0%,transparent 60%);opacity:0;transition:opacity .3s;pointer-events:none}
        .proj-card:hover::before{opacity:1}
        .edu-card{background:rgba(255,255,255,.025);border:1px solid rgba(167,139,250,.12);border-radius:20px;padding:1.8rem;position:relative;overflow:hidden;transition:border-color .3s,box-shadow .3s}
        .edu-card:hover{border-color:rgba(167,139,250,.3);box-shadow:0 20px 60px rgba(0,0,0,.5)}
        .exp-card{background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.06);border-radius:18px;padding:1.6rem 1.8rem;transition:border-color .3s}
        .exp-card:hover{border-color:rgba(0,255,231,.18)}
        /* INCREASED: input font 0.93rem → 1.05rem */
        .c-input{width:100%;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.22);border-radius:12px;padding:13px 16px;color:#f1f5f9;font-family:'Outfit',sans-serif;font-size:1.2rem;outline:none;transition:border-color .3s,background .3s}
        .c-input:focus{border-color:rgba(0,255,231,.55);background:rgba(255,255,255,.1)}
        .c-input::placeholder{color:#7a9bb5;font-weight:400}
        /* INCREASED: button font 0.85rem → 0.98rem */
        .btn-glow{background:transparent;border:1px solid #00ffe7;color:#00ffe7;border-radius:10px;padding:13px 30px;font-family:'Outfit',sans-serif;font-size:1.12rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;position:relative;overflow:hidden;transition:color .3s,box-shadow .3s}
        .btn-glow::before{content:'';position:absolute;inset:0;background:#00ffe7;transform:scaleX(0);transform-origin:left;transition:transform .3s ease;z-index:0}
        .btn-glow span{position:relative;z-index:1}
        .btn-glow:hover{color:#050508;box-shadow:0 0 28px rgba(0,255,231,.4)}
        .btn-glow:hover::before{transform:scaleX(1)}
        .btn-glow:disabled{opacity:.6;cursor:not-allowed}
        /* INCREASED: ghost button font 0.85rem → 0.98rem */
        .btn-ghost{background:transparent;border:1px solid rgba(255,255,255,.15);color:#94a3b8;border-radius:10px;padding:13px 30px;font-family:'Outfit',sans-serif;font-size:1.12rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;transition:border-color .3s,color .3s}
        .btn-ghost:hover{border-color:rgba(0,255,231,.3);color:#00ffe7}
        .sec{max-width:1100px;margin:0 auto;padding:100px 5%}

        @media(max-width:900px){
          .hero-grid{grid-template-columns:1fr !important;text-align:center}
          .hero-btns{justify-content:center !important}
          .hero-tag{justify-content:center !important}
          .photo-col{display:flex;justify-content:center}
          .about-grid{grid-template-columns:1fr !important;gap:2.5rem !important}
          .contact-grid{grid-template-columns:1fr !important;gap:2.5rem !important}
          .edu-grid{grid-template-columns:1fr !important}
          .desktop-nav{display:none !important}
          .mob-btn{display:flex !important}
          .sec{padding:80px 5%}
          .stat-grid{grid-template-columns:1fr 1fr !important}
          .footer-grid{grid-template-columns:1fr !important;gap:2rem !important}
        }
        @media(max-width:500px){
          .proj-grid{grid-template-columns:1fr !important}
          .skills-grid{grid-template-columns:1fr !important}
        }
      `}</style>

      <div style={{ fontFamily: "'Outfit',sans-serif", background: "#050508", color: "#e2e8f0", minHeight: "100vh", width: "100%", margin: 0, padding: 0, overflowX: "hidden", position: "relative" }}>
        <ParticleCanvas />
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, height: "2px", background: "linear-gradient(transparent,rgba(0,255,231,.04),transparent)", animation: "scanline 9s linear infinite" }} />
        </div>

        {/* ── NAV ── */}
        {/* INCREASED: logo 1.3rem → 1.55rem */}
        <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, height: "64px", display: "flex", alignItems: "center", padding: "0 5%", justifyContent: "space-between", background: scrolled ? "rgba(5,5,8,.92)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(0,255,231,.07)" : "none", transition: "all .4s" }}>
          <div onClick={() => go("home")} style={{ cursor: "pointer", userSelect: "none", display: "flex", alignItems: "center" }}>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "1.72rem", letterSpacing: "-.02em", background: "linear-gradient(135deg,#00ffe7 0%,#a78bfa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", filter: "drop-shadow(0 0 12px rgba(0,255,231,.4))" }}>ISHWOR</span>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#00ffe7", boxShadow: "0 0 10px #00ffe7, 0 0 20px rgba(0,255,231,.5)", display: "inline-block", marginLeft: "3px", marginBottom: "2px", flexShrink: 0 }} />
          </div>
          <nav className="desktop-nav" style={{ display: "flex", gap: "2.2rem" }}>
            {["home", "about", "skills", "projects", "education", "experience", "contact"].map(id => (
              <span key={id} className={"nav-link" + (active === id ? " active" : "")} onClick={() => go(id)}>{id}</span>
            ))}
          </nav>
          <button className="mob-btn" onClick={() => setMob(m => !m)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", flexDirection: "column", gap: "5px", padding: "4px" }}>
            {[0, 1, 2].map(i => <div key={i} style={{ width: "22px", height: "1.5px", background: "#00ffe7" }} />)}
          </button>
        </header>

        {/* INCREASED: mobile nav 0.95rem → 1.1rem */}
        {mob && (
          <div style={{ position: "fixed", top: "64px", left: 0, right: 0, zIndex: 199, background: "rgba(5,5,8,.97)", backdropFilter: "blur(20px)", padding: "1.6rem 5%", display: "flex", flexDirection: "column", gap: "1.2rem", borderBottom: "1px solid rgba(0,255,231,.07)" }}>
            {["home", "about", "skills", "projects", "education", "experience", "contact"].map(id => (
              <span key={id} className="nav-link" onClick={() => go(id)} style={{ fontSize: "1.25rem" }}>{id}</span>
            ))}
          </div>
        )}

        {/* ── HERO ── */}
        <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "0 5%", position: "relative", zIndex: 2, background: "radial-gradient(ellipse 70% 55% at 65% 48%,rgba(114,9,183,.1) 0%,transparent 68%)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }} className="hero-grid">
            <div style={{ animation: "fadeSlide 1s ease both" }}>
              {/* INCREASED: hero tag 0.75rem → 0.92rem */}
              <div className="hero-tag" style={{ fontFamily: "'DM Mono',monospace", fontSize: "1.06rem", color: "#00ffe7", letterSpacing: ".16em", marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: ".6rem" }}>
                <span style={{ fontSize: "1.82rem" }}>👋</span>
                <span>HELLO, I'M</span>
              </div>
              <h1 style={{ fontSize: "clamp(3.6rem,7vw,6rem)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-.04em", marginBottom: "1rem" }}>
                <span className="glitch" data-text="Ishwor" style={{ color: "#f1f5f9", display: "block" }}>Ishwor</span>
                <span className="glitch" data-text="Bist." style={{ color: "#00ffe7", display: "block" }}>Bist.</span>
              </h1>
              {/* INCREASED: typewriter line 0.95rem → 1.2rem */}
              <div style={{ fontSize: "clamp(1.3rem,2vw,1.7rem)", color: "#475569", marginBottom: "2rem", minHeight: "2rem", display: "flex", alignItems: "center", gap: ".45em", flexWrap: "wrap" }}>
                <span style={{ color: "#334155", fontWeight: 500 }}>I'm a</span>
                <Typewriter />
              </div>
              {/* INCREASED: hero paragraph 0.97rem → 1.1rem */}
              <p style={{ color: "#64748b", fontSize: "1.25rem", lineHeight: 1.8, marginBottom: "2.4rem", maxWidth: "420px" }}>
                Web application developer passionate about building responsive, user-friendly web applications with modern technologies and clean design.
              </p>
              <div className="hero-btns" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <button className="btn-glow" onClick={() => go("projects")}><span>View Work</span></button>
                <button className="btn-ghost" onClick={() => go("contact")}>Contact Me</button>
              </div>
            </div>
            <div className="photo-col" style={{ display: "flex", justifyContent: "center", alignItems: "center", animation: "fadeSlide 1s ease .3s both" }}>
              <PhotoOrb />
            </div>
          </div>
          <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: ".4rem", opacity: .35, zIndex: 2 }}>
            {/* INCREASED: scroll label 0.6rem → 0.78rem */}
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "1.06rem", letterSpacing: ".14em", color: "#64748b" }}>SCROLL</div>
            <div style={{ width: "1px", height: "36px", background: "linear-gradient(to bottom,#00ffe7,transparent)" }} />
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section id="about" style={{ position: "relative", zIndex: 2 }}>
          <div className="sec">
            <Reveal>
              {/* INCREASED: section heading clamp base 1.8rem → 2.1rem */}
              <h2 style={{ fontSize: "clamp(2.4rem,5vw,3.6rem)", fontWeight: 900, letterSpacing: "-.03em", marginBottom: ".6rem", color: "#f1f5f9" }}>Who I Am</h2>
              <div style={{ width: "36px", height: "2px", background: "#00ffe7", marginBottom: "2.8rem" }} />
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }} className="about-grid">
              <Reveal delay={.1} direction="left">
                {/* INCREASED: about paragraph 1rem → 1.13rem */}
                <p style={{ color: "#64748b", fontSize: "1.28rem", lineHeight: 1.85, marginBottom: "1.3rem" }}>
                  I'm <strong style={{ color: "#f1f5f9" }}>Ishwor Bist</strong> — a Frontend & Full-Stack Developer from Nepal with a passion for building beautiful, fast, and accessible web experiences.
                </p>
                <div style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(0,255,231,.08)", borderRadius: "14px", padding: "1.4rem", marginBottom: "1.6rem" }}>
                  {[
                    { icon: "🎂", label: "Date of Birth", val: "28 May, 2004" },
                    { icon: "📍", label: "Address", val: "New Baneshwor, Kathmandu" },
                    { icon: "📧", label: "Email", val: "ishworbist99@gmail.com" },
                    { icon: "📞", label: "Phone", val: "+977 9811630107" },
                  ].map(r => (
                    <div key={r.label} style={{ display: "flex", alignItems: "center", gap: ".9rem", marginBottom: ".6rem" }}>
                      <span style={{ fontSize: "1.25rem", width: "22px", textAlign: "center", flexShrink: 0 }}>{r.icon}</span>
                      {/* INCREASED: info label 0.7rem → 0.85rem */}
                      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: ".99rem", color: "#475569", fontWeight: 600, letterSpacing: ".05em", minWidth: "105px" }}>{r.label}:</span>
                      {/* INCREASED: info value 0.88rem → 1rem */}
                      <span style={{ fontSize: "1.14rem", color: "#94a3b8" }}>{r.val}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="stat-grid">
                  {[["0", "Years of Code"], ["1", "Projects Built"], ["0", "Happy Clients"], ["∞", "Cups of Tea"]].map(([n, l]) => (
                    <div key={l} style={{ background: "rgba(0,255,231,.04)", border: "1px solid rgba(0,255,231,.1)", borderRadius: "14px", padding: "1.2rem", textAlign: "center", animation: "borderGlow 4s ease-in-out infinite" }}>
                      {/* INCREASED: stat number 1.7rem → 2rem */}
                      <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#00ffe7", letterSpacing: "-.04em" }}>{n}</div>
                      {/* INCREASED: stat label 0.72rem → 0.88rem */}
                      <div style={{ fontSize: "1.02rem", color: "#475569", marginTop: "2px", fontWeight: 500 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={.2} direction="right">
                <TiltCard>
                  {/* INCREASED: code block font 0.82rem → 0.96rem */}
                  <div style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(0,255,231,.1)", borderRadius: "22px", padding: "2.2rem", fontFamily: "'DM Mono',monospace", fontSize: "1.25rem", lineHeight: 1.9, color: "#475569", boxShadow: "0 40px 80px rgba(0,0,0,.4)" }}>
                    <div style={{ color: "#2d3748", marginBottom: ".4rem" }}>{"// ishwor.config.ts"}</div>
                    <div><span style={{ color: "#a78bfa" }}>const</span> <span style={{ color: "#00ffe7" }}>developer</span>{" = {"}</div>
                    <div style={{ paddingLeft: "1.4rem" }}>
                      <div><span style={{ color: "#f1f5f9" }}>name</span>{": "}<span style={{ color: "#fbbf24" }}>"Ishwor Bist"</span>,</div>
                      <div><span style={{ color: "#f1f5f9" }}>role</span>{": "}<span style={{ color: "#fbbf24" }}>"Full-Stack Dev"</span>,</div>
                      <div><span style={{ color: "#f1f5f9" }}>location</span>{": "}<span style={{ color: "#fbbf24" }}>"Nepal 🇳🇵"</span>,</div>
                      <div><span style={{ color: "#f1f5f9" }}>available</span>{": "}<span style={{ color: "#00ffe7" }}>true</span>,</div>
                      <div><span style={{ color: "#f1f5f9" }}>stack</span>{": ["}<span style={{ color: "#fbbf24" }}>"React","Node","TS"</span>{"],"}</div>
                      <div><span style={{ color: "#f1f5f9" }}>coffee</span>{": "}<span style={{ color: "#00ffe7" }}>Infinity</span>,</div>
                    </div>
                    <div>{"}"}</div>
                    <div style={{ marginTop: ".7rem", color: "#2d3748" }}>{"// always learning, always shipping"}</div>
                  </div>
                </TiltCard>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── SKILLS ── */}
        <section id="skills" style={{ position: "relative", zIndex: 2, background: "rgba(255,255,255,.012)" }}>
          <div className="sec">
            <Reveal>
              <h2 style={{ fontSize: "clamp(2.4rem,5vw,3.6rem)", fontWeight: 900, letterSpacing: "-.03em", marginBottom: ".6rem", color: "#f1f5f9" }}>Tech Stack</h2>
              <div style={{ width: "36px", height: "2px", background: "#00ffe7", marginBottom: "2.8rem" }} />
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "1.2rem" }} className="skills-grid">
              {SKILLS.map((s, i) => (
                <Reveal key={s.name} delay={i * .07}>
                  <TiltCard style={{ height: "100%" }}>
                    <div style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.06)", borderRadius: "16px", padding: "1.5rem", height: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".4rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                          <span style={{ fontSize: "1.45rem" }}>{s.icon}</span>
                          {/* INCREASED: skill name 0.9rem → 1.05rem */}
                          <span style={{ fontWeight: 700, fontSize: "1.2rem", color: "#e2e8f0" }}>{s.name}</span>
                        </div>
                        {/* INCREASED: skill pct 0.78rem → 0.92rem */}
                        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "1.06rem", color: "#00ffe7", fontWeight: 600 }}>{s.pct}%</span>
                      </div>
                      <div style={{ height: "4px", background: "rgba(255,255,255,.06)", borderRadius: "99px", overflow: "hidden", marginTop: ".9rem" }}>
                        <div className="skill-fill" style={{ width: `${s.pct}%` }} />
                      </div>
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section id="projects" style={{ position: "relative", zIndex: 2 }}>
          <div className="sec">
            <Reveal>
              <h2 style={{ fontSize: "clamp(2.4rem,5vw,3.6rem)", fontWeight: 900, letterSpacing: "-.03em", marginBottom: ".6rem", color: "#f1f5f9" }}>Featured Work</h2>
              <div style={{ width: "36px", height: "2px", background: "#00ffe7", marginBottom: "2.8rem" }} />
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "1.5rem" }} className="proj-grid">
              {PROJECTS.map((p, i) => (
                <Reveal key={p.title} delay={i * .08}>
                  <TiltCard style={{ height: "100%" }}>
                    <div className="proj-card">
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg,transparent,${p.color}88,transparent)` }} />
                      {/* INCREASED: project label 0.66rem → 0.82rem */}
                      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "1.25rem", color: p.color, letterSpacing: ".12em", marginBottom: ".8rem", opacity: .7 }}>FEATURED PROJECT</div>
                      {/* INCREASED: project title 1.2rem → 1.4rem */}
                      <h3 style={{ fontSize: "1.72rem", fontWeight: 800, color: "#f1f5f9", marginBottom: ".7rem", letterSpacing: "-.02em" }}>{p.title}</h3>
                      {/* INCREASED: project desc 0.88rem → 1rem */}
                      <p style={{ color: "#64748b", fontSize: "1.14rem", lineHeight: 1.7, marginBottom: "1.3rem" }}>{p.desc}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: ".45rem" }}>
                        {/* INCREASED: project tags 0.68rem → 0.82rem */}
                        {p.tags.map(t => <span key={t} style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "6px", padding: "2px 9px", fontSize: "1.25rem", fontFamily: "'DM Mono',monospace", color: "#64748b" }}>{t}</span>)}
                      </div>
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── EDUCATION ── */}
        <section id="education" style={{ position: "relative", zIndex: 2, background: "rgba(255,255,255,.012)" }}>
          <div className="sec">
            <Reveal>
              <h2 style={{ fontSize: "clamp(2.4rem,5vw,3.6rem)", fontWeight: 900, letterSpacing: "-.03em", marginBottom: ".6rem", color: "#f1f5f9" }}>Academic Background</h2>
              <div style={{ width: "36px", height: "2px", background: "#a78bfa", marginBottom: "2.8rem" }} />
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(400px,1fr))", gap: "1.5rem" }} className="edu-grid">
              {EDUCATION.map((e, i) => (
                <Reveal key={e.degree} delay={i * .1}>
                  <TiltCard style={{ height: "100%" }}>
                    <div className="edu-card" style={{ height: "100%" }}>
                      <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "3px", background: "linear-gradient(to bottom,#a78bfa,rgba(167,139,250,.1))", borderRadius: "3px 0 0 3px" }} />
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                        <div style={{ width: "52px", height: "52px", borderRadius: "12px", background: "rgba(167,139,250,.1)", border: "1px solid rgba(167,139,250,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.82rem", flexShrink: 0 }}>{e.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: ".5rem", marginBottom: ".4rem" }}>
                            {/* INCREASED: edu degree 1rem → 1.15rem */}
                            <h3 style={{ fontWeight: 800, fontSize: "1.45rem", color: "#f1f5f9" }}>{e.degree}</h3>
                            <div style={{ display: "flex", alignItems: "center", gap: ".4rem", flexWrap: "wrap" }}>
                              {e.running && (
                                <span style={{ display: "flex", alignItems: "center", gap: "5px", fontFamily: "'DM Mono',monospace", fontSize: "1.25rem", color: "#34d399", background: "rgba(52,211,153,.1)", border: "1px solid rgba(52,211,153,.25)", borderRadius: "999px", padding: "2px 9px" }}>
                                  <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#34d399", boxShadow: "0 0 6px #34d399", display: "inline-block", animation: "pulse-dot 2s ease-in-out infinite" }} />
                                  Studying
                                </span>
                              )}
                              {/* INCREASED: period badge 0.72rem → 0.86rem */}
                              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "1.14rem", color: "#a78bfa", background: "rgba(167,139,250,.1)", border: "1px solid rgba(167,139,250,.2)", borderRadius: "6px", padding: "2px 9px" }}>{e.period}</span>
                            </div>
                          </div>
                          {/* INCREASED: school name 0.8rem → 0.95rem */}
                          <div style={{ fontSize: "1.09rem", color: "#a78bfa", marginBottom: ".7rem", fontWeight: 600 }}>{e.school}</div>
                          {/* INCREASED: edu desc 0.88rem → 1rem */}
                          <p style={{ color: "#64748b", fontSize: "1.14rem", lineHeight: 1.7 }}>{e.desc}</p>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── EXPERIENCE ── */}
        <section id="experience" style={{ position: "relative", zIndex: 2 }}>
          <div className="sec">
            <Reveal>
              <h2 style={{ fontSize: "clamp(2.4rem,5vw,3.6rem)", fontWeight: 900, letterSpacing: "-.03em", marginBottom: ".6rem", color: "#f1f5f9" }}>Experience</h2>
              <div style={{ width: "36px", height: "2px", background: "#00ffe7", marginBottom: "2.8rem" }} />
            </Reveal>
            <Reveal delay={.1}>
              <TiltCard>
                <div style={{ background: "rgba(0,255,231,.04)", border: "1px solid rgba(0,255,231,.2)", borderRadius: "22px", padding: "2.4rem", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg,transparent,#00ffe7,transparent)" }} />
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "1.4rem", flexWrap: "wrap" }}>
                    <div style={{ width: "60px", height: "60px", borderRadius: "16px", background: "rgba(0,255,231,.08)", border: "1px solid rgba(0,255,231,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.95rem", flexShrink: 0, animation: "borderGlow 3s ease-in-out infinite" }}>🚀</div>
                    <div style={{ flex: 1, minWidth: "220px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: ".6rem", marginBottom: ".5rem" }}>
                        {/* INCREASED: exp title 1.2rem → 1.4rem */}
                        <h3 style={{ fontWeight: 900, fontSize: "1.72rem", color: "#00ffe7" }}>Just Getting Started!</h3>
                        {/* INCREASED: exp date badge 0.72rem → 0.86rem */}
                        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "1.14rem", color: "#00ffe7", background: "rgba(0,255,231,.08)", border: "1px solid rgba(0,255,231,.2)", borderRadius: "6px", padding: "3px 10px" }}>2024 – Present</span>
                      </div>
                      {/* INCREASED: exp subtitle 0.88rem → 1rem */}
                      <div style={{ fontSize: "1.14rem", color: "#475569", marginBottom: "1rem", fontWeight: 600 }}>Open to Opportunities · Kathmandu, Nepal</div>
                      {/* INCREASED: exp body 0.97rem → 1.1rem */}
                      <p style={{ color: "#94a3b8", fontSize: "1.25rem", lineHeight: 1.85, marginBottom: "1.4rem" }}>
                        I'm at the beginning of my professional journey — no formal work experience yet, but I've been building real-world projects, learning every single day, and putting in the work. I'm actively looking for my <strong style={{ color: "#f1f5f9" }}>first opportunity</strong> to grow inside a great team.
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: ".6rem" }}>
                        {/* INCREASED: exp tags 0.8rem → 0.93rem */}
                        {["🟢 Available Now", "💻 Building Projects", "📚 Always Learning", "🤝 Open to Internships"].map(tag => (
                          <span key={tag} style={{ background: "rgba(0,255,231,.06)", border: "1px solid rgba(0,255,231,.15)", borderRadius: "999px", padding: "5px 14px", fontSize: "1.07rem", color: "#00ffe7", fontWeight: 600 }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" style={{ position: "relative", zIndex: 2, background: "rgba(255,255,255,.012)" }}>
          <div className="sec">
            <Reveal>
              <h2 style={{ fontSize: "clamp(2.4rem,5vw,3.6rem)", fontWeight: 900, letterSpacing: "-.03em", marginBottom: ".6rem", color: "#f1f5f9" }}>Let's Build Together</h2>
              <div style={{ width: "36px", height: "2px", background: "#00ffe7", marginBottom: "2.8rem" }} />
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }} className="contact-grid">
              <Reveal delay={.1} direction="left">
                {/* INCREASED: contact intro 1rem → 1.13rem */}
                <p style={{ color: "#64748b", fontSize: "1.28rem", lineHeight: 1.8, marginBottom: "2rem" }}>
                  Open to freelance projects and full-time opportunities. Have a project that needs a dedicated developer? Let's talk.
                </p>
                {[
                  { icon: "📧", label: "Email", val: "ishworbist99@gmail.com" },
                  { icon: "📍", label: "Location", val: "New Baneshwor, Kathmandu" },
                  { icon: "📞", label: "Phone", val: "+977 9811630107" },
                  { icon: "🐙", label: "GitHub", val: "https://github.com/Bist0" },
                ].map(c => (
                  <div key={c.label} style={{ display: "flex", alignItems: "center", gap: ".9rem", marginBottom: ".9rem" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "11px", background: "rgba(0,255,231,.06)", border: "1px solid rgba(0,255,231,.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", flexShrink: 0 }}>{c.icon}</div>
                    <div>
                      {/* INCREASED: contact label 0.66rem → 0.82rem */}
                      <div style={{ fontSize: "1.25rem", color: "#334155", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "1px" }}>{c.label}</div>
                      {/* INCREASED: contact value 0.88rem → 1rem */}
                      <div style={{ fontSize: "1.14rem", color: "#94a3b8" }}>{c.val}</div>
                    </div>
                  </div>
                ))}
              </Reveal>
              <Reveal delay={.2} direction="right">
                {sent ? (
                  <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
                    {/* INCREASED: success title 1.1rem → 1.3rem */}
                    <div style={{ fontSize: "1.45rem", fontWeight: 700, color: "#00ffe7", marginBottom: ".4rem" }}>Message Sent!</div>
                    {/* INCREASED: success sub 0.something → 1rem */}
                    <div style={{ color: "#64748b", fontSize: "1.14rem", marginBottom: "1.5rem" }}>I'll get back to you within 24 hours.</div>
                    <button className="btn-ghost" onClick={() => { setSent(false); setFormData({ name: "", email: "", subject: "", message: "" }); }}>
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: ".9rem" }}>
                    <input
                      className="c-input"
                      placeholder="Your Name *"
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    />
                    <input
                      className="c-input"
                      placeholder="Your Email *"
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    />
                    <input
                      className="c-input"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))}
                    />
                    <textarea
                      className="c-input"
                      placeholder="Tell me about your project... *"
                      rows={5}
                      style={{ resize: "vertical" }}
                      value={formData.message}
                      onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                    />
                    {/* INCREASED: error text 0.85rem → 1rem */}
                    {error && (
                      <div style={{ color: "#ff2d78", fontSize: "1.14rem", marginTop: "-.3rem", display: "flex", alignItems: "center", gap: ".4rem" }}>
                        <span>⚠️</span> {error}
                      </div>
                    )}
                    <button
                      className="btn-glow"
                      onClick={sendEmail}
                      disabled={sending}
                      style={{ width: "100%", marginTop: ".3rem" }}
                    >
                      <span>{sending ? "⏳ Sending..." : "Send Message →"}</span>
                    </button>
                  </div>
                )}
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ position: "relative", zIndex: 2, borderTop: "1px solid rgba(255,255,255,.07)", background: "#050508" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "3.5rem 5% 2rem", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: "3rem" }} className="footer-grid">
            <div>
              <div style={{ userSelect: "none", marginBottom: "1rem", display: "flex", alignItems: "center" }}>
                {/* INCREASED: footer logo 1.4rem → 1.65rem */}
                <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "1.82rem", letterSpacing: "-.02em", background: "linear-gradient(135deg,#00ffe7 0%,#a78bfa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", filter: "drop-shadow(0 0 10px rgba(0,255,231,.4))" }}>ISHWOR</span>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#00ffe7", boxShadow: "0 0 10px #00ffe7", display: "inline-block", marginLeft: "3px", marginBottom: "2px" }} />
              </div>
              {/* INCREASED: footer about text 0.92rem → 1.05rem */}
              <p style={{ color: "#64748b", fontSize: "1.2rem", lineHeight: 1.8, marginBottom: "1.6rem", maxWidth: "280px" }}>
                Hi, I'm Ishwor Bist — a web developer from Nepal passionate about building responsive, user-friendly web applications with modern technologies and clean design.
              </p>
              <div style={{ display: "flex", gap: ".7rem" }}>
                {[
                  { label: "GitHub", href: "https://github.com/Bist0", color: "#f1f5f9", svg: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg> },
                  { label: "LinkedIn", href: "https://linkedin.com/in/ishworbist", color: "#0a66c2", svg: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg> },
                  { label: "Facebook", href: "https://www.facebook.com/ishwor.bist.07", color: "#1877f2", svg: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.253h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" /></svg> },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" title={s.label}
                    style={{ width: "42px", height: "42px", borderRadius: "50%", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", transition: "all .25s", cursor: "pointer", color: "#94a3b8" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.background = s.color + "22"; e.currentTarget.style.color = s.color; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 20px ${s.color}33`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.1)"; e.currentTarget.style.background = "rgba(255,255,255,.05)"; e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                  >{s.svg}</a>
                ))}
              </div>
            </div>

            <div>
              {/* INCREASED: footer heading 1rem → 1.15rem */}
              <h4 style={{ fontSize: "1.45rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "1.4rem", letterSpacing: ".04em" }}>Quick Links</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
                {/* INCREASED: footer links 0.93rem → 1.05rem */}
                {["home", "about", "skills", "projects", "education", "experience", "contact"].map(id => (
                  <span key={id} onClick={() => go(id)} style={{ display: "flex", alignItems: "center", gap: ".6rem", color: "#64748b", fontSize: "1.2rem", cursor: "pointer", transition: "color .2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#00ffe7"}
                    onMouseLeave={e => e.currentTarget.style.color = "#64748b"}
                  >
                    <span style={{ color: "#00ffe7", fontSize: ".9rem" }}>→</span>
                    <span style={{ textTransform: "capitalize" }}>{id}</span>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "1.45rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "1.4rem", letterSpacing: ".04em" }}>Contact Information</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  { icon: "📍", val: "New Baneshwor, Kathmandu, Nepal" },
                  { icon: "📞", val: "+977 9811630107" },
                  { icon: "📧", val: "ishworbist99@gmail.com" },
                ].map(c => (
                  <div key={c.val} style={{ display: "flex", alignItems: "flex-start", gap: ".8rem" }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "rgba(0,255,231,.06)", border: "1px solid rgba(0,255,231,.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".9rem", flexShrink: 0 }}>{c.icon}</div>
                    {/* INCREASED: footer contact value 0.88rem → 1rem */}
                    <span style={{ color: "#64748b", fontSize: "1.14rem", lineHeight: 1.5, paddingTop: "6px" }}>{c.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,.05)", padding: "1.4rem 5%", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: ".8rem", maxWidth: "1100px", margin: "0 auto" }}>
            {/* INCREASED: footer copyright 0.76rem → 0.92rem */}
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "1.06rem", color: "#8aa4be" }}>
              © {new Date().getFullYear()} Ishwor Bist. All rights reserved.
            </div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "1.06rem", color: "#8aa4be" }}>
              <span style={{ color: "#00ffe7" }}>status:</span> open_to_work
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}