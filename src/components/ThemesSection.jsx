import React from 'react';
import { themesData } from '../data/themesData';

function ThemeCard({ theme }) {
  const [isFlipped, setIsFlipped] = React.useState(false);

  return (
    <div
      role="button"
      tabIndex="0"
      className={`theme-card${isFlipped ? ' is-flipped' : ''}`}
      style={{ '--team-color': theme.color }}
      aria-pressed={isFlipped}
      aria-label={`${isFlipped ? 'Show artwork for' : 'Show details for'} ${theme.title}`}
      onClick={() => setIsFlipped((flipped) => !flipped)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setIsFlipped((flipped) => !flipped);
        }
      }}
    >
      <span className={`theme-card-content${isFlipped ? ' is-flipped' : ''}`} key={isFlipped ? 'back' : 'front'}>
        {isFlipped ? (
        <span className="theme-card-face theme-card-back">
          <span className="theme-card-back-title">{theme.title}</span>
          <span className="theme-card-back-description">{theme.description}</span>
          <span className="theme-card-back-hint">Tap to flip back</span>
        </span>
        ) : (
        <span className="theme-card-face theme-card-front">
          <img
            loading="eager"
            decoding="async"
            src={theme.card}
            alt=""
          />
        </span>
        )}
      </span>
    </div>
  );
}

export default function ThemesSection() {
  return (
    <section id="themes" className="themes-section">
      <style>{`
        .themes-section {
          padding: 100px 0;
          position: relative;
        }

        .themes-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        @media (max-width: 992px) {
          .themes-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .themes-grid { grid-template-columns: 1fr; }
        }

        .theme-card {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          padding: 0;
          border: 0;
          color: inherit;
          background: transparent;
          border-radius: 14px;
          cursor: pointer;
          display: block;
          line-height: 0;
          perspective: 1000px;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          box-shadow: 0 0 0 1px color-mix(in srgb, var(--team-color) 40%, transparent);
        }

        .theme-card:hover {
          transform: translateY(-6px);
          box-shadow:
            0 0 0 1px color-mix(in srgb, var(--team-color) 95%, transparent),
            0 0 26px 4px color-mix(in srgb, var(--team-color) 70%, transparent),
            0 18px 54px 8px color-mix(in srgb, var(--team-color) 45%, transparent);
        }

        .theme-card:focus-visible {
          outline: 3px solid var(--team-color);
          outline-offset: 4px;
        }

        .theme-card-content {
          position: absolute;
          inset: 0;
          animation: theme-card-flip-in 0.45s cubic-bezier(0.2, 0.7, 0.2, 1);
        }

        .theme-card-face {
          position: absolute;
          inset: 0;
          box-sizing: border-box;
          border-radius: 14px;
          overflow: hidden;
        }

        .theme-card-front {
          background: #090909;
        }

        .theme-card-front img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .theme-card-back {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
          gap: 8px;
          padding: 20px;
          line-height: 1.4;
          text-align: left;
          overflow: hidden;
          background:
            linear-gradient(145deg, color-mix(in srgb, var(--team-color) 22%, #121212), #090909 75%);
          border: 1px solid color-mix(in srgb, var(--team-color) 70%, transparent);
        }

        @keyframes theme-card-flip-in {
          from { transform: perspective(900px) rotateY(-18deg) scale(0.98); }
          to { transform: rotateY(0deg); }
        }

        .theme-card-back-hint {
          color: var(--team-color);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .theme-card-back-title {
          color: #fff;
          font-size: clamp(16px, 1.8vw, 21px);
          font-weight: 800;
          line-height: 1.15;
        }

        .theme-card-back-description {
          color: rgba(255, 255, 255, 0.78);
          font-size: clamp(11px, 1vw, 13px);
          line-height: 1.35;
        }

        .theme-card-back-hint {
          margin-top: auto;
          font-size: 9px;
          opacity: 0.8;
        }

        @media (max-width: 480px) {
          .themes-section > .container {
            padding-left: 24px;
            padding-right: 24px;
          }

          .themes-grid {
            gap: 20px;
          }

          .theme-card-back {
            justify-content: center;
            padding: 24px;
            gap: 12px;
          }

          .theme-card-back-title {
            font-size: 24px;
            line-height: 1.2;
          }

          .theme-card-back-description {
            font-size: 15px;
            line-height: 1.5;
          }

          .theme-card-back-hint {
            margin-top: 6px;
            font-size: 10px;
          }
        }
      `}</style>

      <div className="container">
        <div className="section_title">
          <h2 className="title-dark" data-aos="fade-right" data-aos-duration="1000">
            Hackathon Themes
          </h2>
        </div>

        <div className="themes-grid">
          {themesData.map((theme, idx) => (
            <ThemeCard theme={theme} key={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
