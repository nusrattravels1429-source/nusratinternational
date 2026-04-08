import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/cards';

function CardDetail() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_URL}/${id}`);
        if (response.data.success) {
          setCard(response.data.data);
        } else {
          setError('Card not found');
        }
      } catch (err) {
        setError('Error fetching card details. Make sure the backend is running.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [id]);

  if (loading) {
    return (
      <div className="detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading details...</p>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="detail-page">
        <div className="error-container">
          <p className="error-message">⚠️ {error || 'Card not found'}</p>
          <Link to="/" className="back-btn">← Back to Packages</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <div className="detail-header">
        <Link to="/" className="back-btn">← Back to Packages</Link>
        {card.isFeatured && <span className="featured-badge-large">Featured Package</span>}
      </div>

      <div className="detail-content">
        <div className="detail-images">
          <img src={card.image} alt={card.title.en} className="main-image" />
          {card.images && card.images.length > 1 && (
            <div className="image-gallery">
              {card.images.slice(1).map((img, idx) => (
                <img key={idx} src={img} alt={`${card.title.en} ${idx + 1}`} className="gallery-image" />
              ))}
            </div>
          )}
        </div>

        <div className="detail-info">
          <div className="detail-title-section">
            <h1>{card.title.en}</h1>
            <h2>{card.title.bn}</h2>
            <div className="detail-meta">
              <span className="category-tag">{card.category.toUpperCase()}</span>
              <span className="rating-large">★ {card.rating}</span>
            </div>
          </div>

          <div className="detail-price-section">
            <span className="price-large">৳{card.price.toLocaleString()}</span>
            <span className="duration">{card.duration}</span>
          </div>

          <div className="detail-description">
            <h3>Description</h3>
            <p>{card.description.en}</p>
            <p className="bn">{card.description.bn}</p>
          </div>

          {card.features && card.features.length > 0 && (
            <div className="detail-features">
              <h3>Key Features</h3>
              <ul>
                {card.features.map((feature, idx) => (
                  <li key={idx}>✓ {feature}</li>
                ))}
              </ul>
            </div>
          )}

          {card.included && card.included.length > 0 && (
            <div className="detail-included">
              <h3>What's Included</h3>
              <ul>
                {card.included.map((item, idx) => (
                  <li key={idx}>✓ {item}</li>
                ))}
              </ul>
            </div>
          )}

          {card.details && (
            <div className="detail-extras">
              {card.details.itinerary && (
                <div className="detail-section">
                  <h3>Itinerary</h3>
                  <ul>
                    {card.details.itinerary.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {card.details.accommodation && (
                <div className="detail-section">
                  <h3>Accommodation</h3>
                  <p>{card.details.accommodation}</p>
                </div>
              )}
              
              {card.details.transportation && (
                <div className="detail-section">
                  <h3>Transportation</h3>
                  <p>{card.details.transportation}</p>
                </div>
              )}
              
              {card.details.guide && (
                <div className="detail-section">
                  <h3>Guide</h3>
                  <p>{card.details.guide}</p>
                </div>
              )}

              {card.details.salary && (
                <div className="detail-section">
                  <h3>Salary</h3>
                  <p className="salary-highlight">{card.details.salary}</p>
                </div>
              )}

              {card.details.contractDuration && (
                <div className="detail-section">
                  <h3>Contract Duration</h3>
                  <p>{card.details.contractDuration}</p>
                </div>
              )}

              {card.details.sectors && (
                <div className="detail-section">
                  <h3>Sectors</h3>
                  <div className="sectors-tags">
                    {card.details.sectors.map((sector, idx) => (
                      <span key={idx} className="sector-tag">{sector}</span>
                    ))}
                  </div>
                </div>
              )}

              {card.details.requirements && (
                <div className="detail-section">
                  <h3>Requirements</h3>
                  <ul>
                    {card.details.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {card.details.applicationProcess && (
                <div className="detail-section">
                  <h3>Application Process</h3>
                  <ol>
                    {card.details.applicationProcess.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {card.details.programme && (
                <div className="detail-section">
                  <h3>Programme</h3>
                  <ul>
                    {card.details.programme.map((prog, idx) => (
                      <li key={idx}>{prog}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="detail-contact">
            <h3>Interested?</h3>
            <p>Contact us to book this package or learn more.</p>
            <a href="tel:+8801234567890" className="contact-btn">📞 Call Now</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardDetail;
