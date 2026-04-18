import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── paste your actual image imports here ───
// import homeBg from "../assets/homePage.webp";
// import registerBg from "../assets/registerPage.webp";

const HOME_BG = "/src/assets/homePage.webp";
const REGISTER_BG = "/src/assets/registerPage.webp";

const features = [
  {
    icon: "✦",
    title: "Smart Priority",
    desc: "Tag tasks as Low, Medium, or High. We remind you before it's too late.",
  },
  {
    icon: "🔔",
    title: "Push Notifications",
    desc: "Get real-time alerts on your device for high-priority pending tasks.",
  },
  {
    icon: "🔥",
    title: "Strike System",
    desc: "Complete all tasks every day and build an unstoppable streak.",
  },
  {
    icon: "📅",
    title: "Date Filtering",
    desc: "View tasks by date. Never lose track of what's due today or overdue.",
  },
  {
    icon: "⚡",
    title: "Lightning Fast",
    desc: "Add, edit, complete tasks in seconds. Zero friction, pure focus.",
  },
  {
    icon: "🔒",
    title: "Secure & Personal",
    desc: "Your tasks are private. JWT-protected, account-based storage.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const featuresRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={styles.root}>
      {/* ── HERO 1 – "Today is the Day" bg ── */}
      <section style={styles.hero}>
        {/* parallax bg */}
        <div
          style={{
            ...styles.heroBg,
            backgroundImage: `url(${HOME_BG})`,
            transform: `translateY(${scrollY * 0.35}px)`,
          }}
        />
        <div style={styles.heroOverlay} />

        {/* nav */}
        <nav style={styles.nav}>
          <span style={styles.logo}>TODO<span style={styles.logoDot}>.</span></span>
          <div style={styles.navLinks}>
            <button style={styles.navBtn} onClick={() => navigate("/login")}>
              Log in
            </button>
            <button style={styles.navBtnPrimary} onClick={() => navigate("/register")}>
              Get started
            </button>
          </div>
        </nav>

        {/* hero content */}
        <div style={{ ...styles.heroContent, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: "all 0.9s cubic-bezier(.16,1,.3,1)" }}>
          <div style={styles.badge}>✦ Your daily productivity companion</div>
          <h1 style={styles.heroTitle}>
            Stop planning.<br />
            <span style={styles.heroAccent}>Start doing.</span>
          </h1>
          <p style={styles.heroSub}>
            A todo app that keeps you accountable — with streaks, smart reminders,
            and zero clutter.
          </p>
          <div style={styles.heroCtas}>
            <button style={styles.ctaPrimary} onClick={() => navigate("/register")}>
              Start for free →
            </button>
            <button style={styles.ctaGhost} onClick={scrollToFeatures}>
              See features ↓
            </button>
          </div>
        </div>

        {/* scroll hint */}
        <div style={styles.scrollHint} onClick={scrollToFeatures}>
          <div style={styles.scrollDot} />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section ref={featuresRef} style={styles.featuresSection}>
        <div style={styles.featuresSectionInner}>
          <p style={styles.sectionEyebrow}>✦ EVERYTHING YOU NEED</p>
          <h2 style={styles.sectionTitle}>Built for people who<br />actually want to get things done.</h2>

          <div style={styles.featuresGrid}>
            {features.map((f, i) => (
              <div key={i} style={{ ...styles.featureCard, animationDelay: `${i * 0.08}s` }}>
                <span style={styles.featureIcon}>{f.icon}</span>
                <h3 style={styles.featureTitle}>{f.title}</h3>
                <p style={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HERO 2 – "One Day or Day One" bg ── */}
      <section style={styles.hero2}>
        <div
          style={{
            ...styles.heroBg,
            backgroundImage: `url(${REGISTER_BG})`,
            filter: "brightness(0.55)",
          }}
        />
        <div style={styles.hero2Overlay} />

        <div style={styles.hero2Content}>
          <p style={styles.hero2Eye}>✦ NO MORE EXCUSES</p>
          <h2 style={styles.hero2Title}>
            One day or<br />
            <span style={styles.hero2Accent}>Day one.</span>
          </h2>
          <p style={styles.hero2Sub}>
            Your streak starts the moment you complete your first task.
            Build the habit. Own the day.
          </p>
          <button style={styles.ctaPrimary} onClick={() => navigate("/register")}>
            Begin today →
          </button>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={styles.statsBar}>
        {[
          { num: "100%", label: "Free to use" },
          { num: "∞", label: "Tasks you can add" },
          { num: "24/7", label: "Push notifications" },
          { num: "🔥", label: "Streak system" },
        ].map((s, i) => (
          <div key={i} style={styles.statItem}>
            <span style={styles.statNum}>{s.num}</span>
            <span style={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── FOOTER ── */}
      <footer style={styles.footer}>
        <span style={styles.logo}>TODO<span style={styles.logoDot}>.</span></span>
        <p style={styles.footerText}>Made with focus. Built for doers.</p>
        <div style={styles.footerLinks}>
          <button style={styles.footerBtn} onClick={() => navigate("/login")}>Log in</button>
          <button style={styles.footerBtn} onClick={() => navigate("/register")}>Register</button>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #0a0a0a; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scaleY(1); opacity: 1; }
          50%       { transform: scaleY(1.6); opacity: 0.5; }
        }

        .feature-card-hover:hover {
          background: rgba(255,200,80,0.07) !important;
          border-color: rgba(255,200,80,0.35) !important;
          transform: translateY(-4px) !important;
        }
      `}</style>
    </div>
  );
}

const styles = {
  root: {
    fontFamily: "'DM Sans', sans-serif",
    background: "#0a0a0a",
    color: "#f0ede6",
    overflowX: "hidden",
  },

  // ── HERO ──
  hero: {
    position: "relative",
    height: "100vh",
    minHeight: 600,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
heroBg: {
  position: "absolute",
  inset: 0,
  backgroundSize: "contain",        // ← change from "cover" to "contain"
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundColor: "#0a0a0a",       // ← fills empty sides with dark color
  zIndex: 0,
},
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to bottom, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.3) 40%, rgba(10,10,10,0.85) 100%)",
    zIndex: 1,
  },

  // nav
  nav: {
    position: "relative",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "28px 48px",
  },
  logo: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 28,
    letterSpacing: 4,
    color: "#f0ede6",
  },
  logoDot: { color: "#ffc850" },
  navLinks: { display: "flex", gap: 12, alignItems: "center" },
  navBtn: {
    background: "transparent",
    border: "1px solid rgba(240,237,230,0.3)",
    color: "#f0ede6",
    padding: "9px 22px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 400,
    letterSpacing: 0.3,
    transition: "all 0.2s",
  },
  navBtnPrimary: {
    background: "#ffc850",
    border: "none",
    color: "#0a0a0a",
    padding: "9px 22px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    letterSpacing: 0.3,
  },

  // hero content
  heroContent: {
    position: "relative",
    zIndex: 10,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "0 48px",
    maxWidth: 720,
  },
  badge: {
    display: "inline-block",
    fontSize: 12,
    letterSpacing: 2,
    color: "#ffc850",
    textTransform: "uppercase",
    marginBottom: 20,
    fontWeight: 500,
  },
  heroTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(64px, 10vw, 120px)",
    lineHeight: 0.95,
    letterSpacing: 2,
    color: "#f0ede6",
    marginBottom: 24,
  },
  heroAccent: { color: "#ffc850" },
  heroSub: {
    fontSize: 18,
    lineHeight: 1.6,
    color: "rgba(240,237,230,0.7)",
    maxWidth: 480,
    marginBottom: 36,
    fontWeight: 300,
  },
  heroCtas: { display: "flex", gap: 16, flexWrap: "wrap" },
  ctaPrimary: {
    background: "#ffc850",
    color: "#0a0a0a",
    border: "none",
    padding: "14px 32px",
    borderRadius: 6,
    fontSize: 15,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: 0.3,
    transition: "transform 0.15s, box-shadow 0.15s",
  },
  ctaGhost: {
    background: "transparent",
    color: "#f0ede6",
    border: "1px solid rgba(240,237,230,0.35)",
    padding: "14px 32px",
    borderRadius: 6,
    fontSize: 15,
    fontWeight: 400,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: 0.3,
  },

  // scroll hint
  scrollHint: {
    position: "relative",
    zIndex: 10,
    display: "flex",
    justifyContent: "center",
    paddingBottom: 32,
    cursor: "pointer",
  },
  scrollDot: {
    width: 2,
    height: 40,
    background: "linear-gradient(to bottom, rgba(255,200,80,0.8), transparent)",
    borderRadius: 2,
    animation: "pulse 1.8s ease-in-out infinite",
  },

  // ── FEATURES ──
  featuresSection: {
    background: "#0f0f0f",
    padding: "100px 48px",
  },
  featuresSectionInner: {
    maxWidth: 1100,
    margin: "0 auto",
  },
  sectionEyebrow: {
    fontSize: 12,
    letterSpacing: 3,
    color: "#ffc850",
    textTransform: "uppercase",
    marginBottom: 16,
    fontWeight: 500,
  },
  sectionTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(40px, 6vw, 72px)",
    lineHeight: 1.05,
    color: "#f0ede6",
    marginBottom: 64,
    letterSpacing: 1,
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 20,
  },
  featureCard: {
    background: "rgba(240,237,230,0.03)",
    border: "1px solid rgba(240,237,230,0.08)",
    borderRadius: 12,
    padding: "32px 28px",
    transition: "all 0.25s ease",
    cursor: "default",
    animation: "fadeUp 0.6s ease both",
    className: "feature-card-hover",
  },
  featureIcon: {
    fontSize: 28,
    display: "block",
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 500,
    color: "#f0ede6",
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  featureDesc: {
    fontSize: 14,
    lineHeight: 1.65,
    color: "rgba(240,237,230,0.55)",
    fontWeight: 300,
  },

  // ── HERO 2 ──
  hero2: {
    position: "relative",
    height: "80vh",
    minHeight: 500,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  hero2Overlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, rgba(10,10,10,0.75) 0%, rgba(10,10,10,0.4) 100%)",
    zIndex: 1,
  },
  hero2Content: {
    position: "relative",
    zIndex: 10,
    textAlign: "center",
    padding: "0 24px",
  },
  hero2Eye: {
    fontSize: 12,
    letterSpacing: 3,
    color: "#ffc850",
    textTransform: "uppercase",
    marginBottom: 20,
    fontWeight: 500,
  },
  hero2Title: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(56px, 10vw, 110px)",
    lineHeight: 0.95,
    letterSpacing: 2,
    color: "#f0ede6",
    marginBottom: 24,
  },
  hero2Accent: { color: "#ffc850" },
  hero2Sub: {
    fontSize: 17,
    lineHeight: 1.6,
    color: "rgba(240,237,230,0.65)",
    maxWidth: 460,
    margin: "0 auto 36px",
    fontWeight: 300,
  },

  // ── STATS BAR ──
  statsBar: {
    background: "#ffc850",
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
    padding: "40px 48px",
    gap: 24,
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  statNum: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 42,
    color: "#0a0a0a",
    letterSpacing: 2,
    lineHeight: 1,
  },
  statLabel: {
    fontSize: 13,
    color: "rgba(10,10,10,0.65)",
    fontWeight: 400,
    letterSpacing: 0.5,
  },

  // ── FOOTER ──
  footer: {
    background: "#0a0a0a",
    borderTop: "1px solid rgba(240,237,230,0.08)",
    padding: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 16,
  },
  footerText: {
    fontSize: 13,
    color: "rgba(240,237,230,0.35)",
    fontWeight: 300,
  },
  footerLinks: { display: "flex", gap: 12 },
  footerBtn: {
    background: "transparent",
    border: "1px solid rgba(240,237,230,0.15)",
    color: "rgba(240,237,230,0.6)",
    padding: "8px 18px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
  },
};
