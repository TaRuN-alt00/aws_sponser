import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import data from "./data.json";

Chart.register(...registerables);
gsap.registerPlugin(ScrollTrigger);
type Tier = (typeof data.tiers)[number];
type ChartItem = { label: string; value: string | number };
const placeholder = (v: string) => /^\[.+\]$/.test(v.trim());
const numeric = (v: string | number) => {
  const n = typeof v === "number" ? v : Number(v.replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 12h16m-6-6 6 6-6 6" />
  </svg>
);
const Divider = () => (
  <div className="divider" aria-hidden="true">
    <span />
    <svg viewBox="0 0 120 24">
      <path d="M2 12h27c7 0 7-8 15-8s8 16 16 16S68 4 76 4s8 8 15 8h27M40 12c0 8 8 8 20 0s20-8 20 0" />
      <circle cx="60" cy="12" r="2.5" />
    </svg>
    <span />
  </div>
);
const Heading = ({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) => (
  <header className="section-head reveal">
    <p className="eyebrow">{eyebrow}</p>
    <h2>{title}</h2>
    {intro && <p className="intro">{intro}</p>}
  </header>
);

function OpeningAnimation({ complete }: { complete: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const eventName = data.fest.name;

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    document.documentElement.classList.add("opening-active");

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      complete();
      return () => document.documentElement.classList.remove("opening-active");
    }

    timeline.current = gsap
      .timeline({ onComplete: complete })
      .fromTo(
        node.querySelector(".opening-mark"),
        { x: "-55vw", rotate: -720, opacity: 0 },
        { x: 0, rotate: 0, opacity: 1, duration: 1.25, ease: "power4.out" },
      )
      .fromTo(
        node.querySelector(".opening-title"),
        { clipPath: "inset(0 100% 0 0)", opacity: 0, letterSpacing: "0.2em" },
        {
          clipPath: "inset(0 0% 0 0%)",
          opacity: 1,
          letterSpacing: "0.06em",
          duration: 0.8,
          ease: "power4.out",
        },
        "-=0.45",
      )
      .fromTo(
        node.querySelector(".opening-event"),
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: "power2.out" },
        "-=0.25",
      )
      .to(node, { opacity: 0, duration: 0.65, delay: 0.65, ease: "power2.inOut" });

    return () => {
      timeline.current?.kill();
      document.documentElement.classList.remove("opening-active");
    };
  }, [complete]);

  const skip = () => {
    timeline.current?.kill();
    gsap.to(root.current, { opacity: 0, duration: 0.25, onComplete: complete });
  };

  return (
    <div className="opening" ref={root} role="status" aria-label={`Introducing ${eventName}`}>
      <div className="opening-crest" aria-hidden="true">
        <span />
        <i />
      </div>
      <div className="opening-stage">
        <img className="opening-mark" src={data.organizer.clubLogo} alt="" />
        <h1 className="opening-title">{data.organizer.name}</h1>
        <div className="opening-event">
          <span>Presents</span>
          <b>{eventName}</b>
          <i>Sponsorship prospectus · 2026</i>
        </div>
      </div>
      <button onClick={skip}>Skip intro</button>
    </div>
  );
}

function Hero() {
  const [left, setLeft] = useState({ days: "--", hours: "--", minutes: "--", seconds: "--" });
  useEffect(() => {
    const target = new Date(data.fest.countdownDate).getTime();
    if (!Number.isFinite(target)) return;
    const tick = () => {
      const d = Math.max(0, target - Date.now());
      setLeft({
        days: String(Math.floor(d / 86400000)).padStart(2, "0"),
        hours: String(Math.floor(d / 3600000) % 24).padStart(2, "0"),
        minutes: String(Math.floor(d / 60000) % 60).padStart(2, "0"),
        seconds: String(Math.floor(d / 1000) % 60).padStart(2, "0"),
      });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const brochure = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (placeholder(data.fest.brochureUrl)) {
      e.preventDefault();
      alert("Add the brochure URL in src/data.json.");
    }
  };
  return (
    <section className="hero" id="top">
      <div className="hero-photo" style={{ backgroundImage: `url("${data.fest.heroImage}")` }} />
      <div className="fog fog-a" />
      <div className="fog fog-b" />
      <div className="hero-banners" aria-hidden="true">
        {["gold", "platinum", "bronze"].map((t, i) => (
          <div className={`distant d${i}`} key={t}>
            <i />
            <img
              src={`/assets/banners/banner-${t}.png`}
              alt=""
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
            />
          </div>
        ))}
      </div>
      <nav className="nav shell" aria-label="Primary">
        <a className="brand" href="#top">
          <span className="brand-marks">
            <img src={data.organizer.instituteLogo} alt="NIT Jalandhar" />
            <i />
            <img src={data.organizer.clubLogo} alt={data.organizer.name} />
          </span>
          <span>
            {data.fest.name}
            <small>{data.organizer.name}</small>
          </span>
        </a>
        <div>
          <a href="#events">Events</a>
          <a href="#tiers">Tiers</a>
          <a href="#contact">Contact</a>
        </div>
        <a className="nav-cta" href="#contact">
          Sponsor the fest
        </a>
      </nav>
      <div className="hero-copy shell">
        <div className="day-banner">
          <span>{data.fest.announcement}</span>
          <b>{data.fest.announcementDate}</b>
        </div>
        <p className="kicker">{data.fest.edition} · Sponsorship prospectus</p>
        <h1>{data.fest.name}</h1>
        <p className="tagline">{data.fest.tagline}</p>
        <p className="date">
          {data.fest.dateLabel}
          <i />
          {data.fest.venue}
        </p>
        <div className="countdown">
          {Object.entries(left).map(([k, v]) => (
            <div key={k}>
              <b>{v}</b>
              <span>{k}</span>
            </div>
          ))}
        </div>
        <div className="actions">
          <a className="button primary" href="#contact">
            Become a Sponsor <Arrow />
          </a>
          <a className="button secondary" href={data.fest.brochureUrl} onClick={brochure}>
            Download Brochure <Arrow />
          </a>
        </div>
      </div>
      <a
        className="credit"
        href="https://unsplash.com/@marekpiwnicki"
        target="_blank"
        rel="noreferrer"
      >
        {data.fest.heroImageCredit}
      </a>
    </section>
  );
}

function About() {
  return (
    <section className="section about" id="about">
      <div className="shell about-grid">
        <span className="roman reveal">I</span>
        <div className="reveal">
          <p className="eyebrow">The empire</p>
          <h2>A thoughtful platform for meaningful partnerships.</h2>
        </div>
        <p className="about-copy reveal">{data.about.copy}</p>
      </div>
    </section>
  );
}

function Numbers() {
  return (
    <section className="section numbers">
      <Divider />
      <div className="shell">
        <Heading eyebrow="Scale at a glance" title="The field, in numbers." />
        <div className="number-grid">
          {data.numbers.map((n, i) => (
            <article className="number reveal" key={n.label}>
              <i>{String(i + 1).padStart(2, "0")}</i>
              <b className="counter" data-value={n.value}>
                {n.value}
              </b>
              <span>{n.label}</span>
            </article>
          ))}
        </div>
        <p className="note">
          Placeholders remain visible until verified figures are supplied in{" "}
          <code>src/data.json</code>.
        </p>
      </div>
    </section>
  );
}

function Events() {
  return (
    <section className="section events" id="events">
      <Divider />
      <div className="shell">
        <Heading
          eyebrow="A proven builder community"
          title="Momentum already in motion."
          intro="Two completed hackathons demonstrate the organising team’s ability to bring technical ideas, participants and execution together."
        />
        <div className="past-event-grid">
          {data.pastEvents.map((event, i) => (
            <article
              className="past-event reveal"
              data-index={String(i + 1).padStart(2, "0")}
              key={event.name}
            >
              <span>
                0{i + 1} · Completed {event.type}
              </span>
              <h3>{event.name}</h3>
              <p>{event.description}</p>
              <b>Successfully delivered</b>
            </article>
          ))}
        </div>
        <div className="programme-head reveal">
          <p className="eyebrow">Sponsorable programme</p>
          <h3>Future points of attention.</h3>
        </div>
        <div className="event-grid">
          {data.events.map((e, i) => (
            <article className="event reveal" key={`${e.name}${i}`}>
              <header>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {e.namingRights && <b>Naming rights available</b>}
              </header>
              <h3>{e.name}</h3>
              <p>{e.description}</p>
              <footer>
                <span>Expected participants</span>
                <b>{e.participants}</b>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AudienceChart({
  title,
  items,
  type,
}: {
  title: string;
  items: ChartItem[];
  type: "doughnut" | "bar";
}) {
  const ref = useRef<HTMLCanvasElement>(null),
    hasData = items.some((x) => numeric(x.value) !== null);
  useEffect(() => {
    if (!ref.current || !hasData) return;
    const chart = new Chart(ref.current, {
      type,
      data: {
        labels: items.map((x) => x.label),
        datasets: [
          {
            data: items.map((x) => numeric(x.value) ?? 0),
            backgroundColor:
              type === "doughnut"
                ? ["#d2d5da", "#a8adb5", "#7f868f", "#5f666f", "#40454c"]
                : "#aeb3bb",
            borderColor: "#202328",
            borderWidth: 1,
            borderRadius: type === "bar" ? 3 : 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: type === "doughnut" ? "68%" : undefined,
        indexAxis: type === "bar" ? "y" : undefined,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#0e0f11",
            callbacks: { label: (c) => `${c.label}: ${c.raw}%` },
          },
        },
        scales:
          type === "bar"
            ? {
                x: { beginAtZero: true, grid: { color: "#30343a" }, ticks: { color: "#80868f" } },
                y: { grid: { display: false }, ticks: { color: "#c0c4cc" } },
              }
            : undefined,
      },
    });
    return () => chart.destroy();
  }, [hasData, items, type]);
  return (
    <article className="chart-card reveal">
      <header>
        <span>Audience split</span>
        <h3>{title}</h3>
      </header>
      <div className={`chart ${hasData ? "" : "empty"}`}>
        {hasData ? (
          <canvas ref={ref} aria-label={`${title} chart`} />
        ) : (
          <div>
            <b>Data required</b>
            <span>Replace percentage placeholders in data.json</span>
          </div>
        )}
      </div>
      <div className="legend">
        {items.map((x) => (
          <span key={x.label}>
            <i />
            {x.label}
            <b>{x.value}</b>
          </span>
        ))}
      </div>
    </article>
  );
}
function Audience() {
  return (
    <section className="section audience">
      <Divider />
      <div className="shell">
        <Heading
          eyebrow="Audience profile"
          title="Know who will see your name."
          intro="Verified branch and year distribution updates both charts from one file."
        />
        <div className="chart-grid">
          <AudienceChart title="Branch-wise" items={data.audience.branchWise} type="doughnut" />
          <AudienceChart title="Year-wise" items={data.audience.yearWise} type="bar" />
        </div>
      </div>
    </section>
  );
}

function Banner({
  tier,
  open,
  featured = false,
}: {
  tier: Tier;
  open: (t: Tier) => void;
  featured?: boolean;
}) {
  const [missing, setMissing] = useState(false);
  return (
    <button
      className={`banner tier-${tier.id}${featured ? " featured-banner" : ""}`}
      onClick={() => open(tier)}
      aria-label={`View ${tier.name} details`}
    >
      <span className="pole">
        <i />
        <i />
      </span>
      <span className="banner-art">
        {!missing ? (
          <img
            src={tier.banner}
            alt={`${tier.name} sponsorship battle banner`}
            loading="lazy"
            onError={() => setMissing(true)}
          />
        ) : (
          <span className="asset">
            <b>{tier.name}</b>
            <small>Sponsorship House</small>
          </span>
        )}
      </span>
      <span className="banner-label">
        <b>{tier.name}</b>
        <small>{tier.amount}</small>
      </span>
    </button>
  );
}

function Tiers({ select }: { select: (s: string) => void }) {
  const [active, setActive] = useState<Tier | null>(null);
  const order = [data.tiers[1], data.tiers[0], data.tiers[2]];
  useEffect(() => {
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 80);
    return () => window.clearTimeout(refresh);
  }, [active]);
  const choose = () => {
    if (!active) return;
    select(active.name);
    setTimeout(
      () => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }),
      50,
    );
  };
  return (
    <section className="section tiers" id="tiers">
      <Divider />
      <div className="shell">
        <Heading
          eyebrow="Choose your house"
          title="Three positions. One shared standard."
          intro="Open a banner to inspect the complete deliverables."
        />
        {active ? (
          <>
            <div className="tier-switches" aria-label="Sponsorship tiers">
              {order.map((t) => (
                <button
                  className={active.id === t.id ? "active" : ""}
                  onClick={() => setActive(t)}
                  key={t.id}
                >
                  {t.name}
                </button>
              ))}
              <button onClick={() => setActive(null)}>View all flags</button>
            </div>
            <div className="tier-showcase">
              <div className="showcase-flag">
                <Banner tier={active} open={setActive} featured />
              </div>
              <article className="tier-details" key={active.id}>
                <p className="eyebrow">Sponsorship house</p>
                <header>
                  <div>
                    <span>Selected position</span>
                    <h3>{active.name}</h3>
                  </div>
                  <b>{active.amount}</b>
                </header>
                <div className="tier-detail-grid">
                  <div>
                    <h4>Included benefits</h4>
                    <ul>
                      {active.benefits.map((benefit) => (
                        <li key={benefit}>
                          <i>✓</i>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <dl>
                    <div>
                      <dt>Logo placement</dt>
                      <dd>{active.logoPlacement}</dd>
                    </div>
                    <div>
                      <dt>Stall space</dt>
                      <dd>{active.stallSpace}</dd>
                    </div>
                    <div>
                      <dt>Naming rights</dt>
                      <dd>{active.namingRights}</dd>
                    </div>
                    <div>
                      <dt>Delegate passes</dt>
                      <dd>{active.passes}</dd>
                    </div>
                  </dl>
                </div>
                <button className="button primary" onClick={choose}>
                  Discuss this tier <Arrow />
                </button>
              </article>
            </div>
          </>
        ) : (
          <>
            <div className="banner-rail">
              {order.map((t) => (
                <Banner tier={t} open={setActive} key={t.id} />
              ))}
            </div>
            <p className="swipe">Swipe to inspect banners</p>
          </>
        )}
        <div className="comparison comparison-build">
          <header>
            <b>Tier comparison</b>
            <span>Confirmed inclusions at a glance</span>
          </header>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Placement</th>
                  {data.tiers.map((t) => (
                    <th key={t.id}>{t.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.comparison.map((r) => (
                  <tr key={r.feature}>
                    <td>{r.feature}</td>
                    <td>{r.platinum ? "✓" : "—"}</td>
                    <td>{r.gold ? "✓" : "—"}</td>
                    <td>{r.bronze ? "✓" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function SponsorWall() {
  return (
    <section className="section wall">
      <Divider />
      <div className="shell">
        <Heading eyebrow="Confirmed allies" title="The sponsor wall." />
        <div className="wall-list">
          {data.tiers.map((t) => {
            const list = data.sponsors[t.id as keyof typeof data.sponsors] as {
              name: string;
              logo: string;
            }[];
            return (
              <div className="wall-row reveal" key={t.id}>
                <header>
                  <b>{t.name}</b>
                  <span>House</span>
                </header>
                <div>
                  {(list.length ? list : [{ name: "Slot Available", logo: "" }]).map((s, i) => (
                    <figure key={`${s.name}${i}`}>
                      {s.logo ? (
                        <img src={s.logo} alt={`${s.name} logo`} loading="lazy" />
                      ) : (
                        <span>
                          <i>+</i>
                          {s.name}
                        </span>
                      )}
                    </figure>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Highlights() {
  const h = data.highlights;
  if (!h.images.length && !h.aftermovieUrl) return null;
  return (
    <section className="section highlights">
      <Divider />
      <div className="shell">
        <Heading eyebrow="Past highlights" title="See the festival in motion." />
        <div>
          {h.images.map((x: { src: string; alt: string }) => (
            <img src={x.src} alt={x.alt} loading="lazy" key={x.src} />
          ))}
          {h.aftermovieUrl && (
            <iframe
              src={h.aftermovieUrl}
              title="Festival aftermovie"
              loading="lazy"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </section>
  );
}

function Contact({ tier, setTier }: { tier: string; setTier: (s: string) => void }) {
  const [status, setStatus] = useState(""),
    [sending, setSending] = useState(false);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (placeholder(data.contact.formspreeEndpoint)) {
      setStatus("Add your Formspree endpoint in src/data.json to activate submissions.");
      return;
    }
    setSending(true);
    setStatus("");
    try {
      const res = await fetch(data.contact.formspreeEndpoint, {
        method: "POST",
        body: new FormData(e.currentTarget),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw Error();
      e.currentTarget.reset();
      setTier("");
      setStatus("Inquiry sent. The sponsorship team will follow up.");
    } catch {
      setStatus(`The form could not be sent. Please email ${data.contact.email}.`);
    } finally {
      setSending(false);
    }
  };
  return (
    <section className="section contact" id="contact">
      <Divider />
      <div className="shell contact-grid">
        <div className="contact-copy reveal">
          <p className="eyebrow">Open a conversation</p>
          <h2>Let’s shape a partnership that fits.</h2>
          <p>
            Share your goals with us, and our sponsorship team will thoughtfully recommend the right
            tier, event, and on-ground presence for your company.
          </p>
          <div className="team">
            {data.contact.team.map((p) => (
              <div key={p.role}>
                <span>{p.role}</span>
                <b>{p.name}</b>
                <a href={`tel:${p.phone}`}>{p.phone}</a>
              </div>
            ))}
          </div>
          <a className="email" href={`mailto:${data.contact.email}`}>
            {data.contact.email} <Arrow />
          </a>
        </div>
        <form className="form reveal" onSubmit={submit}>
          <header>
            <b>Sponsorship inquiry</b>
            <span>Required fields marked *</span>
          </header>
          <label>
            Company *
            <input name="company" required autoComplete="organization" placeholder="Company name" />
          </label>
          <div className="fields">
            <label>
              Contact person *
              <input name="name" required autoComplete="name" placeholder="Full name" />
            </label>
            <label>
              Work email *
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="name@company.com"
              />
            </label>
          </div>
          <div className="fields">
            <label>
              Phone *<input name="phone" type="tel" required autoComplete="tel" placeholder="+91" />
            </label>
            <label>
              Tier interested
              <select name="tier" value={tier} onChange={(e) => setTier(e.target.value)}>
                <option value="">Select a tier</option>
                {data.tiers.map((t) => (
                  <option key={t.id}>{t.name}</option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Message
            <textarea
              name="message"
              rows={4}
              placeholder="Objectives, event interest, or questions"
            />
          </label>
          <button className="button primary" disabled={sending}>
            {sending ? "Sending…" : "Send inquiry"} <Arrow />
          </button>
          {status && <p role="status">{status}</p>}
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer-top">
        <div>
          <div className="footer-marks">
            <img src={data.organizer.instituteLogo} alt="NIT Jalandhar" />
            <img src={data.organizer.clubLogo} alt={data.organizer.name} />
            <span>{data.organizer.name}</span>
          </div>
          <h2>{data.fest.name}</h2>
          <p>
            {data.fest.dateLabel} · {data.fest.venue}
          </p>
        </div>
        <div className="footer-links">
          <div>
            <b>Navigate</b>
            <a href="#about">About</a>
            <a href="#events">Events</a>
            <a href="#tiers">Tiers</a>
            <a href="#contact">Contact</a>
          </div>
          <div>
            <b>Connect</b>
            {Object.entries(data.links).map(([k, v]) => (
              <a href={v} key={k}>
                {k}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="shell copyright">
        <span>
          © {new Date().getFullYear()} {data.fest.name}
        </span>
        <a href="#top">Return to top ↑</a>
      </div>
    </footer>
  );
}

export default function App() {
  const [tier, setTier] = useState("");
  const [opening, setOpening] = useState(true);
  const finishOpening = useCallback(() => {
    document.documentElement.classList.remove("opening-active");
    setOpening(false);
  }, []);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.05,
    });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    lenis.on("scroll", ScrollTrigger.update);
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) =>
        gsap.fromTo(
          el,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        ),
      );
      gsap.utils.toArray<HTMLElement>(".counter").forEach((el) => {
        const v = numeric(el.dataset.value ?? "");
        if (v === null) return;
        const o = { v: 0 };
        gsap.to(o, {
          v,
          duration: 1.8,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => {
            el.textContent = Math.round(o.v).toLocaleString("en-IN");
          },
        });
      });
      gsap.to(".hero-photo", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });
      gsap.fromTo(
        ".comparison-build",
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          ease: "none",
          scrollTrigger: {
            trigger: ".comparison-build",
            start: "top 92%",
            end: "top 55%",
            scrub: 0.8,
          },
        },
      );
      gsap.from(".comparison-build tbody tr", {
        x: -24,
        opacity: 0,
        stagger: 0.09,
        duration: 0.55,
        ease: "power2.out",
        scrollTrigger: { trigger: ".comparison-build", start: "top 68%", once: true },
      });
    });
    return () => ctx.revert();
  }, []);
  const options = useMemo(
    () => ({
      fullScreen: { enable: true, zIndex: 2 },
      fpsLimit: 30,
      particles: {
        number: { value: 18, density: { enable: true, width: 1200, height: 800 } },
        color: { value: ["#8b1a1a", "#a75c31"] },
        opacity: { value: { min: 0.06, max: 0.26 } },
        size: { value: { min: 1, max: 2.2 } },
        move: {
          enable: true,
          direction: "top" as const,
          speed: { min: 0.15, max: 0.45 },
          outModes: "out" as const,
        },
      },
      interactivity: {
        events: {
          onHover: { enable: false },
          onClick: { enable: false },
          resize: { enable: true },
        },
      },
      detectRetina: true,
    }),
    [],
  );
  return (
    <ParticlesProvider init={loadSlim}>
      {opening && <OpeningAnimation complete={finishOpening} />}
      <Particles id="embers" options={options} />
      <main>
        <Hero />
        <About />
        <Numbers />
        <Events />
        <Audience />
        <Tiers select={setTier} />
        <SponsorWall />
        <Highlights />
        <Contact tier={tier} setTier={setTier} />
      </main>
      <Footer />
    </ParticlesProvider>
  );
}
