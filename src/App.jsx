import { useState, useEffect, useRef, useContext, createContext } from 'react';

// ─── i18n ─────────────────────────────────────────────────────────────────────
function t(node, lang) {
  if (node == null) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'object' && (node.es || node.en)) return node[lang] || node.es || node.en || '';
  return String(node);
}

function useLang() {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('rcvg-lang') || 'es'; } catch (e) { return 'es'; }
  });
  useEffect(() => {
    try { localStorage.setItem('rcvg-lang', lang); } catch (e) {}
    document.documentElement.lang = lang;
  }, [lang]);
  return [lang, setLang];
}

// ─── Responsive ───────────────────────────────────────────────────────────────
const ResponsiveCtx = createContext({ isMobile: false, isTablet: false });
function useResponsive() { return useContext(ResponsiveCtx); }

// ─── Scroll reveal ────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function Reveal({ children, delay = 0, from = 'bottom', style = {} }) {
  const [ref, inView] = useInView();
  const hidden = {
    bottom: 'translateY(36px)',
    left:   'translateX(-36px)',
    right:  'translateX(36px)',
    scale:  'scale(0.94) translateY(20px)',
  }[from] || 'translateY(36px)';
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'none' : hidden,
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      willChange: 'opacity, transform',
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Content ──────────────────────────────────────────────────────────────────
const DATA = {
  nav: {
    items: [
      { id: 'about',    es: 'Nosotros',   en: 'About' },
      { id: 'services', es: 'Servicios',  en: 'Services' },
      { id: 'values',   es: 'Principios', en: 'Principles' },
      { id: 'clients',  es: 'Clientes',   en: 'Clients' },
      { id: 'partners', es: 'Aliados',    en: 'Partners' },
      { id: 'contact',  es: 'Contacto',   en: 'Contact' },
    ],
    cta: { es: 'Solicitar asesoría', en: 'Request consultation' },
  },
  hero: {
    title: {
      es: ['Protegemos lo que', 'más valoras.'],
      en: ['We protect what',   'matters most.'],
    },
    body: {
      es: 'Somos una firma de consultoría en riesgos y aseguramiento. Diseñamos coberturas a la medida de cada persona y empresa — con respaldo técnico, jurídico y estratégico antes, durante y después de la póliza.',
      en: 'A risk consulting and insurance brokerage firm. We design coverage tailored to each person and business — with technical, legal and strategic support before, during and after the policy.',
    },
    stats: [
      { value: '+850', label: { es: 'Clientes activos',     en: 'Active clients' } },
      { value: '4',    label: { es: 'Aseguradoras aliadas', en: 'Partner insurers' } },
      { value: '24h',  label: { es: 'Respuesta siniestros', en: 'Claims response' } },
    ],
  },
  about: {
    body: {
      es: 'Creemos que el valor de un intermediario no está únicamente en colocar pólizas, sino en generar confianza, anticiparse a los riesgos y acompañar de forma cercana. Nuestra experiencia en el sector asegurador, sumada al conocimiento técnico, jurídico y estratégico de nuestro equipo, nos permite diseñar soluciones personalizadas orientadas a la prevención, continuidad y estabilidad patrimonial.',
      en: "A broker's real value is not just placing policies — it is building trust, anticipating risk and standing alongside the client. Our sector experience, together with the technical, legal and strategic depth of our team, lets us design tailored solutions focused on prevention, continuity and asset stability.",
    },
  },
  mission: {
    body: {
      es: 'Brindar soluciones integrales en seguros y gestión de riesgos mediante una asesoría cercana, estratégica y confiable.',
      en: 'To deliver integral insurance and risk-management solutions through close, strategic and trustworthy advisory.',
    },
  },
  vision: {
    label: { es: 'Visión', en: 'Vision' },
    body: {
      es: 'Ser la firma de consultoría en riesgos de referencia en Colombia, reconocida por la excelencia técnica y la confianza de nuestros clientes.',
      en: 'To be the reference risk consulting firm in Colombia, recognized for technical excellence and client trust.',
    },
  },
  future: {
    label: { es: 'Compromiso', en: 'Commitment' },
    body: {
      es: 'Mantenemos un estándar ético y técnico riguroso. Cada recomendación que hacemos está respaldada por análisis, experiencia y responsabilidad.',
      en: 'We uphold a rigorous ethical and technical standard. Every recommendation we make is backed by analysis, experience and accountability.',
    },
  },
  values: [
    { t: { es: 'Confianza',      en: 'Trust' },          d: { es: 'Base de cada relación con nuestros clientes.',                        en: 'The foundation of every client relationship.' } },
    { t: { es: 'Transparencia',  en: 'Transparency' },   d: { es: 'Comunicación clara en cada etapa del proceso.',                        en: 'Clear communication at every stage of the process.' } },
    { t: { es: 'Excelencia',     en: 'Excellence' },     d: { es: 'Alto estándar técnico en cada análisis y recomendación.',              en: 'High technical standard in every analysis and recommendation.' } },
    { t: { es: 'Compromiso',     en: 'Commitment' },     d: { es: 'Presencia activa antes, durante y después del siniestro.',             en: 'Active presence before, during and after a claim.' } },
    { t: { es: 'Innovación',     en: 'Innovation' },     d: { es: 'Soluciones adaptadas a los retos del entorno actual.',                 en: 'Solutions adapted to the challenges of the current environment.' } },
    { t: { es: 'Cercanía',       en: 'Closeness' },      d: { es: 'Trato humano y personalizado con cada cliente.',                       en: 'Human and personalized treatment with every client.' } },
    { t: { es: 'Responsabilidad',en: 'Accountability' }, d: { es: 'Respaldo integral ante cualquier eventualidad o siniestro.',            en: 'Comprehensive support for any eventuality or claim.' } },
    { t: { es: 'Integridad',     en: 'Integrity' },      d: { es: 'Actuamos siempre con honestidad y ética profesional.',                 en: 'We always act with honesty and professional ethics.' } },
  ],
  clients: [
    { es: 'Policía Nacional', en: 'National Police' },
    { es: 'CAR', en: 'CAR' },
    { es: 'Vigilancia & Seguridad', en: 'Security & Surveillance' },
    { es: 'Call centers', en: 'Call centers' },
    { es: 'Empresas de transporte', en: 'Transport companies' },
    { es: 'Industriales y comerciales', en: 'Industrial & commercial' },
  ],
  partners: {
    title: { es: 'Nuestras aseguradoras aliadas', en: 'Our partner insurers' },
    body:  { es: 'Trabajamos con las principales aseguradoras del mercado colombiano, lo que nos permite diseñar programas competitivos y blindar las coberturas de nuestros clientes.', en: "We work with the leading insurers in the Colombian market, enabling us to design competitive programs and fortify our clients' coverage." },
    items: ['Seguros Bolívar', 'Allianz Colombia', 'AXA Colpatria', 'Mapfre Colombia'],
  },
  contact: {
    title: { es: 'Una conversación es el primer paso hacia la tranquilidad.', en: 'A conversation is the first step toward peace of mind.' },
    body: {
      es: 'Cuéntanos qué quieres proteger. Coordinamos una sesión de diagnóstico sin costo y te enviamos una propuesta a la medida en menos de 72 horas.',
      en: "Tell us what you want to protect. We'll schedule a no-cost diagnostic session and send a tailored proposal within 72 hours.",
    },
    coords: [
      { label: { es: 'Oficina',  en: 'Office' }, v: 'Carrera 11 #82-71, Bogotá D.C.' },
      { label: { es: 'Teléfono', en: 'Phone' },  v: '+57 (601) 745 80 22' },
      { label: { es: 'Correo',   en: 'Email' },  v: 'contacto@riskconsultingvg.co' },
      { label: { es: 'Horario',  en: 'Hours' },  v: { es: 'Lun–Vie · 8:00 – 18:00', en: 'Mon–Fri · 8:00 – 18:00' } },
    ],
  },
  footer: {
    legal: { es: 'Intermediario de seguros inscrito ante la Superintendencia Financiera de Colombia.', en: 'Insurance broker registered with the Colombian Financial Superintendency.' },
    rights: { es: '© 2026 Risk Consulting VG Seguros Ltda. Todos los derechos reservados.', en: '© 2026 Risk Consulting VG Seguros Ltda. All rights reserved.' },
  },
};

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const B = {
  navy:      '#0a1f4d',
  navyDeep:  '#06143a',
  navySoft:  '#142a5c',
  mustard:   '#1A6FFF',
  mustardSoft:'#dce8ff',
  cream:     '#f5f8ff',
  white:     '#ffffff',
  ink:       '#0a1f4d',
  ash:       '#5e6b87',
  whiteSoft: 'rgba(255,255,255,0.78)',
  font:      '"Poppins", "Helvetica Neue", system-ui, sans-serif',
  mono:      '"JetBrains Mono", ui-monospace, monospace',
  rLg: 28, rMd: 18, rSm: 12,
};

// ─── Primitives ───────────────────────────────────────────────────────────────

function Wrap({ children, style = {} }) {
  const { isMobile } = useResponsive();
  return <div style={{ maxWidth: 1240, margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px', ...style }}>{children}</div>;
}

function Btn({ children, variant = 'mustard', size = 'md', style = {}, ...props }) {
  const v = {
    mustard: { bg: B.mustard,     fg: B.white, hover: B.navySoft },
    navy:    { bg: B.navy,        fg: B.white, hover: B.navySoft },
    ghost:   { bg: 'transparent', fg: B.white, hover: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.35)' },
  }[variant];
  const sz = size === 'lg' ? { padding: '18px 38px', fontSize: 13 } : { padding: '13px 24px', fontSize: 12 };
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        appearance: 'none', cursor: 'pointer',
        background: hov ? v.hover : v.bg, color: v.fg,
        border: v.border || 'none', borderRadius: 999,
        fontFamily: B.font, fontWeight: 600,
        letterSpacing: '0.06em', textTransform: 'uppercase',
        transition: 'background .15s',
        display: 'inline-flex', alignItems: 'center', gap: 8,
        ...sz, ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

function NumBadge({ n, tone = 'navy', size = 56 }) {
  const c = tone === 'mustard' ? { bg: B.mustard, fg: B.white } : { bg: B.navy, fg: B.white };
  return (
    <div style={{
      width: size, height: size, borderRadius: 999,
      background: c.bg, color: c.fg, flex: '0 0 auto',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: B.font, fontWeight: 700, fontSize: size * 0.32, letterSpacing: '-0.01em',
    }}>
      {String(n).padStart(2, '0')}
    </div>
  );
}

function ChapterBadge({ n, size = 108 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: B.rLg, flex: '0 0 auto',
      background: B.mustard, color: B.white,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: B.font, fontWeight: 700, fontSize: size * 0.38, letterSpacing: '-0.03em',
      boxShadow: '0 14px 30px -12px rgba(26,111,255,0.45)',
    }}>
      {String(n).padStart(2, '0')}
    </div>
  );
}

function CirclePhoto({ size = 132, label, tone = 'cream' }) {
  const pal = {
    cream:   { bg: '#f4ede0', stripe: 'rgba(10,31,77,0.06)',    text: '#5e6b87' },
    warm:    { bg: '#eee2cf', stripe: 'rgba(10,31,77,0.04)',    text: '#5e6b87' },
    mustard: { bg: '#dce8ff', stripe: 'rgba(10,31,77,0.10)',    text: '#0a1f4d' },
    navy:    { bg: '#142a5c', stripe: 'rgba(255,255,255,0.05)', text: '#a4adc2' },
  };
  const p = pal[tone] || pal.cream;
  return (
    <div style={{
      width: size, height: size, borderRadius: 999, flex: '0 0 auto',
      background: p.bg,
      backgroundImage: `repeating-linear-gradient(135deg, ${p.stripe} 0 1px, transparent 1px 14px)`,
      color: p.text, border: `5px solid ${B.white}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', position: 'relative',
    }}>
      <svg width="36%" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ opacity: 0.5 }}>
        <circle cx="32" cy="24" r="9" />
        <path d="M 14 54 C 16 42, 22 38, 32 38 C 42 38, 48 42, 50 54" />
      </svg>
      <div style={{
        position: 'absolute', bottom: 8,
        fontFamily: B.mono, fontSize: 8, letterSpacing: '0.08em',
        textTransform: 'uppercase', opacity: 0.7,
      }}>{label}</div>
    </div>
  );
}

function PhotoBlock({ label, tone = 'warm', ratio = '4/5', radius = B.rLg, style = {} }) {
  const pal = {
    warm:  { bg: '#dcc8a4', text: '#5e6b87' },
    cream: { bg: '#f4ede0', text: '#5e6b87' },
    navy:  { bg: '#142a5c', text: '#a4adc2' },
    city:  { bg: 'linear-gradient(160deg, #0a1f4d, #1f3a7a 60%, #1A6FFF 130%)', text: 'rgba(255,255,255,0.8)' },
  };
  const p = pal[tone] || pal.warm;
  return (
    <div style={{ borderRadius: radius, padding: 8, background: B.white, boxShadow: '0 18px 50px -20px rgba(10,31,77,0.32)', ...style }}>
      <div style={{
        aspectRatio: ratio, borderRadius: radius - 6,
        background: p.bg, color: p.text,
        overflow: 'hidden', position: 'relative',
        display: 'flex', alignItems: 'flex-end', padding: 18,
      }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
          <svg width="20%" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
            <rect x="6" y="10" width="52" height="44" rx="2" />
            <circle cx="22" cy="26" r="5" />
            <path d="M 6 46 L 24 32 L 38 42 L 58 28" />
          </svg>
        </div>
        <span style={{ fontFamily: B.mono, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.8, position: 'relative' }}>
          {label}
        </span>
      </div>
    </div>
  );
}

function Marquee({ items, speed = 50, inverted = false }) {
  const doubled = [...items, ...items];
  return (
    <div style={{
      overflow: 'hidden',
      background: inverted ? B.navy : B.white,
      borderTop: '1px solid rgba(10,31,77,0.08)',
      borderBottom: '1px solid rgba(10,31,77,0.08)',
      padding: '22px 0',
    }}>
      <div style={{
        display: 'flex', gap: 48, whiteSpace: 'nowrap',
        animation: `brand-marquee ${speed}s linear infinite`,
        width: 'max-content',
      }}>
        {doubled.map((it, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 48, flex: '0 0 auto' }}>
            <span style={{ fontFamily: B.font, fontWeight: 600, fontSize: 26, letterSpacing: '-0.025em', color: inverted ? B.mustard : B.navy }}>
              {it}
            </span>
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 999, background: B.mustard }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav({ lang, setLang }) {
  const { isMobile } = useResponsive();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const LangToggle = ({ compact }) => (
    <div style={{ display: 'inline-flex', padding: 3, borderRadius: 999, background: compact ? B.white : B.cream, border: compact ? '1px solid rgba(10,31,77,0.10)' : 'none' }}>
      {['es','en'].map(l => (
        <button key={l} onClick={() => setLang(l)} style={{
          appearance: 'none', border: 0, cursor: 'pointer',
          padding: '5px 10px', borderRadius: 999,
          fontFamily: B.font, fontWeight: 600, fontSize: 11, letterSpacing: '0.06em',
          background: lang === l ? B.navy : 'transparent',
          color: lang === l ? B.mustard : B.ink,
          transition: 'background .15s, color .15s',
        }}>{l.toUpperCase()}</button>
      ))}
    </div>
  );

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: isMobile ? '12px 20px' : '16px 48px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(245,248,255,0.96)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(10,31,77,0.08)' : 'none',
      transition: 'background .3s, border-color .3s',
    }}>
      <img src="/assets/logo-risk-consulting.png" alt="Risk Consulting Seguros" style={{ height: isMobile ? 32 : 40, width: 'auto' }} />

      {isMobile ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <LangToggle compact />
          <Btn variant="navy" size="md" style={{ padding: '10px 16px', fontSize: 11 }}>
            {lang === 'es' ? 'Asesoría' : 'Consult'}
          </Btn>
        </div>
      ) : (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 2,
          background: B.white, border: '1px solid rgba(10,31,77,0.10)',
          borderRadius: 999, padding: 5,
          boxShadow: '0 4px 16px -8px rgba(10,31,77,0.15)',
        }}>
          {DATA.nav.items.map(item => (
            <NavLink key={item.id} href={`#${item.id}`}>{t(item, lang)}</NavLink>
          ))}
          <LangToggle />
          <Btn variant="navy" size="md" style={{ marginLeft: 6 }}>{t(DATA.nav.cta, lang)}</Btn>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, children }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: '9px 13px', borderRadius: 999,
        fontFamily: B.font, fontSize: 12, fontWeight: 500,
        color: B.ink, opacity: hov ? 1 : 0.8,
        background: hov ? B.cream : 'transparent',
        transition: 'background .15s, opacity .15s',
      }}>{children}</a>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ lang }) {
  const { isMobile } = useResponsive();
  const [a, b] = DATA.hero.title[lang];
  return (
    <section id="hero" style={{ background: B.cream, overflow: 'hidden', paddingTop: 88 }}>
      <Wrap style={{ paddingTop: 40 }}>
        {/* top bar */}
        <div style={{
          display: 'flex', justifyContent: isMobile ? 'space-between' : 'space-between',
          fontFamily: B.mono, fontSize: 11,
          color: B.ash, letterSpacing: '0.1em', textTransform: 'uppercase',
          paddingBottom: 28, borderBottom: '1px solid rgba(10,31,77,0.10)',
          gap: 12,
        }}>
          <span style={{ whiteSpace: 'nowrap' }}>{lang === 'es' ? 'Edición 2026 · Bogotá' : 'Edition 2026 · Bogotá'}</span>
          <span style={{ color: B.mustard, fontWeight: 600, whiteSpace: 'nowrap' }}>● {lang === 'es' ? '24h · Activa' : '24h · Active'}</span>
          {!isMobile && <span>{lang === 'es' ? 'Consultoría · Aseguramiento · Riesgos' : 'Consulting · Insurance · Risk'}</span>}
        </div>

        {/* headline */}
        <div style={{ position: 'relative', paddingTop: 52, paddingBottom: isMobile ? 40 : 52 }}>
          <h1 style={{
            fontFamily: B.font, fontWeight: 700,
            fontSize: 'clamp(52px, 12vw, 192px)',
            letterSpacing: '-0.05em', lineHeight: 0.88,
            color: B.navy, margin: 0,
          }}>
            <span style={{ display: 'block' }}>{a}</span>
            <span style={{ display: 'block', textAlign: isMobile ? 'left' : 'right', color: B.mustard, fontStyle: 'italic', fontWeight: 600 }}>{b}</span>
          </h1>

          {/* floating card — desktop only */}
          {!isMobile && (
            <div style={{
              position: 'absolute', left: 0, top: '52%',
              width: 340, background: B.white, borderRadius: B.rLg,
              padding: '22px 24px 24px',
              display: 'flex', flexDirection: 'column', gap: 14,
              transform: 'rotate(-1.5deg)',
              boxShadow: '0 24px 50px -20px rgba(10,31,77,0.22), 0 4px 12px -6px rgba(10,31,77,0.1)',
              border: '1px solid rgba(10,31,77,0.06)', zIndex: 2,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: B.font, fontSize: 10, fontWeight: 600, color: B.ash, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                <span>{lang === 'es' ? 'Sobre nosotros' : 'About us'}</span>
                <NumBadge n={1} tone="mustard" size={26} />
              </div>
              <p style={{ fontFamily: B.font, fontSize: 13.5, lineHeight: 1.55, color: B.ink, margin: 0 }}>
                {lang === 'es'
                  ? 'Firma de consultoría en riesgos y aseguramiento. Acompañamos a personas y empresas en proteger lo que más valoran.'
                  : 'A risk consulting and insurance brokerage. We support individuals and businesses in protecting what they value most.'}
              </p>
              <Btn variant="navy" size="md">{lang === 'es' ? 'Conócenos' : 'Get to know us'} →</Btn>
            </div>
          )}
        </div>

        {/* body + stats */}
        {isMobile ? (
          <div style={{ paddingBottom: 48 }}>
            <p style={{ fontFamily: B.font, fontSize: 15, lineHeight: 1.6, color: B.ash, margin: '0 0 32px' }}>
              {t(DATA.hero.body, lang)}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderTop: '1px solid rgba(10,31,77,0.10)', paddingTop: 28 }}>
              {DATA.hero.stats.map((s, i) => (
                <div key={i} style={{ paddingLeft: i > 0 ? 16 : 0, borderLeft: i > 0 ? '1px solid rgba(10,31,77,0.10)' : 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ fontFamily: B.font, fontWeight: 700, fontSize: 36, lineHeight: 0.92, color: B.navy, letterSpacing: '-0.04em' }}>
                    {s.value}
                  </div>
                  <div style={{ fontFamily: B.font, fontSize: 9, fontWeight: 600, color: B.mustard, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {t(s.label, lang)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', borderTop: '1px solid rgba(10,31,77,0.10)', paddingTop: 28, paddingBottom: 48 }}>
            <div style={{ paddingRight: 28 }}>
              <p style={{ fontFamily: B.font, fontSize: 15, lineHeight: 1.6, color: B.ash, margin: 0 }}>
                {t(DATA.hero.body, lang)}
              </p>
            </div>
            {DATA.hero.stats.map((s, i) => (
              <div key={i} style={{ paddingLeft: 28, borderLeft: '1px solid rgba(10,31,77,0.10)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: B.font, fontWeight: 700, fontSize: 56, lineHeight: 0.92, color: B.navy, letterSpacing: '-0.04em' }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: B.font, fontSize: 11, fontWeight: 600, color: B.mustard, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 12 }}>
                  {t(s.label, lang)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Wrap>

      <Marquee items={DATA.clients.map(c => t(c, lang))} speed={50} />
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

const ABOUT_CARDS = [
  { tone: 'cream',   titleEs: 'Experiencia técnica', titleEn: 'Technical experience', descEs: 'Profesionales con conocimiento técnico, jurídico y estratégico del sector asegurador.', descEn: 'Professionals with technical, legal and strategic knowledge of the insurance sector.' },
  { tone: 'warm',    titleEs: 'Visión estratégica',  titleEn: 'Strategic vision',     descEs: 'Programas integrales para proteger patrimonio, operación y tranquilidad.',            descEn: 'Integral programs to protect assets, operations and peace of mind.' },
  { tone: 'mustard', titleEs: 'Cercanía humana',     titleEn: 'Human closeness',      descEs: 'Relaciones sostenibles basadas en confianza, respaldo y acompañamiento real.',         descEn: 'Sustainable relationships built on trust, support and real partnership.' },
];

function About({ lang }) {
  const { isMobile } = useResponsive();
  return (
    <section id="about" style={{ background: B.cream, padding: isMobile ? '80px 0' : '120px 0' }}>
      <Wrap>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr', gap: isMobile ? 32 : 56, alignItems: 'end', marginBottom: 64 }}>
          <Reveal>
            <div>
              <p style={{ fontFamily: B.font, fontWeight: 600, fontSize: 12, color: B.mustard, letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 14px' }}>
                — {lang === 'es' ? 'Quiénes somos' : 'Who we are'}
              </p>
              <h2 style={{ fontFamily: B.font, fontWeight: 700, fontSize: isMobile ? 36 : 50, lineHeight: 1.04, letterSpacing: '-0.035em', color: B.ink, margin: 0 }}>
                {lang === 'es' ? <>Más que intermediarios,<br /><span style={{ color: B.mustard }}>somos aliados estratégicos.</span></> : <>More than brokers,<br /><span style={{ color: B.mustard }}>we are strategic partners.</span></>}
              </h2>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <p style={{ fontFamily: B.font, fontSize: 16, lineHeight: 1.65, color: B.ash, margin: 0, maxWidth: 520 }}>
              {t(DATA.about.body, lang)}
            </p>
          </Reveal>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 24 }}>
          {ABOUT_CARDS.map((c, i) => <AboutCard key={i} card={c} i={i} lang={lang} />)}
        </div>
      </Wrap>
    </section>
  );
}

function AboutCard({ card, i, lang }) {
  const { isMobile } = useResponsive();
  const [ref, inView] = useInView();
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: B.navy, color: B.white, borderRadius: B.rLg,
        padding: '40px 28px 32px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', gap: 20,
        boxShadow: hov ? '0 32px 70px -22px rgba(10,31,77,0.55)' : '0 24px 60px -24px rgba(10,31,77,0.35)',
        transform: inView ? (hov ? 'translateY(-6px)' : 'translateY(0)') : 'translateY(40px)',
        opacity: inView ? 1 : 0,
        transition: inView
          ? `transform .25s ease, box-shadow .25s`
          : `opacity 0.6s ease ${i * 140}ms, transform 0.6s ease ${i * 140}ms`,
        willChange: 'opacity, transform',
        marginTop: isMobile ? 0 : 68,
      }}>
      {!isMobile && (
        <div style={{ marginTop: -68 }}>
          <CirclePhoto size={128} label={lang === 'es' ? ['equipo','reunión','cliente'][i] : ['team','meeting','client'][i]} tone={card.tone} />
        </div>
      )}
      <div style={{ fontFamily: B.font, fontWeight: 700, fontSize: 21, letterSpacing: '-0.02em' }}>
        {lang === 'es' ? card.titleEs : card.titleEn}
      </div>
      <p style={{ fontFamily: B.font, fontSize: 14, lineHeight: 1.55, color: B.whiteSoft, margin: 0 }}>
        {lang === 'es' ? card.descEs : card.descEn}
      </p>
      <div style={{ width: 32, height: 3, background: B.mustard, borderRadius: 999, marginTop: 'auto' }} />
    </div>
  );
}

// ─── Numbered Split ───────────────────────────────────────────────────────────

function Split({ lang, chapter, eyebrow, title, rows, photoLabel, photoLabel2, photoTone = 'warm', photoSide = 'left', bg = B.navy, id }) {
  const { isMobile } = useResponsive();
  const isDark = bg === B.navy || bg === B.navyDeep;
  const fg  = isDark ? B.white    : B.ink;
  const sub = isDark ? B.whiteSoft : B.ash;
  const rule = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(10,31,77,0.10)';
  return (
    <section id={id} style={{ background: bg, padding: isMobile ? '72px 0' : '110px 0', color: fg }}>
      <Wrap>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 40 : 72,
          alignItems: 'center',
        }}>
          {/* photos */}
          <Reveal from={photoSide === 'left' ? 'left' : 'right'} style={{ order: isMobile ? 1 : (photoSide === 'left' ? 1 : 2) }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <PhotoBlock label={photoLabel || (lang === 'es' ? 'imagen' : 'image')} tone={photoTone} ratio={isMobile ? '16/9' : '4/5'} style={{ width: '100%' }} />
            {!isMobile && (
              <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
                <ChapterBadge n={chapter} />
                <PhotoBlock label={photoLabel2 || (lang === 'es' ? 'equipo' : 'team')} tone="cream" ratio="16/10" style={{ flex: 1 }} radius={B.rMd} />
              </div>
            )}
            {isMobile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <ChapterBadge n={chapter} size={72} />
                <div style={{ fontFamily: B.font, fontWeight: 700, fontSize: 13, color: fg, opacity: 0.6, letterSpacing: '0.04em' }}>
                  {t(eyebrow, lang)}
                </div>
              </div>
            )}
          </div>
          </Reveal>

          {/* content */}
          <Reveal from={photoSide === 'left' ? 'right' : 'left'} delay={180} style={{ order: isMobile ? 2 : (photoSide === 'left' ? 2 : 1) }}>
          <div>
            {!isMobile && (
              <p style={{ fontFamily: B.font, fontWeight: 600, fontSize: 12, color: B.mustard, letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 14px' }}>
                — {t(eyebrow, lang)}
              </p>
            )}
            <h2 style={{ fontFamily: B.font, fontWeight: 700, fontSize: isMobile ? 30 : 46, lineHeight: 1.06, letterSpacing: '-0.035em', color: fg, margin: 0 }}>
              {t(title, lang)}
            </h2>
            <div style={{ marginTop: isMobile ? 24 : 36, display: 'grid', gap: 16 }}>
              {rows.map((r, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: isMobile ? '44px 1fr' : '60px 1fr', gap: isMobile ? 14 : 20, alignItems: 'start', padding: '18px 0', borderBottom: i < rows.length - 1 ? `1px solid ${rule}` : 'none' }}>
                  <NumBadge n={i + 1} tone={i % 2 === 0 ? 'navy' : 'mustard'} size={isMobile ? 40 : 52} />
                  <div style={{ paddingTop: 4 }}>
                    <div style={{ fontFamily: B.font, fontWeight: 600, fontSize: isMobile ? 16 : 18, letterSpacing: '-0.015em', color: fg, marginBottom: 6 }}>{t(r.t, lang)}</div>
                    <div style={{ fontFamily: B.font, fontSize: 14, lineHeight: 1.55, color: sub }}>{t(r.d, lang)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </Reveal>
        </div>
      </Wrap>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────

function Services({ lang }) {
  return (
    <Split
      lang={lang} chapter={3} bg={B.white} id="services"
      eyebrow={{ es: 'Qué hacemos', en: 'What we do' }}
      title={{ es: 'Soluciones diseñadas para proteger lo que más importa', en: 'Solutions designed to protect what matters most' }}
      photoLabel={lang === 'es' ? 'familia · cobertura' : 'family · cover'}
      photoLabel2={lang === 'es' ? 'reunión de asesoría' : 'advisory session'}
      photoTone="warm" photoSide="left"
      rows={[
        { t: { es: 'Personas',     en: 'Individuals' }, d: { es: 'Vida, salud, accidentes personales, riesgos laborales y protección familiar y patrimonial.', en: 'Life, health, personal accident, occupational risk and family & wealth protection.' } },
        { t: { es: 'Empresas',     en: 'Businesses' },  d: { es: 'Seguros patrimoniales, daños, responsabilidad civil y programas integrales de aseguramiento.', en: 'Property, damage, civil liability and integral corporate insurance programs.' } },
        { t: { es: 'Consultoría', en: 'Consulting' },   d: { es: 'Análisis técnico, gestión de riesgos, reclamaciones y acompañamiento permanente.', en: 'Technical analysis, risk management, claims and continuous partnership.' } },
      ]}
    />
  );
}

// ─── Mission ──────────────────────────────────────────────────────────────────

function Mission({ lang }) {
  const { isMobile } = useResponsive();
  return (
    <section style={{ background: B.navy, color: B.white, padding: isMobile ? '80px 0' : '120px 0', position: 'relative', overflow: 'hidden' }}>
      {!isMobile && <div style={{ position: 'absolute', right: -20, top: -60, fontFamily: B.font, fontWeight: 800, fontSize: 420, lineHeight: 0.78, color: B.white, opacity: 0.04, pointerEvents: 'none', letterSpacing: '-0.08em', userSelect: 'none' }}>04</div>}
      <Wrap style={{ position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr', gap: isMobile ? 40 : 72, alignItems: 'start' }}>
          <Reveal>
          <div>
            <p style={{ fontFamily: B.font, fontWeight: 600, fontSize: 12, color: B.mustard, letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 24px' }}>
              — {lang === 'es' ? 'Nuestra misión' : 'Our mission'}
            </p>
            <div style={{ fontFamily: B.font, fontWeight: 700, fontSize: isMobile ? 26 : 'clamp(30px, 3.2vw, 50px)', lineHeight: 1.2, letterSpacing: '-0.03em', color: B.white }}>
              <span style={{ color: B.mustard, opacity: 0.4 }}>"</span>
              {t(DATA.mission.body, lang)}
              <span style={{ color: B.mustard, opacity: 0.4 }}>"</span>
            </div>
          </div>
          </Reveal>
          <div style={{ display: 'grid', gap: 20, paddingTop: isMobile ? 0 : 8 }}>
            {[DATA.vision, DATA.future].map((block, i) => (
              <Reveal key={i} delay={i * 160} from="right">
              <div style={{ background: i === 0 ? B.mustard : 'transparent', color: i === 0 ? B.white : B.white, border: i === 1 ? '1px solid rgba(255,255,255,0.16)' : 'none', borderRadius: B.rLg, padding: '28px 28px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 999, background: i === 0 ? B.navy : B.mustard, color: B.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: B.font, fontWeight: 700, fontSize: 12 }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div style={{ fontFamily: B.font, fontWeight: 700, fontSize: 20, letterSpacing: '-0.02em' }}>{t(block.label, lang)}</div>
                </div>
                <p style={{ fontFamily: B.font, fontSize: 14, lineHeight: 1.6, color: i === 0 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.78)', margin: 0 }}>
                  {t(block.body, lang)}
                </p>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Wrap>
    </section>
  );
}

// ─── Values ───────────────────────────────────────────────────────────────────

function Values({ lang }) {
  const { isMobile } = useResponsive();
  return (
    <section id="values" style={{ background: B.cream, padding: isMobile ? '80px 0' : '120px 0' }}>
      <Wrap>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 28 : 72, alignItems: 'end', marginBottom: 48 }}>
          <div>
            <p style={{ fontFamily: B.font, fontWeight: 600, fontSize: 12, color: B.mustard, letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 14px' }}>
              — {lang === 'es' ? 'Principios & valores' : 'Principles & values'}
            </p>
            <h2 style={{ fontFamily: B.font, fontWeight: 700, fontSize: isMobile ? 34 : 50, lineHeight: 1.02, letterSpacing: '-0.035em', color: B.ink, margin: 0 }}>
              {lang === 'es' ? <>Ocho compromisos que <span style={{ color: B.mustard }}>guían</span> cada decisión.</> : <>Eight commitments that <span style={{ color: B.mustard }}>shape</span> every decision.</>}
            </h2>
          </div>
          <p style={{ fontFamily: B.font, fontSize: 16, lineHeight: 1.65, color: B.ash, margin: 0, maxWidth: 480 }}>
            {lang === 'es' ? 'No son palabras decorativas. Son criterios que aplicamos antes de aceptar un cliente, antes de recomendar una póliza y durante cada siniestro.' : 'These are not decorative words. They are criteria we apply before accepting a client, recommending a policy, and during every claim.'}
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? 12 : 18 }}>
          {DATA.values.map((v, i) => <ValueCard key={i} v={v} i={i} lang={lang} />)}
        </div>
      </Wrap>
    </section>
  );
}

function ValueCard({ v, i, lang }) {
  const { isMobile } = useResponsive();
  const [ref, inView] = useInView();
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: B.white, borderRadius: B.rLg, padding: isMobile ? '20px 16px 22px' : '26px 22px 28px', display: 'flex', flexDirection: 'column', gap: 14, minHeight: isMobile ? 180 : 220,
        opacity: inView ? 1 : 0,
        transform: inView ? (hov ? 'translateY(-4px)' : 'none') : 'translateY(32px)',
        boxShadow: hov ? '0 18px 40px -16px rgba(10,31,77,0.18)' : 'none',
        transition: inView ? 'transform .2s ease, box-shadow .2s' : `opacity 0.55s ease ${i * 70}ms, transform 0.55s ease ${i * 70}ms`,
        willChange: 'opacity, transform',
      }}>
      <NumBadge n={i + 1} tone={i % 2 === 0 ? 'navy' : 'mustard'} size={isMobile ? 36 : 42} />
      <div style={{ fontFamily: B.font, fontWeight: 700, fontSize: isMobile ? 14 : 17, letterSpacing: '-0.02em', color: B.ink, lineHeight: 1.2 }}>{t(v.t, lang)}</div>
      {!isMobile && <p style={{ fontFamily: B.font, fontSize: 13, lineHeight: 1.55, color: B.ash, margin: 0 }}>{t(v.d, lang)}</p>}
      <div style={{ marginTop: 'auto', height: 3, width: 26, background: i % 2 === 0 ? B.navy : B.mustard, borderRadius: 999 }} />
    </div>
  );
}

// ─── Clients ──────────────────────────────────────────────────────────────────

function Clients({ lang }) {
  return (
    <>
      <Split
        lang={lang} chapter={7} bg={B.navy} id="clients"
        eyebrow={{ es: 'Nuestros clientes', en: 'Our clients' }}
        title={{ es: 'Clientes y sectores que acompañamos', en: 'Clients and sectors we partner with' }}
        photoLabel={lang === 'es' ? 'sector público · bogotá' : 'public sector · bogotá'}
        photoLabel2={lang === 'es' ? 'cliente empresarial' : 'corporate client'}
        photoTone="city" photoSide="left"
        rows={[
          { t: { es: 'Sector público',         en: 'Public sector' },          d: { es: 'Policía Nacional, CAR y entidades gubernamentales.', en: 'National Police, CAR and government entities.' } },
          { t: { es: 'Sector empresarial',      en: 'Corporate sector' },       d: { es: 'Vigilancia y seguridad privada, call centers, transporte y logística, industrial y comercial.', en: 'Security firms, call centers, transport, industrial and commercial.' } },
          { t: { es: 'Relaciones de confianza', en: 'Relationships of trust' }, d: { es: 'Construimos vínculos sostenibles con clientes de distintos sectores económicos.', en: 'We build sustainable bonds across diverse economic sectors.' } },
        ]}
      />
      <div style={{ background: B.navyDeep }}>
        <Marquee items={DATA.clients.map(c => t(c, lang))} speed={42} inverted />
      </div>
    </>
  );
}

// ─── Partners ─────────────────────────────────────────────────────────────────

function PartnerCard({ name, index }) {
  const ref = useRef(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5, active: false });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height, active: true });
  };
  const onLeave = () => setMouse({ x: 0.5, y: 0.5, active: false });

  useEffect(() => {
    const id = `pkf-${index}`;
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `@keyframes pf${index}{0%,100%{margin-top:0}50%{margin-top:${index % 2 === 0 ? '-6px' : '4px'}}}`;
    document.head.appendChild(s);
  }, [index]);

  const rx = (mouse.y - 0.5) * -7;
  const ry = (mouse.x - 0.5) * 9;

  const [revealRef, inView] = useInView();

  return (
    <div ref={revealRef} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'none' : 'translateY(40px)',
      transition: `opacity 0.6s ease ${index * 100}ms, transform 0.6s ease ${index * 100}ms`,
      willChange: 'opacity, transform',
    }}>
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ perspective: 1200, cursor: 'pointer' }}>
      <div style={{
        position: 'relative', background: B.navy, color: B.white,
        borderRadius: B.rLg, padding: '32px 26px 28px', minHeight: 240,
        overflow: 'hidden', transformStyle: 'preserve-3d',
        transform: `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(${mouse.active ? 24 : 0}px) scale(${mouse.active ? 1.015 : 1})`,
        transition: mouse.active ? 'transform 0.12s linear' : 'transform 0.55s cubic-bezier(.2,.7,.2,1)',
        boxShadow: mouse.active ? '0 30px 60px -20px rgba(10,31,77,0.55)' : '0 10px 30px -16px rgba(10,31,77,0.30)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        animation: `pf${index} 6s ease-in-out ${index * 0.4}s infinite`,
      }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at ${mouse.x * 100}% ${mouse.y * 100}%, rgba(26,111,255,0.28), transparent 55%)`, opacity: mouse.active ? 1 : 0, transition: 'opacity .25s', pointerEvents: 'none' }} />
        <svg viewBox="0 0 200 200" style={{ position: 'absolute', right: -36, bottom: -40, width: 180, opacity: 0.45 }} fill="none" stroke={B.mustard} strokeWidth="1.2">
          <circle cx="100" cy="100" r="42" /><circle cx="100" cy="100" r="72" /><circle cx="100" cy="100" r="98" />
          <circle cx="160" cy="55" r="4" fill={B.mustard} stroke="none" />
        </svg>
        <div style={{ fontFamily: B.font, fontWeight: 600, fontSize: 10, color: B.mustard, letterSpacing: '0.16em', textTransform: 'uppercase', transform: 'translateZ(40px)' }}>
          0{index + 1} · Aseguradora
        </div>
        <div style={{ transform: 'translateZ(50px)' }}>
          <div style={{ fontFamily: B.font, fontWeight: 700, fontSize: 22, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 12 }}>{name}</div>
          <div style={{ paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.16)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ width: 24, height: 3, background: B.mustard, borderRadius: 999 }} />
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="13" stroke={B.mustard} strokeOpacity="0.4" />
              <path d="M 10 14 L 18 14 M 14 10 L 18 14 L 14 18" stroke={B.mustard} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

function Partners({ lang }) {
  const { isMobile } = useResponsive();
  return (
    <section id="partners" style={{ background: B.cream, padding: isMobile ? '80px 0' : '120px 0' }}>
      <Wrap>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 28 : 72, alignItems: 'end', marginBottom: 48 }}>
          <div>
            <p style={{ fontFamily: B.font, fontWeight: 600, fontSize: 12, color: B.mustard, letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 14px' }}>
              — {lang === 'es' ? 'Aliados estratégicos' : 'Strategic partners'}
            </p>
            <h2 style={{ fontFamily: B.font, fontWeight: 700, fontSize: isMobile ? 34 : 46, lineHeight: 1.04, letterSpacing: '-0.035em', color: B.ink, margin: 0 }}>
              {t(DATA.partners.title, lang)}
            </h2>
          </div>
          <p style={{ fontFamily: B.font, fontSize: 16, lineHeight: 1.65, color: B.ash, margin: 0, maxWidth: 480 }}>
            {t(DATA.partners.body, lang)}
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? 12 : 18 }}>
          {DATA.partners.items.map((p, i) => <PartnerCard key={p} name={p} index={i} />)}
        </div>
        <div style={{ marginTop: 28, paddingTop: 18, borderTop: '1px solid rgba(10,31,77,0.10)', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: 8, fontFamily: B.font, fontWeight: 600, fontSize: 11, color: B.ash, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          <span>+ {lang === 'es' ? '12 aseguradoras adicionales en alianza' : '12 additional partner insurers'}</span>
          {!isMobile && <span style={{ color: B.mustard }}>{lang === 'es' ? 'Pasa el cursor →' : 'Hover any card →'}</span>}
        </div>
      </Wrap>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function Contact({ lang }) {
  const { isMobile } = useResponsive();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', clientType: 'P', message: '' });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  const inp = { width: '100%', padding: '13px 16px', fontFamily: B.font, fontSize: 14, background: B.cream, border: '1.5px solid transparent', borderRadius: B.rMd, color: B.ink, outline: 'none', transition: 'border-color .15s', boxSizing: 'border-box' };
  const lbl = { display: 'block', marginBottom: 7, fontFamily: B.font, fontWeight: 600, fontSize: 11, color: B.ash, letterSpacing: '0.12em', textTransform: 'uppercase' };

  return (
    <section id="contact" style={{ background: B.navy, color: B.white, padding: isMobile ? '72px 0' : '110px 0' }}>
      <Wrap>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 48 : 56, alignItems: 'start' }}>
          <Reveal from="left">
          <div>
            <p style={{ fontFamily: B.font, fontWeight: 600, fontSize: 12, color: B.mustard, letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 14px' }}>
              — {lang === 'es' ? 'Hablemos' : "Let's talk"}
            </p>
            <h2 style={{ fontFamily: B.font, fontWeight: 700, fontSize: isMobile ? 30 : 46, lineHeight: 1.06, letterSpacing: '-0.035em', color: B.white, margin: 0 }}>
              {t(DATA.contact.title, lang)}
            </h2>
            <p style={{ fontFamily: B.font, fontSize: 16, lineHeight: 1.65, color: B.whiteSoft, margin: '22px 0 36px', maxWidth: 440 }}>
              {t(DATA.contact.body, lang)}
            </p>
            <div style={{ display: 'grid', gap: 12 }}>
              {DATA.contact.coords.map((c, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: 16, alignItems: 'center', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
                  <NumBadge n={i + 1} tone={i % 2 === 0 ? 'mustard' : 'navy'} size={40} />
                  <div>
                    <div style={{ fontFamily: B.font, fontWeight: 600, fontSize: 10, color: B.mustard, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t(c.label, lang)}</div>
                    <div style={{ fontFamily: B.font, fontSize: 14, color: B.white, marginTop: 3, fontWeight: 500 }}>{typeof c.v === 'string' ? c.v : t(c.v, lang)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </Reveal>

          <Reveal from="right" delay={150}>
          <form onSubmit={onSubmit} style={{ background: B.white, borderRadius: B.rLg, padding: isMobile ? 24 : 36, color: B.ink, display: 'grid', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
              <div>
                <label style={lbl}>{lang === 'es' ? 'Nombre' : 'Name'}</label>
                <input style={inp} value={form.name} onChange={set('name')} required onFocus={e => { e.target.style.borderColor = B.mustard; }} onBlur={e => { e.target.style.borderColor = 'transparent'; }} />
              </div>
              <div>
                <label style={lbl}>{lang === 'es' ? 'Teléfono' : 'Phone'}</label>
                <input style={inp} value={form.phone} onChange={set('phone')} onFocus={e => { e.target.style.borderColor = B.mustard; }} onBlur={e => { e.target.style.borderColor = 'transparent'; }} />
              </div>
            </div>
            <div>
              <label style={lbl}>{lang === 'es' ? 'Correo electrónico' : 'Email'}</label>
              <input type="email" style={inp} value={form.email} onChange={set('email')} required onFocus={e => { e.target.style.borderColor = B.mustard; }} onBlur={e => { e.target.style.borderColor = 'transparent'; }} />
            </div>
            <div>
              <label style={lbl}>{lang === 'es' ? 'Tipo de cliente' : 'Client type'}</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {[{ v: 'P', es: 'Persona natural', en: 'Individual' }, { v: 'E', es: 'Empresa', en: 'Business' }].map(opt => (
                  <button key={opt.v} type="button" onClick={() => setForm(f => ({ ...f, clientType: opt.v }))}
                    style={{ flex: 1, padding: '12px 14px', borderRadius: B.rMd, border: form.clientType === opt.v ? `1.5px solid ${B.navy}` : '1.5px solid transparent', background: form.clientType === opt.v ? B.navy : B.cream, color: form.clientType === opt.v ? B.white : B.ink, fontFamily: B.font, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all .15s' }}>
                    {lang === 'es' ? opt.es : opt.en}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={lbl}>{lang === 'es' ? '¿Qué quieres proteger?' : 'What do you want to protect?'}</label>
              <textarea style={{ ...inp, minHeight: 100, resize: 'vertical' }} value={form.message} onChange={set('message')} onFocus={e => { e.target.style.borderColor = B.mustard; }} onBlur={e => { e.target.style.borderColor = 'transparent'; }} />
            </div>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between', gap: 12, marginTop: 2 }}>
              <span style={{ fontFamily: B.font, fontSize: 11, fontWeight: 600, color: sent ? '#22c55e' : B.ash, letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'color .3s' }}>
                {sent ? (lang === 'es' ? '✓ Recibido — te contactamos pronto.' : '✓ Received — we\'ll reach out shortly.') : (lang === 'es' ? 'Respuesta en 24h' : '24h response')}
              </span>
              <Btn variant="mustard" style={isMobile ? { justifyContent: 'center' } : {}}>{lang === 'es' ? 'Solicitar diagnóstico' : 'Request diagnostic'} →</Btn>
            </div>
          </form>
          </Reveal>
        </div>
      </Wrap>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ lang }) {
  const { isMobile } = useResponsive();
  return (
    <footer style={{ background: B.navyDeep, color: B.white, padding: isMobile ? '48px 0 24px' : '56px 0 28px' }}>
      <Wrap>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.3fr 1fr 1fr', gap: isMobile ? 36 : 52, paddingBottom: 36 }}>
          <div>
            <div style={{ background: B.white, borderRadius: B.rLg, padding: '7px 18px 7px 6px', display: 'inline-flex', alignItems: 'center', marginBottom: 18 }}>
              <img src="/assets/logo-risk-consulting.png" alt="Risk Consulting Seguros" style={{ height: 40, width: 'auto' }} />
            </div>
            <p style={{ fontFamily: B.font, fontSize: 13, lineHeight: 1.55, color: B.whiteSoft, margin: 0, maxWidth: 360 }}>
              {t(DATA.footer.legal, lang)}
            </p>
          </div>
          <div>
            <p style={{ fontFamily: B.font, fontWeight: 600, fontSize: 11, color: B.mustard, letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 14px' }}>
              {lang === 'es' ? 'Contacto' : 'Contact'}
            </p>
            <div style={{ fontFamily: B.font, fontSize: 14, lineHeight: 1.85, color: B.whiteSoft }}>
              <div>contacto@riskconsultingvg.co</div>
              <div>+57 (601) 745 80 22</div>
              <div>Carrera 11 #82-71, Bogotá D.C.</div>
            </div>
          </div>
          <div>
            <p style={{ fontFamily: B.font, fontWeight: 600, fontSize: 11, color: B.mustard, letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 14px' }}>
              {lang === 'es' ? 'Navegación' : 'Navigation'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {DATA.nav.items.map(item => (
                <FooterLink key={item.id} href={`#${item.id}`}>{t(item, lang)}</FooterLink>
              ))}
            </div>
          </div>
        </div>
        <div style={{ paddingTop: 22, borderTop: '1px solid rgba(255,255,255,0.10)', fontFamily: B.font, fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.04em', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: 8 }}>
          <span>{t(DATA.footer.rights, lang)}</span>
          <span>Bogotá D.C. · Colombia</span>
        </div>
      </Wrap>
    </footer>
  );
}

function FooterLink({ href, children }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ fontFamily: B.font, fontSize: 14, color: hov ? B.mustard : B.whiteSoft, transition: 'color .15s' }}>
      {children}
    </a>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [lang, setLang] = useLang();
  const [width, setWidth] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1280);

  useEffect(() => {
    const fn = () => setWidth(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  return (
    <ResponsiveCtx.Provider value={{ isMobile: width < 768, isTablet: width < 1024 }}>
      <div style={{ background: B.white, fontFamily: B.font }}>
        <Nav lang={lang} setLang={setLang} />
        <Hero lang={lang} />
        <About lang={lang} />
        <Services lang={lang} />
        <Mission lang={lang} />
        <Values lang={lang} />
        <Clients lang={lang} />
        <Partners lang={lang} />
        <Contact lang={lang} />
        <Footer lang={lang} />
      </div>
    </ResponsiveCtx.Provider>
  );
}
