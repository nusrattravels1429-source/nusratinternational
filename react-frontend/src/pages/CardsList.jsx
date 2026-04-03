import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/cards';

function CardsList() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(API_URL);
        if (response.data.success) {
          setCards(response.data.data);
        } else {
          setError('Failed to fetch cards');
        }
      } catch (err) {
        setError('Error connecting to server. Make sure the backend is running on port 5000.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  const filteredCards = filter === 'all' 
    ? cards 
    : cards.filter(card => card.category === filter);

  const categories = ['all', 'travel', 'hajj', 'umrah', 'work'];

  if (loading) {
    return (
      <div className="cards-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cards-page">
        <div className="error-container">
          <p className="error-message">⚠️ {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cards-page">
      <div className="cards-header">
        <h1>Nusrat International Packages</h1>
        <p>Explore our travel, Hajj, Umrah, and work opportunities</p>
        
        <div className="filter-buttons">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="cards-grid">
        {filteredCards.length === 0 ? (
          <p className="no-cards">No packages found in this category.</p>
        ) : (
          filteredCards.map(card => (
            <div key={card._id} className={`pkg-card ${card.isFeatured ? 'featured' : ''}`}>
              <div className="pkg-img-wrap">
                <img src={card.image} alt={card.title.en} />
                <div className="pkg-price">৳{card.price.toLocaleString()}</div>
                <div className="pkg-duration">{card.duration}</div>
                {card.isFeatured && <span className="featured-badge">Featured</span>}
              </div>
              <div className="pkg-body">
                <div className="pkg-top">
                  <div>
                    <h3>{card.title.en}</h3>
                    <h4>{card.title.bn}</h4>
                  </div>
                  <span className="rating">★ {card.rating}</span>
                </div>
                <p className="pkg-desc">{card.description.en}</p>
                <p className="pkg-desc bn">{card.description.bn}</p>
                <Link to={`/cards/${card._id}`}>
                  <button className="view-btn">View Details | বিস্তারিত দেখুন</button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CardsList;
