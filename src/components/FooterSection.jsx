import React, { useEffect, useState } from 'react';

// Order matters: phone / email / phone, so email lands in the middle column.
const CONTACT_ITEMS = [
  {
    icon: 'phone',
    name: 'Om Parida',
    value: '+91 86585 74552',
    href: 'tel:+918658574552',
    color: '#3C9DFF'
  },
  {
    icon: 'email',
    name: 'Email Us',
    value: 'hackcbssupport@gmail.com',
    href: 'mailto:hackcbssupport@gmail.com',
    color: '#FF2800'
  },
  {
    icon: 'phone',
    name: 'Shreyas Yadav',
    value: '+91 78001 36502',
    href: 'tel:+917800136502',
    color: '#FF9C4A'
  }
];

function SocialIcon({ type }) {
  const paths = {
    instagram: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A4.5 4.5 0 1 1 12 16.5 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 12 14.5 2.5 2.5 0 0 0 12 9.5ZM17.5 6a1.5 1.5 0 1 1-1.5 1.5A1.5 1.5 0 0 1 17.5 6Z',
    linkedin: 'M5 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1 0-5ZM3 10h4v11H3V10Zm6 0h3.8v1.5h.1A4.2 4.2 0 0 1 17 10c4 0 4 3.4 4 7v4h-4v-3.6c0-1.7 0-3.9-2.4-3.9-2.4 0-2.7 1.9-2.7 3.8V21H10V10Z',
    x: 'M5 3h4.2l3.1 4.5L16.2 3H19l-5.4 6.1L20 21h-4.2l-3.6-5.2L7.5 21H4.7l5.8-6.7L5 3Zm3.2 2 7.8 14h1.1L9.3 5H8.2Z',
    youtube: 'M21.6 7.2a2.8 2.8 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.8 2.8 0 0 0-2 2C2 9 2 12 2 12s0 3 .4 4.8a2.8 2.8 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.8 2.8 0 0 0 2-2C22 15 22 12 22 12s0-3-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z'
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={paths[type]} fill="currentColor" />
    </svg>
  );
}

function ContactIcon({ type }) {
  if (type === 'email') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M3 5h18v14H3z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M7.7 3.5 10 6.8 8.3 9a13.7 13.7 0 0 0 6.7 6.7l2.2-1.7 3.3 2.3-1.5 3.1c-.5 1-1.5 1.5-2.6 1.3C9.4 19.3 4.7 14.6 3.3 7.6 3 6.5 3.6 5.5 4.6 5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FooterSection() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Contact Section */}
      <section id="contact" className="pb100 pt25" style={{ background: '#000000' }}>
        <style>{`
          /* f1c- prefix: this codebase's global style-v8.css already defines
             .contact, .contact-card, .contact-icon etc (with !important on
             some), so plain names here would silently collide with those. */
          .f1c-card {
            position: relative;
            max-width: 980px;
            margin: 0 auto;
            padding: 48px 40px;
            border-radius: 28px;
            background: #1c1c20;
            box-shadow:
              14px 14px 28px rgba(0, 0, 0, 0.55),
              -14px -14px 28px rgba(255, 255, 255, 0.035);
          }

          .f1c-columns {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 32px;
          }

          .f1c-item {
            flex: 1 1 0;
            min-width: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            text-decoration: none;
          }

          .f1c-divider {
            width: 4px;
            height: 120px;
            align-self: center;
            flex-shrink: 0;
            border-radius: 4px;
            background: #1c1c20;
            box-shadow:
              inset 3px 3px 6px rgba(0, 0, 0, 0.55),
              inset -3px -3px 6px rgba(255, 255, 255, 0.03);
          }

          .f1c-icon {
            width: 64px;
            height: 64px;
            margin: 0 0 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: var(--ci-color);
            background: #1c1c20;
            box-shadow:
              inset 5px 5px 10px rgba(0, 0, 0, 0.55),
              inset -5px -5px 10px rgba(255, 255, 255, 0.035);
            transition: box-shadow 0.2s ease, transform 0.2s ease;
          }

          .f1c-icon svg {
            width: 28px;
            height: 28px;
            display: block;
          }

          .f1c-item:hover .f1c-icon {
            transform: scale(1.04);
            box-shadow:
              5px 5px 10px rgba(0, 0, 0, 0.55),
              -5px -5px 10px rgba(255, 255, 255, 0.035);
          }

          .f1c-name {
            font-size: 19px;
            font-weight: 700;
            color: rgba(255, 255, 255, 0.85);
            white-space: nowrap;
            margin: 0 0 10px;
          }

          .f1c-value {
            font-size: 16px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.6);
            white-space: nowrap;
            transition: color 0.2s ease;
          }

          .f1c-item:hover .f1c-value {
            color: var(--ci-color);
          }

          @media (max-width: 700px) {
            .f1c-card { padding: 32px 20px; }
            .f1c-columns {
              flex-direction: column;
              align-items: center;
              gap: 30px;
            }
            .f1c-divider {
              width: 70%;
              height: 4px;
            }
            .f1c-name, .f1c-value {
              white-space: normal;
            }
          }

          @media (max-width: 460px) {
            .f1c-name { font-size: 17px; }
            .f1c-value { font-size: 15px; }
          }

          .lgx-social-footer > li {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            margin: 0;
            padding: 0 !important;
            opacity: 1;
            border-radius: 50%;
            background: #101116 !important;
            box-sizing: border-box;
          }

          .lgx-social-footer {
            display: flex;
            align-items: center;
            gap: 12px;
            margin: 0;
            padding: 0;
          }

          .lgx-social-footer > li > a {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            color: #87ceeb !important;
            border-radius: 50%;
          }

          .lgx-social-footer > li:hover {
            background: rgba(255, 138, 234, 0.2) !important;
          }

          .lgx-social-footer > li:nth-child(1) > a {
            color: #e4405f !important;
          }

          .lgx-social-footer > li:nth-child(2) > a {
            color: #0a66c2 !important;
          }

          .lgx-social-footer > li:nth-child(3) > a {
            color: #ffffff !important;
          }

          .lgx-social-footer > li:nth-child(4) > a {
            color: #ff0000 !important;
          }

          .lgx-social-footer svg {
            width: 22px;
            height: 22px;
            display: block;
          }

          .lgx-social-footer:hover > li {
            opacity: 1;
          }
        `}</style>

        <div className="container">
          <div className="section_title">
            <h2 className="title-dark" data-aos="fade-right" data-aos-duration="1000">
              CONTACT US
            </h2>
          </div>

          <div className="f1c-card" data-aos="fade-up" data-aos-duration="800">
            <div className="f1c-columns">
              {CONTACT_ITEMS.map((item, idx) => (
                <React.Fragment key={item.value}>
                  {idx > 0 && <div className="f1c-divider" aria-hidden="true" />}
                  <a className="f1c-item" href={item.href} style={{ '--ci-color': item.color }}>
                    <div className="f1c-icon">
                      <ContactIcon type={item.icon} />
                    </div>
                    <p className="f1c-name">{item.name}</p>
                    <span className="f1c-value">{item.value}</span>
                  </a>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div id="lgx-footer" className="lgx-footer">
          <div className="lgx-inner-footer">
            <div className="container-fluid">
              <div className="row">
                <div className="lgx-footer-area">
                  <div className="col-md-3" style={{ padding: '0px' }}>
                    <div className="lgx-footer-single" style={{ textAlign: 'center' }}>
                      <a href="#" className="lgx-scroll">
                        <img 
                          loading="lazy" 
                          decoding="async" 
                          src="/assets/img/9.0_assets/hackCBS9.0_logo_white.png" 
                          width="300px" 
                          alt="hackCBS 9.0 Logo" 
                        />
                      </a>
                    </div>
                  </div>

                  <div className="col-md-3 address_footer">
                    <div className="lgx-footer-single">
                      <h3 className="footer-title">Venue</h3>
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3498.580254099303!2d77.1160121747764!3d28.732087675610426!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d013938e13ba5%3A0xbacd4c8f320fa4ff!2sSHAHEED%20SUKHDEV%20COLLEGE%20OF%20BUSINESS%20STUDIES!5e0!3m2!1sen!2sin!4v1694593915477!5m2!1sen!2sin"
                        width="215"
                        height="150"
                        style={{ border: 0, borderRadius: '0.4rem' }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Shaheed Sukhdev College of Business Studies"
                      ></iframe>
                      <p style={{ color: '#ff5a66', marginTop: '10px' }}><b>October-November 2026</b></p>
                      <a href="https://goo.gl/maps/TzNt7TZ2tLfWApzF7" className="lgx-scroll resource_color" target="_blank" rel="noopener noreferrer">
                        Shaheed Sukhdev College of Business Studies<br />
                      </a>
                    </div>
                  </div>

                  <div className="col-md-2">
                    <div className="lgx-footer-single">
                      <h3 className="footer-title">Resources</h3>
                      <a href="/assets/docs/Code_of_Conduct.pdf" target="_blank" rel="noopener noreferrer" className="resource_color">Code of Conduct</a>
                      <br />
                      <h3 className="footer-title" style={{ marginTop: '15px' }}>Archives</h3>
                      <a href="https://v2.hackcbs.tech" target="_blank" rel="noopener noreferrer" className="resource_color">hackCBS 2.0</a><br />
                      <a href="https://v3.hackcbs.tech" target="_blank" rel="noopener noreferrer" className="resource_color">hackCBS 3.0</a><br />
                      <a href="https://v4.hackcbs.tech" target="_blank" rel="noopener noreferrer" className="resource_color">hackCBS 4.0</a><br />
                      <a href="https://v5.hackcbs.tech" target="_blank" rel="noopener noreferrer" className="resource_color">hackCBS 5.0</a><br />
                      <a href="https://v6.hackcbs.tech" target="_blank" rel="noopener noreferrer" className="resource_color">hackCBS 6.0</a>
                    </div>
                  </div>

                  <div className="col-md-1">
                    <div className="lgx-footer-single">
                      <h3 className="footer-title">Community</h3>
                      <a href="http://bit.ly/hackcbs_discord" target="_blank" rel="noopener noreferrer" className="resource_color">
                        <i className="fab fa-discord"></i> Discord
                      </a><br />

                      <h3 className="footer-title" style={{ marginTop: '15px' }}>Policies</h3>
                      <a href="/assets/docs/privacy-policy/PrivacyPolicy_hackCBS.pdf" target="_blank" rel="noopener noreferrer" className="resource_color">Privacy Policy</a><br />
                      <a href="/assets/docs/terms-of-service/" target="_blank" rel="noopener noreferrer" className="resource_color" style={{ whiteSpace: 'nowrap' }}>Terms of Service</a>
                    </div>
                  </div>

                  <div className="col-md-3 social" style={{ padding: '0 3vw' }}>
                    <div className="lgx-footer-single">
                      <h3 className="footer-title">Social Connection</h3>
                      <p className="text">Follow us for latest updates:</p>
                      <ul className="list-inline lgx-social-footer">
                        <li><a href="https://www.instagram.com/hackcbs/" target="_blank" rel="noopener noreferrer"><SocialIcon type="instagram" /></a></li>
                        <li><a href="https://www.linkedin.com/company/hackcbs" target="_blank" rel="noopener noreferrer"><SocialIcon type="linkedin" /></a></li>
                        <li><a href="https://x.com/hackCBS" target="_blank" rel="noopener noreferrer"><SocialIcon type="x" /></a></li>
                        <li><a href="http://bit.ly/hackCBS-YouTube" target="_blank" rel="noopener noreferrer"><SocialIcon type="youtube" /></a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="footer-text-container">
                  <hr />
                  <div className="col-sm-12">
                    <h5 style={{ color: 'white', textAlign: 'center' }}>
                      <a href="https://www.linkedin.com/company/hackcbs/posts/?feedView=all" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none' }}>
                        Designed with ❤️ by Team hackCBS
                      </a>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Back-to-Top Button */}
      {showScrollTop && (
        <button 
          type="button" 
          className="btn btn-floating btn-lg" 
          id="btn-back-to-top" 
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            display: 'block',
            backgroundColor: '#e10600',
            color: '#fff',
            borderRadius: '50%',
            zIndex: 999,
            width: '50px',
            height: '50px',
            border: 'none',
            boxShadow: '0 4px 15px rgba(225, 6, 0, 0.4)'
          }}
        >
          <i className="fas fa-arrow-up"></i>
        </button>
      )}
    </>
  );
}
