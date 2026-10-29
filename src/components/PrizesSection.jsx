import React from 'react';
import {
  overallPrizes,
  specialHacks,
  base44Prizes,
  qyrusPrizes,
  mlhPrizes,
  sponsoredTracks
} from '../data/prizesData';

// revealDelay/revealEasing stagger the entrance so 2nd & 3rd rise first and
// gold rises last with a bounce; countDelay staggers the cash count-up to match.
const PODIUM_THEME = [
  { key: 'first', label: '1ST', number: '1', color: '#FFC93C', revealDelay: 450, revealEasing: 'ease-out-back', countDelay: 500 },
  { key: 'second', label: '2ND', number: '2', color: '#D8E1E8', revealDelay: 0, revealEasing: 'ease-out-sine', countDelay: 150 },
  { key: 'third', label: '3RD', number: '3', color: '#FF9C4A', revealDelay: 120, revealEasing: 'ease-out-sine', countDelay: 250 }
];

// Visual podium order: 2nd on the left, 1st centered, 3rd on the right.
const PODIUM_ORDER = [1, 0, 2];

// AWS only has a 1st/2nd pair -- gold/silver only, no center-raise needed.
const DUO_THEME = [PODIUM_THEME[0], PODIUM_THEME[1]];

// Qyrus 4th/5th and the four Special Hack categories are each a same-tier
// set, so every card in a set shares one accent instead of being ranked
// against its neighbors.
const RUNNER_COLOR = '#8f97a6';
const CATEGORY_COLOR = '#E10600';

function useInView(threshold = 0.3) {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

function PodiumAmount({ amount, start, delay = 0, duration = 1200 }) {
  const match = amount.match(/^(\D*)([\d,]+)(\D*)$/);
  const target = match ? parseInt(match[2].replace(/,/g, ''), 10) : 0;
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    if (!start || !match) return undefined;
    let raf;
    const startTime = performance.now() + delay;
    const tick = (now) => {
      if (now < startTime) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start]);

  if (!match) return amount;
  const formatted = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${match[1]}${formatted}${match[3]}`;
}

// Full gold/silver/bronze podium -- used for Overall Prizes, Base44 and the
// top 3 of the Qyrus track. `items` must be exactly [1st, 2nd, 3rd].
function PodiumThree({ items, getFields }) {
  const [ref, inView] = useInView();

  return (
    <div className="podium-grid" ref={ref}>
      {PODIUM_ORDER.map((dataIdx) => {
        const fields = getFields(items[dataIdx]);
        const theme = PODIUM_THEME[dataIdx];
        return (
          <div
            className={`podium-card podium-${theme.key}`}
            key={dataIdx}
            style={{ '--rank-color': theme.color }}
            data-aos="fade-up"
            data-aos-duration={theme.key === 'first' ? 900 : 700}
            data-aos-delay={theme.revealDelay}
            data-aos-easing={theme.revealEasing}
            data-aos-anchor-placement="top-bottom"
          >
            <span className="podium-rank-chip">{theme.label}</span>
            <span className="podium-watermark" aria-hidden="true">{theme.number}</span>
            <div className="podium-content">
              <img className="podium-logo" loading="lazy" decoding="async" src={fields.logo} alt={fields.rank} />
              <p className="podium-amount">
                <PodiumAmount amount={fields.amount} start={inView} delay={theme.countDelay} />
              </p>
              <p className="podium-desc">{fields.desc}</p>
              {fields.note && <p className="podium-note">{fields.note}</p>}
            </div>
            <div className="podium-base">{fields.rank}</div>
          </div>
        );
      })}
    </div>
  );
}

// Two-tier row (AWS) -- same visual family as the podium cards but without
// the center-raise choreography, since a pair has no natural middle.
function DuoRow({ items, getFields }) {
  const [ref, inView] = useInView();

  return (
    <div className="duo-grid" ref={ref}>
      {items.map((item, idx) => {
        const fields = getFields(item);
        const theme = DUO_THEME[idx];
        return (
          <div
            className="duo-card"
            key={idx}
            style={{ '--rank-color': theme.color }}
            data-aos="fade-up"
            data-aos-duration="700"
            data-aos-delay={idx * 120}
          >
            <img className="duo-logo" loading="lazy" decoding="async" src={fields.logo} alt={fields.rank} />
            <p className="duo-rank">{theme.label}</p>
            <p className="duo-amount">
              <PodiumAmount amount={fields.amount} start={inView} delay={idx * 150} />
            </p>
          </div>
        );
      })}
    </div>
  );
}

// A same-tier set (Qyrus 4th/5th, or any other runner-up pair) -- every card
// shares one quiet accent instead of being ranked against its neighbors.
function RunnerRow({ items, getFields }) {
  const [ref, inView] = useInView();

  return (
    <div className="runner-grid" ref={ref}>
      {items.map((item, idx) => {
        const fields = getFields(item);
        return (
          <div
            className="runner-card"
            key={idx}
            style={{ '--runner-color': RUNNER_COLOR }}
            data-aos="fade-up"
            data-aos-duration="600"
            data-aos-delay={idx * 100}
          >
            <p className="runner-rank">{fields.rank}</p>
            <p className="runner-amount">
              <PodiumAmount amount={fields.amount} start={inView} delay={idx * 120} />
            </p>
            <p className="runner-desc">{fields.desc}</p>
          </div>
        );
      })}
    </div>
  );
}

// Same-tier category set (Special Hacks) -- four unranked awards, one shared
// accent so none of them reads as "more important" than the others.
function CategoryGrid({ items, getFields }) {
  const [ref, inView] = useInView();

  return (
    <div className="category-grid" ref={ref}>
      {items.map((item, idx) => {
        const fields = getFields(item);
        return (
          <div
            className="category-card"
            key={idx}
            style={{ '--cat-color': CATEGORY_COLOR }}
            data-aos="fade-up"
            data-aos-duration="700"
            data-aos-delay={idx * 90}
          >
            <img className="category-logo" loading="lazy" decoding="async" src={fields.logo} alt={fields.title} />
            <p className="category-title">{fields.title}</p>
            <p className="category-prize">
              <PodiumAmount amount={fields.amount} start={inView} delay={idx * 120} />
            </p>
            <p className="category-extra">{fields.desc}</p>
          </div>
        );
      })}
    </div>
  );
}

function MlhPrizeGrid({ items }) {
  const [ref, inView] = useInView(0.15);

  return (
    <div className="mlh-prize-grid" ref={ref}>
      {items.map((item, idx) => (
        <article
          className={`mlh-prize-card${inView ? ' mlh-prize-card-visible' : ''}`}
          key={item.title}
          style={{
            '--mlh-accent': item.accent,
            '--mlh-delay': `${idx * 80}ms`,
            '--mlh-prize-image': `url("${item.prizeImage}")`
          }}
        >
          <div className="mlh-prize-card-top">
            <span className="mlh-prize-winner">{item.winner}</span>
          </div>
          <div className="mlh-prize-card-body">
            <div className="mlh-prize-logo-frame">
              <img className="mlh-prize-logo" loading="lazy" decoding="async" src={item.logo} alt="" />
            </div>
            <h4>{item.title}</h4>
            <p className="mlh-prize-label">PRIZE</p>
            <p className="mlh-prize-name">{item.prize}</p>
            <a href={item.link} target="_blank" rel="noreferrer">
              Read more <span aria-hidden="true">↗</span>
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}

function SponsoredTracks() {
  const [ref, inView] = useInView(0.15);

  return (
    <div className={`sponsored-tracks${inView ? ' sponsored-tracks-visible' : ''}`} ref={ref}>
      <div className="yugabyte-banner">
        <div className="yugabyte-banner-heading">
          <div className="sponsor-logo-badge">
            <img src={sponsoredTracks.yugabyteLogo} alt="YugabyteDB" />
          </div>
          <span>EXCLUSIVE PROBLEM STATEMENT</span>
          <em>“{sponsoredTracks.yugabyteChallenge}”</em>
        </div>
        <div className="sponsored-yugabyte-grid">
          {sponsoredTracks.yugabyte.map((track) => (
            <article
              className="sponsored-prize-card"
              key={track.title}
              style={{ '--sponsor-accent': track.accent }}
            >
              <span className="sponsored-prize-medal" aria-hidden="true">✦</span>
              <p className="sponsored-prize-rank">{track.title}</p>
              <h4>{track.prize}</h4>
              <p>{track.detail}</p>
            </article>
          ))}
        </div>
      </div>

      <article
        className="iomete-card"
        style={{ '--sponsor-accent': sponsoredTracks.iomete.accent }}
      >
        <div className="iomete-card-heading">
          <div className="sponsor-logo-badge iomete-logo">
            <img src={sponsoredTracks.iometeLogo} alt="IOMETE" />
          </div>
        </div>
        <p className="iomete-eyebrow">{sponsoredTracks.iomete.eyebrow}</p>
        <p className="iomete-quote">“{sponsoredTracks.iomete.title}”</p>
        <div className="iomete-prize">
          <span className="sponsored-prize-medal" aria-hidden="true">★</span>
          <div>
            <span className="iomete-prize-label">PRIZE</span>
            <strong>{sponsoredTracks.iomete.prize}</strong>
            <span>{sponsoredTracks.iomete.detail}</span>
          </div>
        </div>
      </article>
    </div>
  );
}

const awsPrizes = [
  { rank: '1st Prize', amount: '$100', logo: '/assets/img/themes_new/first.png' },
  { rank: '2nd Prize', amount: '$75', logo: '/assets/img/themes_new/second.png' }
];

export default function PrizesSection() {
  return (
    <section id="prizes" className="pb100 pt100">
      <style>{`
        .podium-grid {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 36px;
          flex-wrap: wrap;
          padding: 70px 0 30px;
        }

        .podium-card {
          position: relative;
          width: 280px;
          max-width: 85vw;
          min-height: 380px;
          border-radius: 22px;
          overflow: hidden;
          text-align: center;
          display: flex;
          flex-direction: column;
          background:
            linear-gradient(165deg, color-mix(in srgb, var(--rank-color) 16%, transparent) 0%, transparent 55%),
            linear-gradient(165deg, #26262b 0%, #0a0a0c 72%);
          border: 2px solid var(--rank-color);
          box-shadow:
            0 0 0 1px color-mix(in srgb, var(--rank-color) 55%, transparent),
            0 0 14px 1px color-mix(in srgb, var(--rank-color) 25%, transparent);
          transition: box-shadow 0.25s ease;
        }

        /* !important: AOS's own [data-aos].aos-animate reset rule otherwise
           clobbers our hover transform/box-shadow once the entrance animation
           settles. No lift on hover -- just a brighter glow and a light lift-
           free scale, so cards don't jump around. */
        .podium-card:hover {
          transform: scale(1.02) !important;
          box-shadow:
            0 0 0 1px color-mix(in srgb, var(--rank-color) 85%, transparent),
            0 0 22px 3px color-mix(in srgb, var(--rank-color) 45%, transparent);
        }

        /* Proper podium proportions: gold tallest, silver mid, bronze
           shortest -- all sharing the same base via align-items: flex-end. */
        .podium-card.podium-first {
          order: 2;
          min-height: 440px;
          z-index: 2;
        }

        .podium-card.podium-second { order: 1; min-height: 380px; }
        .podium-card.podium-third { order: 3; min-height: 340px; }

        @keyframes podium-watermark-pulse {
          0%, 100% { opacity: 0.07; }
          50% { opacity: 0.18; }
        }

        .podium-rank-chip {
          position: absolute;
          top: 16px;
          right: 18px;
          font-family: 'F1Font', sans-serif;
          font-size: 15px;
          letter-spacing: 1.5px;
          color: #000;
          background: var(--rank-color);
          box-shadow: 0 0 14px color-mix(in srgb, var(--rank-color) 70%, transparent);
          padding: 4px 12px;
          border-radius: 4px;
          z-index: 2;
        }

        .podium-watermark {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'F1Font', sans-serif;
          font-size: 220px;
          line-height: 1;
          color: var(--rank-color);
          opacity: 0.045;
          z-index: 0;
          pointer-events: none;
          user-select: none;
          animation: podium-watermark-pulse 3s ease-in-out infinite;
        }

        /* flex: 1 0 auto (not the flex: 1 shorthand, which defaults to
           flex-basis: 0%) -- with overflow: hidden on the card, a plain
           "flex: 1" lets this shrink below its own content's natural height
           when the prize text is long, squeezing everything into overlap. */
        .podium-content {
          position: relative;
          z-index: 1;
          flex: 1 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 40px 26px 30px;
        }

        .podium-logo {
          width: 66px;
          height: 66px;
          object-fit: contain;
          margin: 0 auto 4px;
          filter: drop-shadow(0 0 14px color-mix(in srgb, var(--rank-color) 60%, transparent));
        }

        .podium-amount {
          font-size: 26px;
          line-height: 1.15;
          font-weight: 800;
          color: #fff;
          text-shadow: 0 0 22px color-mix(in srgb, var(--rank-color) 75%, transparent);
          margin: 0;
        }

        .podium-first .podium-amount { font-size: 30px; }

        .podium-desc {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.65);
          margin: 0;
        }

        .podium-note {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.4);
          font-style: italic;
          line-height: 1.3;
          margin: 12px 0 0;
        }

        .podium-base {
          position: relative;
          z-index: 1;
          background: color-mix(in srgb, var(--rank-color) 14%, #050506);
          border-top: 1px solid color-mix(in srgb, var(--rank-color) 45%, transparent);
          padding: 16px 12px;
          font-family: 'F1Font', sans-serif;
          letter-spacing: 1.5px;
          color: var(--rank-color);
          font-size: 18px;
        }

        /* Two-tier row (AWS): same card language, no center-raise. */
        .duo-grid {
          display: flex;
          justify-content: center;
          gap: 32px;
          flex-wrap: wrap;
          padding: 50px 0 10px;
        }

        .duo-card {
          position: relative;
          width: 230px;
          max-width: 80vw;
          border-radius: 18px;
          padding: 30px 24px;
          text-align: center;
          background:
            linear-gradient(165deg, color-mix(in srgb, var(--rank-color) 14%, transparent) 0%, transparent 55%),
            linear-gradient(165deg, #26262b 0%, #0a0a0c 72%);
          border: 2px solid var(--rank-color);
          box-shadow:
            0 0 0 1px color-mix(in srgb, var(--rank-color) 65%, transparent),
            0 0 18px 2px color-mix(in srgb, var(--rank-color) 40%, transparent);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .duo-card:hover {
          transform: translateY(-8px) !important;
          box-shadow:
            0 0 0 1px color-mix(in srgb, var(--rank-color) 90%, transparent),
            0 0 28px 4px color-mix(in srgb, var(--rank-color) 60%, transparent);
        }

        .duo-logo {
          width: 48px;
          height: 48px;
          object-fit: contain;
          margin: 0 auto 14px;
          filter: drop-shadow(0 0 10px color-mix(in srgb, var(--rank-color) 55%, transparent));
        }

        .duo-rank {
          font-family: 'F1Font', sans-serif;
          font-size: 14px;
          letter-spacing: 1.5px;
          color: var(--rank-color);
          margin: 0 0 8px;
        }

        .duo-amount {
          font-size: 30px;
          font-weight: 800;
          color: #fff;
          text-shadow: 0 0 16px color-mix(in srgb, var(--rank-color) 60%, transparent);
          margin: 0;
        }

        /* Same-tier runner row (Qyrus 4th/5th): quieter, one shared accent. */
        .runner-grid {
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
          padding: 36px 0 10px;
        }

        .runner-card {
          position: relative;
          width: 220px;
          max-width: 80vw;
          border-radius: 14px;
          padding: 22px 20px;
          text-align: center;
          background: linear-gradient(165deg, #1c1c1f 0%, #0a0a0c 80%);
          border: 1px solid color-mix(in srgb, var(--runner-color) 55%, transparent);
          box-shadow: 0 0 14px 1px color-mix(in srgb, var(--runner-color) 22%, transparent);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .runner-card:hover {
          transform: translateY(-5px) !important;
          box-shadow: 0 0 20px 2px color-mix(in srgb, var(--runner-color) 35%, transparent);
        }

        .runner-rank {
          font-family: 'F1Font', sans-serif;
          font-size: 12px;
          letter-spacing: 1.5px;
          color: var(--runner-color);
          margin: 0 0 6px;
        }

        .runner-amount {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 4px;
        }

        .runner-desc {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
        }

        /* Same-tier category set (Special Hacks): 4 unranked awards, one
           shared accent so none reads as more important than the others. */
        .category-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 280px));
          justify-content: center;
          gap: 24px;
          padding: 20px 0 10px;
        }

        @media (max-width: 992px) {
          .category-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 520px) {
          .category-grid { grid-template-columns: 1fr; }
        }

        .category-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-radius: 16px;
          padding: 30px 22px 26px;
          text-align: center;
          background:
            linear-gradient(165deg, color-mix(in srgb, var(--cat-color) 12%, transparent) 0%, transparent 55%),
            linear-gradient(165deg, #1c1c1f 0%, #0a0a0c 78%);
          border: 1px solid color-mix(in srgb, var(--cat-color) 55%, transparent);
          box-shadow: 0 0 16px 1px color-mix(in srgb, var(--cat-color) 22%, transparent);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .category-card:hover {
          transform: translateY(-6px) !important;
          box-shadow: 0 0 26px 3px color-mix(in srgb, var(--cat-color) 40%, transparent);
        }

        .category-logo {
          width: 40px;
          height: 40px;
          object-fit: contain;
          margin: 0 0 16px;
          filter: drop-shadow(0 0 8px color-mix(in srgb, var(--cat-color) 50%, transparent));
        }

        /* Fixed-height slot so a 1-line and a 2-line title both anchor the
           rest of the card at the same position across the row. */
        .category-title {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          font-size: 17px;
          font-weight: 700;
          line-height: 1.25;
          color: #fff;
          margin: 0 0 16px;
        }

        .category-prize {
          font-size: 14px;
          line-height: 1.4;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.72);
          margin: 0 0 14px;
        }

        .category-extra {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--cat-color);
          border: 1px solid color-mix(in srgb, var(--cat-color) 55%, transparent);
          border-radius: 999px;
          padding: 5px 12px;
          margin: auto 0 0;
        }

        .mlh-prize-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
          max-width: 1080px;
          margin: 0 auto;
          padding: 28px 0 10px;
        }

        .mlh-prize-card {
          --mlh-accent: #4285f4;
          position: relative;
          min-height: 310px;
          overflow: hidden;
          border: 1px solid color-mix(in srgb, var(--mlh-accent) 48%, #29303b);
          border-radius: 18px;
          background:
            linear-gradient(145deg, rgba(8, 10, 14, 0.02) 10%, rgba(8, 10, 14, 0.9) 72%),
            linear-gradient(35deg, #080a0e 12%, rgba(8, 10, 14, 0.2) 58%, rgba(8, 10, 14, 0.42) 100%),
            var(--mlh-prize-image) center top / 100% auto no-repeat,
            linear-gradient(155deg, #15191f 0%, #080a0e 72%);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28);
          opacity: 0;
          transform: translateY(18px);
          transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease, opacity 0.5s ease;
          transition-delay: var(--mlh-delay);
        }

        .mlh-prize-card-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .mlh-prize-card::before {
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          height: 4px;
          background: var(--mlh-accent);
          box-shadow: 0 0 18px var(--mlh-accent);
          content: '';
        }

        .mlh-prize-card::after {
          position: absolute;
          right: -42px;
          bottom: -52px;
          width: 150px;
          height: 150px;
          border: 1px solid color-mix(in srgb, var(--mlh-accent) 35%, transparent);
          border-radius: 50%;
          box-shadow: 0 0 0 16px color-mix(in srgb, var(--mlh-accent) 7%, transparent);
          content: '';
          pointer-events: none;
        }

        .mlh-prize-card:hover,
        .mlh-prize-card:focus-within {
          z-index: 1;
          border-color: var(--mlh-accent);
          box-shadow:
            0 0 0 1px color-mix(in srgb, var(--mlh-accent) 75%, transparent),
            0 0 32px 5px color-mix(in srgb, var(--mlh-accent) 42%, transparent),
            0 18px 34px rgba(0, 0, 0, 0.42);
          transform: translateY(-8px) scale(1.035);
        }

        .mlh-prize-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 24px 0;
        }

        .mlh-prize-winner {
          color: rgba(255, 255, 255, 0.56);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
        }

        .mlh-prize-card-body {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-height: 225px;
          padding: 110px 24px 24px;
        }

        .mlh-prize-logo-frame {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 150px;
          height: 48px;
          box-sizing: border-box;
          margin: 0 0 14px;
          padding: 8px 14px;
          border: 1px solid rgba(255, 255, 255, 0.85);
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 5px 16px rgba(0, 0, 0, 0.28);
        }

        .mlh-prize-logo {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          margin: 0;
        }

        .mlh-prize-label {
          margin: 0 0 8px;
          color: rgba(255, 255, 255, 0.45);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.8px;
        }

        .mlh-prize-card h4 {
          min-height: 54px;
          margin: 0 0 18px;
          color: #fff;
          font-family: 'F1Font', 'Work Sans', sans-serif;
          font-size: 22px;
          font-weight: normal;
          letter-spacing: 0.3px;
          line-height: 1.25;
        }

        .mlh-prize-label {
          margin-bottom: 5px;
          color: rgba(255, 255, 255, 0.45);
        }

        .mlh-prize-name {
          min-height: 42px;
          margin: 0 0 20px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;
          font-weight: 700;
          line-height: 1.3;
        }

        .mlh-prize-card a {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #fff;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1px;
          text-decoration: none;
          text-transform: uppercase;
          transition: color 0.2s ease, gap 0.2s ease;
        }

        .mlh-prize-card a:hover,
        .mlh-prize-card a:focus-visible {
          gap: 12px;
          color: var(--mlh-accent);
        }

        .sponsored-tracks {
          max-width: 1080px;
          margin: 0 auto;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .sponsored-tracks-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .sponsored-yugabyte-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px;
        }

        .yugabyte-banner {
          position: relative;
          overflow: hidden;
          padding: 22px 24px 24px;
          border: 1px solid rgba(255, 132, 45, 0.84);
          border-radius: 22px;
          background:
            radial-gradient(circle at 50% 30%, rgba(196, 74, 12, 0.52), transparent 48%),
            linear-gradient(145deg, #431b0d 0%, #150c0b 88%);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.36);
        }

        .yugabyte-banner::before {
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          height: 4px;
          background: linear-gradient(90deg, #f56b18, #ffd166, #f56b18);
          box-shadow: 0 0 22px rgba(255, 120, 35, 0.9);
          content: '';
        }

        .yugabyte-banner-heading {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          margin-bottom: 18px;
          text-align: center;
        }

        .sponsor-logo-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 172px;
          height: 40px;
          box-sizing: border-box;
          margin-bottom: 4px;
          padding: 5px 13px;
          border-radius: 999px;
          background: #fff;
          box-shadow: 0 5px 18px rgba(0, 0, 0, 0.3);
        }

        .sponsor-logo-badge img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .yugabyte-banner-heading > span {
          color: rgba(255, 255, 255, 0.82);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1.4px;
        }

        .yugabyte-banner-heading > em {
          color: #ffbd70;
          font-family: 'F1Font', 'Work Sans', sans-serif;
          font-size: clamp(16px, 2.4vw, 23px);
          font-style: italic;
          line-height: 1.2;
        }

        .sponsored-prize-card,
        .iomete-card {
          position: relative;
          overflow: hidden;
          border: 1px solid color-mix(in srgb, var(--sponsor-accent) 72%, #5b2631);
          border-radius: 20px;
          background:
            radial-gradient(circle at 85% 12%, color-mix(in srgb, var(--sponsor-accent) 28%, transparent), transparent 38%),
            linear-gradient(145deg, #28121d 0%, #0c0a12 82%);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .sponsored-prize-card::before,
        .iomete-card::before {
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          height: 4px;
          background: var(--sponsor-accent);
          box-shadow: 0 0 20px var(--sponsor-accent);
          content: '';
        }

        .sponsored-prize-card::after,
        .iomete-card::after {
          position: absolute;
          right: -60px;
          bottom: -90px;
          width: 220px;
          height: 220px;
          border: 1px solid color-mix(in srgb, var(--sponsor-accent) 32%, transparent);
          border-radius: 50%;
          box-shadow: 0 0 0 20px color-mix(in srgb, var(--sponsor-accent) 7%, transparent);
          content: '';
          pointer-events: none;
        }

        .sponsored-prize-card:hover,
        .sponsored-prize-card:focus-within,
        .iomete-card:hover {
          transform: translateY(-7px) scale(1.02);
          box-shadow:
            0 0 0 1px color-mix(in srgb, var(--sponsor-accent) 80%, transparent),
            0 0 32px 4px color-mix(in srgb, var(--sponsor-accent) 38%, transparent),
            0 18px 34px rgba(0, 0, 0, 0.42);
        }

        .sponsored-prize-card {
          min-height: 190px;
          padding: 18px 20px 20px;
          text-align: center;
        }

        .sponsored-prize-medal {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          margin: 0 auto 10px;
          border: 5px solid rgba(255, 222, 185, 0.72);
          border-radius: 50%;
          background: color-mix(in srgb, var(--sponsor-accent) 75%, #fff);
          color: #6b2738;
          font-size: 16px;
          box-shadow: 0 0 16px color-mix(in srgb, var(--sponsor-accent) 45%, transparent);
        }

        .sponsored-prize-rank {
          position: relative;
          z-index: 1;
          margin: 0 0 10px;
          color: var(--sponsor-accent);
          font-family: 'F1Font', sans-serif;
          font-size: 14px;
          letter-spacing: 1px;
        }

        .sponsored-prize-card h4 {
          position: relative;
          z-index: 1;
          margin: 0 0 10px;
          color: #ffe2ae;
          font-family: 'F1Font', 'Work Sans', sans-serif;
          font-size: 23px;
          line-height: 1.15;
          text-shadow: 0 0 16px color-mix(in srgb, var(--sponsor-accent) 48%, transparent);
        }

        .sponsored-prize-card p:last-child {
          position: relative;
          z-index: 1;
          margin: 0;
          color: rgba(255, 255, 255, 0.78);
          font-size: 13px;
          font-style: italic;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .iomete-card {
          margin-top: 16px;
          max-width: 780px;
          margin-right: auto;
          margin-left: auto;
          padding: 15px 28px 18px;
          text-align: center;
        }

        .iomete-card-heading {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column-reverse;
          align-items: center;
          gap: 9px;
        }

        .iomete-card-heading span {
          color: rgba(255, 255, 255, 0.7);
          font-size: 11px;
          letter-spacing: 1.6px;
        }

        .iomete-logo {
          width: 126px;
          height: 34px;
          min-width: 0;
          margin-bottom: 0;
        }

        .iomete-quote {
          position: relative;
          z-index: 1;
          margin: 11px 0 8px;
          color: #ffd18e;
          font-family: 'F1Font', 'Work Sans', sans-serif;
          font-size: clamp(16px, 2.2vw, 21px);
          font-style: italic;
          line-height: 1.2;
        }

        .iomete-eyebrow {
          position: relative;
          z-index: 1;
          margin: 8px 0 0;
          color: rgba(255, 255, 255, 0.7);
          font-size: 13px;
          letter-spacing: 0.4px;
        }

        .iomete-prize {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          min-width: min(440px, 100%);
          box-sizing: border-box;
          padding: 7px 12px;
          border: 1px solid color-mix(in srgb, var(--sponsor-accent) 65%, transparent);
          border-radius: 14px;
          background: rgba(62, 18, 30, 0.65);
          text-align: left;
        }

        .iomete-prize .sponsored-prize-medal {
          flex: 0 0 auto;
          width: 28px;
          height: 28px;
          margin: 0;
          border-width: 3px;
          font-size: 14px;
        }

        .iomete-prize > div {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .iomete-prize-label {
          color: var(--sponsor-accent);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .iomete-prize strong {
          color: #fff0cf;
          font-family: 'F1Font', 'Work Sans', sans-serif;
          font-size: 16px;
          font-weight: normal;
        }

        .iomete-prize div > span:last-child {
          color: rgba(255, 255, 255, 0.68);
          font-size: 12px;
          text-transform: uppercase;
        }

        @media (max-width: 992px) {
          .mlh-prize-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .podium-grid {
            flex-direction: column;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: flex-start;
            gap: 24px;
            padding: 40px 0 20px;
          }

          /* Row order (2nd, 1st, 3rd) only makes sense left-to-right; once
             the grid stacks into a column that same order reads top-to-
             bottom, so re-rank it 1st, 2nd, 3rd for a column layout. */
          .podium-card.podium-first { order: 1; }
          .podium-card.podium-second { order: 2; }
          .podium-card.podium-third { order: 3; }
        }

        @media (max-width: 600px) {
          .mlh-prize-grid { grid-template-columns: 1fr; }
          .sponsored-yugabyte-grid { grid-template-columns: 1fr; }
          .iomete-card { padding: 30px 20px; }
          .iomete-prize { min-width: 0; width: 100%; }
          .mlh-prize-card:hover,
          .mlh-prize-card:focus-within { transform: translateY(-5px) scale(1.02); }
        }
      `}</style>

      {/* Overall Prizes */}
      <div className="container">
        <div className="section_title">
          <h2 className="title-dark" data-aos="fade-right" data-aos-duration="1000">
            PRIZES
          </h2>
        </div>

        <PodiumThree
          items={overallPrizes}
          getFields={(p) => ({ amount: p.amount, desc: p.desc, rank: p.rank, logo: p.logo })}
        />
      </div>

      {/* Special Hack Category Cards */}
      <div className="container mt-5">
        <div className="section_title">
          <h3 className="title-dark" data-aos="fade-right" data-aos-duration="1000">
            SPECIAL HACK CATEGORIES
          </h3>
        </div>

        <CategoryGrid
          items={specialHacks}
          getFields={(h) => ({ title: h.title, amount: h.prize, desc: h.extra, logo: h.logo })}
        />
      </div>

      <div className="container mt-5">
        <div className="section_title">
          <h3 className="title-dark" data-aos="fade-right" data-aos-duration="1000">
            MLH PRIZES:
          </h3>
        </div>
        <MlhPrizeGrid items={mlhPrizes} />
      </div>

      <div className="container mt-5">
        <div className="section_title">
          <h3 className="title-dark" data-aos="fade-right" data-aos-duration="1000">
            SPONSORED TRACKS
          </h3>
        </div>
        <SponsoredTracks />
      </div>

      {/* Base44 Track */}
      {/* <div className="container mt-5">
        <div className="section_title">
          <h3 className="title-dark" data-aos="fade-right" data-aos-duration="1000">
            Base44 TRACK PRIZES
          </h3>
        </div>

        <PodiumThree
          items={base44Prizes}
          getFields={(p) => ({ amount: p.prize, desc: p.extra, note: p.note, rank: p.rank, logo: p.logo })}
        />
      </div> */}

      {/* AWS Track */}
      {/* <div className="container mt-5">
        <div className="section_title">
          <h3 className="title-dark" data-aos="fade-right" data-aos-duration="1000">
            Powered by Devfolio In association with AWS
          </h3>
          <h4 className="title-dark" style={{ color: '#efefef' }}>
            REMARKABLE INTEGRATION OF AWS
          </h4>
        </div>

        <DuoRow
          items={awsPrizes}
          getFields={(p) => ({ amount: p.amount, rank: p.rank, logo: p.logo })}
        />
      </div> */}

      {/* Qyrus Track */}
      {/* <div className="container mt-5">
        <div className="section_title">
          <h3 className="title-dark" data-aos="fade-right" data-aos-duration="1000">
            Qyrus TRACK PRIZES
          </h3>
        </div>

        <PodiumThree
          items={qyrusPrizes.slice(0, 3)}
          getFields={(p) => ({ amount: p.prize, desc: p.extra, rank: p.rank, logo: p.logo })}
        />

        <RunnerRow
          items={qyrusPrizes.slice(3)}
          getFields={(p) => ({ amount: p.prize, desc: p.extra, rank: p.rank, logo: p.logo })}
        />
      </div> */}

      {/* Benefits Card Banner */}
      {/*<div className="benefits style-card mt-5" style={{ width: '100%' }}>
        <div className="benefits-card" style={{ textAlign: 'center', padding: '30px' }}>
          <p style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>Benefits Worth $220,000</p>
          <p style={{ color: '#ccc', margin: '15px 0' }}>
            All participants of hackCBS 9.0 will receive digital credits, vouchers, and other benefits worth $220,000
          </p>
          <span className="button banner-button-style" style={{ display: 'inline-block', marginTop: '15px' }}>
            All Participants Eligible
          </span>
        </div>
      </div>*/}
    </section>
  );
}
