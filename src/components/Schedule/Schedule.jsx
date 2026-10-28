import { useEffect, useRef, useState } from "react";
import "./Schedule.css";

const DAYS = [
  { n: 1, date: "Saturday, 31 October", name: "Lights out", stops: [
    ["08:00 AM", "Check-in begins", "gen"],
    ["09:30 AM", "Opening ceremony", "main"],
    ["12:00 PM", "Hackathon begins", "main", "24 hours on the clock"],
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

const TRACKS = {
  1: [["grid", 0, -0.5], ["straight", 0, 0.7], ["hairpin", -1, 0.5], ["chicane", 1, -0.3],
      ["straight", 0, -0.3], ["sweeper", 1, 0.55], ["corner", -1, 0.1], ["hairpin", 1, -0.5], ["chicane", -1, 0.35]],
  2: [["grid", 0, 0.5], ["hairpin", -1, 0.3], ["straight", 0, -0.6], ["chicane", 1, -0.6],
      ["sweeper", 1, 0.6], ["hairpin", -1, 0.45], ["straight", 0, -0.2]],
};

function roundedPath(points) {
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const a = points[i - 1], v = points[i], b = points[i + 1];
    const l1 = Math.hypot(a.x - v.x, a.y - v.y), l2 = Math.hypot(b.x - v.x, b.y - v.y);
    const t = Math.min(v.r ?? 45, l1 / 2, l2 / 2);
    d += `L${v.x + ((a.x - v.x) / l1) * t},${v.y + ((a.y - v.y) / l1) * t}Q${v.x},${v.y} ${v.x + ((b.x - v.x) / l2) * t},${v.y + ((b.y - v.y) / l2) * t}`;
  }
  const end = points[points.length - 1];
  return `${d}L${end.x},${end.y}`;
}

function Lights() {
  const [state, setState] = useState({ n: 0, go: false });

  useEffect(() => {
    let timers = [];
    const loop = () => {
      timers = [];
      for (let i = 1; i <= 5; i++) {
        timers.push(setTimeout(() => setState({ n: i, go: false }), 600 * i));
      }
      timers.push(setTimeout(() => setState({ n: 5, go: true }), 3600));
      timers.push(setTimeout(() => setState({ n: 0, go: false }), 5000));
      timers.push(setTimeout(loop, 6200));
    };
    loop();
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={`sch-lights${state.go ? " go" : ""}`} aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => <i key={i} className={state.n >= i ? "on" : ""} />)}
    </div>
  );
}

function Car() {
  return (
    <g className="sch-car">
      <rect x="-17" y="-9" width="4" height="18" fill="#fff" /><rect x="11" y="-8" width="4" height="16" fill="#fff" />
      <rect x="-13" y="-4.5" width="26" height="9" rx="4" fill="#e10600" /><rect x="-6" y="-2.5" width="6" height="5" rx="2" fill="#111" />
      <rect x="-12" y="-11" width="7" height="4" fill="#000" /><rect x="-12" y="7" width="7" height="4" fill="#000" />
      <rect x="6" y="-10" width="6" height="3" fill="#000" /><rect x="6" y="7" width="6" height="3" fill="#000" />
    </g>
  );
}

function Lap({ day, next, onNext }) {
  const root = useRef(), list = useRef(), lit = useRef(), refs = useRef([]);
  const [g, setG] = useState({ d: "", W: 1, H: 1 });
  const [pins, setPins] = useState([]);
  const [p, setP] = useState({ L: 0, len: 1, x: 0, y: 0, a: 90 });
  const track = TRACKS[day.n];

  useEffect(() => {
    const build = () => {
      if (!list.current) return;
      const W = list.current.clientWidth, H = list.current.clientHeight;
      const mobile = W < 720, cx = mobile ? 30 : W / 2, corridor = mobile ? 14 : 105;
      const points = [{ x: cx, y: 0 }], ys = [];
      day.stops.forEach((_, i) => {
        const card = refs.current[i];
        if (!card) return;
        const [feature, direction, across] = track[i];
        const y = card.offsetTop + card.offsetHeight / 2;
        const previous = points[points.length - 1], qx = cx + across * corridor;
        const dy = y - previous.y, at = (t) => previous.y + dy * t;
        const lx = (t) => previous.x + (qx - previous.x) * t;
        if (feature === "grid") points.push({ x: cx, y: Math.min(60, dy / 2), r: 60 });
        if (feature === "hairpin") points.push({ x: cx + direction * corridor, y: at(0.5), r: 80 });
        if (feature === "sweeper") points.push({ x: cx + direction * corridor * 0.9, y: at(0.5), r: 140 });
        if (feature === "corner") points.push({ x: cx + direction * corridor * 0.8, y: at(0.5), r: 70 });
        if (feature === "chicane") [0.28, 0.5, 0.72].forEach((t, n) => points.push({
          x: lx(t) + (n === 1 ? -1 : 1) * direction * corridor * 0.28, y: at(t), r: 45,
        }));
        points.push({ x: qx, y, r: 70 });
        ys.push(y);
      });
      points.push({ x: cx, y: H - 60, r: 60 }, { x: cx, y: H });
      setG({ d: roundedPath(points), W, H });
      setPins(ys.map((y) => ({ x: cx, y })));
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(list.current);
    document.fonts.ready.then(build);
    return () => ro.disconnect();
  }, [track]);

  useEffect(() => {
    if (!g.d || !lit.current || !list.current) return;
    const path = lit.current, len = path.getTotalLength();
    const displayed = { L: p.L };
    const lenAtY = (y) => {
      let lo = 0, hi = len;
      for (let i = 0; i < 22; i++) {
        const middle = (lo + hi) / 2;
        if (path.getPointAtLength(middle).y < y) lo = middle;
        else hi = middle;
      }
      return lo;
    };
    const update = () => {
      const rect = list.current.getBoundingClientRect();
      const target = Math.min(g.H, Math.max(0, innerHeight * 0.55 - rect.top));
      const desired = lenAtY(target);
      displayed.L += (desired - displayed.L) * 0.16;
      const L = Math.abs(desired - displayed.L) < 0.5 ? desired : displayed.L;
      const c = path.getPointAtLength(L);
      const before = path.getPointAtLength(Math.max(0, L - 1));
      const after = path.getPointAtLength(Math.min(len, L + 1));
      setP({ L, len, x: c.x, y: c.y, a: (Math.atan2(after.y - before.y, after.x - before.x) * 180) / Math.PI });
      if (Math.abs(desired - displayed.L) >= 0.5) frame = requestAnimationFrame(update);
    };
    setPins((current) => current.map((pin) => {
        const point = path.getPointAtLength(lenAtY(pin.y));
        return { x: point.x, y: point.y };
      }));
    let frame = requestAnimationFrame(update);
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [g]);

  const goTo = (index) => refs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  return (
    <div className="sch-lap" ref={root}>
      <div className="sch-lap-head">
        <h3 className="sch-lap-title"><span>Day {day.n}</span><em>{day.date}</em></h3>
        <Lights />
      </div>
      <div className="sch-list" ref={list}>
        <svg className="sch-track" viewBox={`0 0 ${g.W} ${g.H}`} aria-hidden="true">
          <defs><pattern id={`chq-${day.n}`} width="12" height="12" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#fff" /><rect x="6" y="6" width="6" height="6" fill="#fff" /><rect x="6" width="6" height="6" /><rect y="6" width="6" height="6" /></pattern></defs>
          <path d={g.d} className="k1" /><path d={g.d} className="k2" /><path d={g.d} className="road" /><path d={g.d} className="mid" />
          <path d={g.d} className="lit" ref={lit} strokeDasharray={`${p.L} ${p.len}`} />
          {pins.map((q, i) => <g key={i} className={`pin${Math.abs(p.y - q.y) < 70 ? " now" : q.y < p.y ? " on" : ""}`} onClick={() => goTo(i)}>
            <circle cx={q.x} cy={q.y} r="11" /><text x={q.x} y={q.y} dy=".35em" textAnchor="middle">{i + 1}</text>
          </g>)}
          <g className="sch-car" transform={`translate(${p.x} ${p.y}) rotate(${p.a}) scale(1.15)`}><Car /></g>
        </svg>
        {day.stops.map(([time, title, type, note], i) => {
          const pin = pins[i], delta = pin ? p.y - pin.y : -Infinity;
          const state = delta > 70 ? " done" : delta >= -70 ? " now" : "";
          return (
            <article key={i} ref={(el) => { refs.current[i] = el; }} className={`sch-stop ${i % 2 ? "r" : "l"} t-${type}${state}`} onClick={() => goTo(i)}>
              <time>{time}</time><h4>{title}</h4>{note && <p>{note}</p>}
            </article>
          );
        })}
      </div>
      {day.finish && <div className="sch-finish"><span>Finish</span></div>}
      <div className="sch-foot">
        <button className="sch-btn go" onClick={onNext}>{next.n > day.n ? `Day ${next.n} →` : `← Day ${next.n}`}</button>
      </div>
    </div>
  );
}

export default function Schedule() {
  const [day, setDay] = useState(0);
  const section = useRef();
  const changeDay = () => {
    setDay((current) => 1 - current);
    setTimeout(() => section.current?.querySelector(".sch-lap")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };
  return (
    <section id="schedule" className="sch" ref={section}>
      <div className="sch-wrap">
        <header className="sch-head"><h2>Run of <span>Show</span></h2></header>
        <Lap key={day} day={DAYS[day]} next={DAYS[1 - day]} onNext={changeDay} />
      </div>
    </section>
  );
}
