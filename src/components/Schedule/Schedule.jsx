import { useEffect, useRef, useState } from "react";
import "./Schedule.css";

const TAGS = { pit: "Pit stop", main: "Main event", ws: "Workshop", mt: "Mentoring", jd: "Judging", gen: "" };

// [time, title, type, note]
const DAYS = [
  { n: 1, date: "Saturday, 31 October", name: "Lights out", stops: [
    ["08:00 AM", "Check-in begins", "gen"],
    ["09:30 AM", "Opening ceremony", "main"],
    ["12:00 PM", "Hackathon begins", "main", "Green flag. 24 hours on the clock."],
    ["01:00 PM", "Lunch", "pit"],
    ["04:00 PM", "Workshops", "ws"],
    ["08:00 PM", "Dinner", "pit"],
    ["09:00 PM", "MLH Tech Together meetup", "gen"],
    ["10:00 – 11:00 PM", "Mentoring", "mt"],
    ["01:00 AM", "Midnight snacks", "pit", "Early hours of Sunday"],
  ]},
  { n: 2, date: "Sunday, 1 November", name: "Chequered flag", finish: true, stops: [
    ["07:00 AM", "Breakfast", "pit"],
    ["10:00 AM", "Submissions start", "gen", "Soft deadline"],
    ["12:00 PM", "Final submission deadline", "main"],
    ["12:00 PM", "Judging round 1 begins", "jd"],
    ["12:30 – 02:00 PM", "Lunch break", "pit"],
    ["04:00 – 05:00 PM", "Judging round 2", "jd", "Pitching"],
    ["05:00 – 06:00 PM", "Closing ceremony", "main", "Winners announced"],
  ]},
];

// Fixed track layout, identical for every visitor. Per stop: [corner before it, direction (-1 left / 1 right),
// where the track passes the stop (-1..1 across the track corridor), extra gap above the stop in px]
const TRACKS = {
  1: [["grid", 0, -0.5, 0], ["straight", 0, 0.7, 70], ["hairpin", -1, 0.5, 40], ["chicane", 1, -0.3, 40], ["straight", 0, -0.3, 130],
      ["sweeper", 1, 0.55, 30], ["corner", -1, 0.1, 40], ["hairpin", 1, -0.5, 40], ["chicane", -1, 0.35, 40]],
  2: [["grid", 0, 0.5, 0], ["hairpin", -1, 0.3, 60], ["straight", 0, -0.6, 100], ["chicane", 1, -0.6, 30],
      ["sweeper", 1, 0.6, 40], ["hairpin", -1, 0.45, 70], ["straight", 0, -0.2, 40]],
};

// Straight lines joined by rounded corners, like a real circuit
function roundedPath(V) {
  let d = `M${V[0].x},${V[0].y}`;
  for (let i = 1; i < V.length - 1; i++) {
    const a = V[i - 1], v = V[i], b = V[i + 1];
    const l1 = Math.hypot(a.x - v.x, a.y - v.y), l2 = Math.hypot(b.x - v.x, b.y - v.y);
    const t = Math.min(v.r ?? 40, l1 / 2, l2 / 2);
    d += `L${v.x + ((a.x - v.x) / l1) * t},${v.y + ((a.y - v.y) / l1) * t}Q${v.x},${v.y} ${v.x + ((b.x - v.x) / l2) * t},${v.y + ((b.y - v.y) / l2) * t}`;
  }
  const e = V[V.length - 1];
  return d + `L${e.x},${e.y}`;
}

function Lights() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const t = [];
    const run = () => {
      for (let i = 1; i <= 5; i++) t.push(setTimeout(() => setN(i), 600 * i));
      t.push(setTimeout(() => setN(0), 4200), setTimeout(run, 6200));
    };
    run();
    return () => t.forEach(clearTimeout);
  }, []);
  return (
    <div className="sch-lights" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => <i key={i} className={n >= i ? "on" : ""} />)}
    </div>
  );
}

function Lap({ day }) {
  const list = useRef(), lit = useRef(), refs = useRef([]);
  const [g, setG] = useState({ d: "", ys: [], W: 1, H: 1 });
  const [pins, setPins] = useState([]);
  const [p, setP] = useState({ L: 0, len: 1, x: 0, y: 0, a: 90 });
  const track = TRACKS[day.n];

  useEffect(() => {
    const build = () => {
      const W = list.current.clientWidth, H = list.current.clientHeight;
      const m = W < 720, cx = m ? 30 : W / 2, Wc = m ? 14 : 120; // Wc = half width of the track corridor
      const V = [{ x: cx, y: 0 }], ys = [];
      refs.current.forEach((s, i) => {
        const [f, hx, k] = track[i], y = s.offsetTop + s.offsetHeight / 2, a = V[V.length - 1], qx = cx + k * Wc;
        const dy = y - a.y, at = (t) => a.y + dy * t, lx = (t) => a.x + (qx - a.x) * t;
        if (f === "grid") V.push({ x: cx, y: Math.min(70, dy / 2), r: 50 });
        if (f === "hairpin") V.push({ x: cx + hx * Wc, y: at(0.5), r: 22 });
        if (f === "sweeper") V.push({ x: cx + hx * Wc * 0.9, y: at(0.5), r: 120 });
        if (f === "corner") V.push({ x: cx + hx * Wc * 0.8, y: at(0.5), r: 30 });
        if (f === "chicane") [0.3, 0.5, 0.7].forEach((t, n) => V.push({ x: lx(t) + (n === 1 ? -1 : 1) * hx * Wc * 0.3, y: at(t), r: 14 }));
        V.push({ x: qx, y, r: 60 });
        ys.push(y);
      });
      V.push({ x: cx, y: H - 70, r: 50 }, { x: cx, y: H });
      setG({ d: roundedPath(V), ys, W, H });
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(list.current);
    document.fonts.ready.then(build);
    return () => ro.disconnect();
  }, [track]);

  useEffect(() => {
    if (!g.d) return;
    const path = lit.current, len = path.getTotalLength();
    // The path only ever moves downward, so we can find the length at which it reaches a given y.
    // The car and the stop markers use this, so the car is always level with the card it is passing.
    const lenAtY = (y) => {
      let lo = 0, hi = len;
      for (let i = 0; i < 22; i++) { const m = (lo + hi) / 2; if (path.getPointAtLength(m).y < y) lo = m; else hi = m; }
      return lo;
    };
    setPins(g.ys.map((y) => { const c = path.getPointAtLength(lenAtY(y)); return { x: c.x, y: c.y }; }));
    let f;
    const tick = () => {
      const r = list.current.getBoundingClientRect();
      const target = Math.min(1, Math.max(0, (innerHeight * 0.55 - r.top) / r.height)) * g.H;
      const L = lenAtY(target), c = path.getPointAtLength(L), a = path.getPointAtLength(Math.max(0, L - 1)), b = path.getPointAtLength(Math.min(len, L + 1));
      setP({ L, len, x: c.x, y: c.y, a: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI });
    };
    const on = () => { cancelAnimationFrame(f); f = requestAnimationFrame(tick); };
    tick();
    addEventListener("scroll", on, { passive: true });
    return () => { removeEventListener("scroll", on); cancelAnimationFrame(f); };
  }, [g]);

  return (
    <div className="sch-lap">
      <h3 className="sch-lap-title"><span>Day {day.n}</span><b>{day.name}</b><em>{day.date}</em></h3>
      <div className="sch-list" ref={list}>
        <svg className="sch-track" viewBox={`0 0 ${g.W} ${g.H}`} aria-hidden="true">
          <path d={g.d} className="k1" />
          <path d={g.d} className="k2" />
          <path d={g.d} className="road" />
          <path d={g.d} className="mid" />
          <path d={g.d} className="lit" ref={lit} strokeDasharray={`${p.L} ${p.len}`} />
          {pins.map((q, i) => <circle key={i} cx={q.x} cy={q.y} r="8" className={Math.abs(p.y - q.y) < 70 ? "on now" : q.y < p.y ? "on" : ""} />)}
          <g className="sch-car" transform={`translate(${p.x} ${p.y}) rotate(${p.a})`}>
            <rect x="-17" y="-9" width="4" height="18" fill="#fff" /><rect x="11" y="-8" width="4" height="16" fill="#fff" />
            <rect x="-13" y="-4.5" width="26" height="9" rx="4" fill="#e10600" /><rect x="-6" y="-2.5" width="6" height="5" rx="2" fill="#111" />
            <rect x="-12" y="-11" width="7" height="4" fill="#000" /><rect x="-12" y="7" width="7" height="4" fill="#000" />
            <rect x="6" y="-10" width="6" height="3" fill="#000" /><rect x="6" y="7" width="6" height="3" fill="#000" />
          </g>
        </svg>
        {day.stops.map(([time, title, type, note], i) => {
          const dy = g.ys[i] === undefined ? -1e9 : p.y - g.ys[i]; // car position relative to this stop
          const state = dy > 70 ? " on done" : dy >= -70 ? " on now" : "";
          return (
            <article
              key={i}
              ref={(el) => (refs.current[i] = el)}
              style={i ? { marginTop: track[i][3] } : undefined}
              className={`sch-stop ${i % 2 ? "r" : "l"} t-${type}${state}`}
            >
              <span className="turn">Turn {i + 1}</span>
              <time>{time}</time>
              <h4>{title}</h4>
              {note && <p>{note}</p>}
              {TAGS[type] && <span className="chip">{TAGS[type]}</span>}
            </article>
          );
        })}
      </div>
      {day.finish && <div className="sch-finish"><span>Finish</span></div>}
    </div>
  );
}

export default function Schedule() {
  return (
    <section id="schedule" className="sch">
      <div className="sch-wrap">
        <header className="sch-head">
          <h2>Race <span>schedule</span></h2>
          <Lights />
          <p>Tentative run of show for 31 October and 1 November 2026</p>
        </header>
        {DAYS.map((d) => <Lap key={d.n} day={d} />)}
      </div>
    </section>
  );
}
