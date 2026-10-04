import { useEffect, useState } from 'react';
import { sponsorsData } from '../data/sponsorsData';

const initialFormData = {
  name: '',
  company: '',
  email: '',
  phone: '',
  sponsorshipType: '',
  message: '',
  website: ''
};

const sponsorFormEndpoint = import.meta.env.VITE_SPONSOR_FORM_ENDPOINT;

export default function SponsorsSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  useEffect(() => {
    if (!isModalOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const openModal = () => {
    setSubmissionStatus(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (!isSubmitting) {
      setIsModalOpen(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!sponsorFormEndpoint) {
      setSubmissionStatus({
        type: 'error',
        message: 'The sponsorship form is not configured yet.'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus(null);

    try {
      const payload = new URLSearchParams();

      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });

      await fetch(sponsorFormEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: payload.toString()
      });

      setFormData(initialFormData);
      setSubmissionStatus({
        type: 'success',
        message: 'Thank you. We will get in touch with you soon.'
      });
    } catch {
      setSubmissionStatus({
        type: 'error',
        message: 'Something went wrong. Please try again or email us directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="pt100 pb100" id="sponsors">
        <div className="container">
          <div className="section_title">
            <h2
              className="title-dark"
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-anchor-placement="top-bottom"
            >
              Current Sponsors
            </h2>
          </div>
        </div>

        <div className="sponsor-container container">
          {sponsorsData.titleSponsors.map((sponsor, idx) => (
            <div className="section title-section" key={idx}>
              <div className="heading" data-aos="fade-up" data-aos-duration="1000">
                {sponsor.title}
              </div>
              <a
                href={sponsor.url}
                className="img"
                target="_blank"
                rel="noopener noreferrer"
                data-aos="fade-up"
                data-aos-duration="1000"
              >
                <img src={sponsor.img} alt={sponsor.name} loading="lazy" decoding="async" />
              </a>
            </div>
          ))}

          {sponsorsData.categoryPartners.map((sponsor, idx) => (
            <div className="section web3-section" key={idx}>
              <div className="heading" data-aos="fade-up" data-aos-duration="1000">
                {sponsor.title}
              </div>
              <a
                href={sponsor.url}
                className="img"
                target="_blank"
                rel="noopener noreferrer"
                data-aos="fade-up"
                data-aos-duration="1000"
              >
                <img src={sponsor.img} alt={sponsor.name} loading="lazy" decoding="async" />
              </a>
            </div>
          ))}

          <div className="section partner-section">
            {sponsorsData.eventPartners.map((partner, idx) => (
              <div className={idx === 0 ? 'left' : 'right'} key={idx}>
                <div className="heading" data-aos="fade-up" data-aos-duration="1000">
                  {partner.title}
                </div>
                <a
                  href={partner.url}
                  className="img"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-aos="fade-up"
                  data-aos-duration="1000"
                >
                  <img src={partner.img} alt={partner.name} loading="lazy" decoding="async" />
                </a>
              </div>
            ))}
          </div>

          <div className="section general-section">
            <div className="heading" data-aos="fade-up" data-aos-duration="1000" />
            <div className="img-grid">
              {sponsorsData.generalSponsors.map((sponsor, idx) => (
                <a
                  href={sponsor.url}
                  className="img"
                  target="_blank"
                  rel="noopener noreferrer"
                  key={idx}
                  data-aos="fade-up"
                  data-aos-duration="1000"
                >
                  <img src={sponsor.img} alt={sponsor.name} loading="lazy" decoding="async" />
                </a>
              ))}
            </div>
          </div>

          <div className="section community-section">
            <div className="heading" data-aos="fade-up" data-aos-duration="1000" />
            <div className="img-grid">
              {sponsorsData.communityPartners.map((partner, idx) => (
                <a
                  href={partner.url}
                  className="img"
                  target="_blank"
                  rel="noopener noreferrer"
                  key={idx}
                  data-aos="fade-up"
                  data-aos-duration="1000"
                >
                  <img src={partner.img} alt={partner.name} loading="lazy" decoding="async" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <br />

        <center>
          <div className="row">
            <div className="col-md-12" data-aos="fade-up" data-aos-duration="1000">
              <button className="cta sponsor_us_btn" type="button" onClick={openModal}>
                <span className="hover-underline-animation" style={{ fontSize: '17px' }}>
                  Sponsor Us
                </span>
              </button>
            </div>
          </div>
        </center>
      </section>

      {isModalOpen && (
        <div
          className="sponsor-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            className="sponsor-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sponsor-modal-title"
          >
            <button
              className="sponsor-modal-close"
              type="button"
              onClick={closeModal}
              aria-label="Close sponsorship form"
              disabled={isSubmitting}
            >
              ×
            </button>

            <h2 id="sponsor-modal-title">Partner with hackCBS</h2>
            <p className="sponsor-modal-intro">
              Tell us a little about your organization and sponsorship requirements.
            </p>

            {submissionStatus?.type === 'success' ? (
              <div className="sponsor-form-success" role="status">
                <strong>Request submitted successfully.</strong>
                <p>{submissionStatus.message}</p>
                <button type="button" onClick={closeModal}>
                  Close
                </button>
              </div>
            ) : (
              <form className="sponsor-form" onSubmit={handleSubmit}>
                <div className="sponsor-form-grid">
                  <label>
                    Name *
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      autoComplete="name"
                    />
                  </label>

                  <label>
                    Company / Organization *
                    <input
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                      autoComplete="organization"
                    />
                  </label>

                  <label>
                    Email *
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      autoComplete="email"
                    />
                  </label>

                  <label>
                    Phone / WhatsApp *
                    <input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      autoComplete="tel"
                    />
                  </label>
                </div>

                <label>
                  Sponsorship Type *
                  <select
                    name="sponsorshipType"
                    value={formData.sponsorshipType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select an option</option>
                    <option value="Title Sponsor">Title Sponsor</option>
                    <option value="Gold Sponsor">Gold Sponsor</option>
                    <option value="Silver Sponsor">Silver Sponsor</option>
                    <option value="Community Partner">Community Partner</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <label>
                  Message *
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                    required
                    placeholder="Tell us about your sponsorship requirements"
                  />
                </label>

                <label className="sponsor-form-honeypot" aria-hidden="true">
                  Website
                  <input
                    name="website"
                    type="text"
                    value={formData.website}
                    onChange={handleInputChange}
                    tabIndex="-1"
                    autoComplete="off"
                  />
                </label>

                {submissionStatus?.type === 'error' && (
                  <p className="sponsor-form-error" role="alert">
                    {submissionStatus.message}
                  </p>
                )}

                <button className="sponsor-form-submit" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Sponsorship Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
