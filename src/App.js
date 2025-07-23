import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://countries-search-data-prod-812920491762.asia-south1.run.app/countries');
        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }
        const data = await response.json();
        const validCountries = data.filter(country => 
          country && country.common && country.png
        );
        setCountries(validCountries);
      } catch (err) {
        console.error('Error fetching countries:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const filteredCountries = countries.filter(country => {
    const countryName = country?.common || '';
    return countryName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return <div className="loading">Loading countries...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="App">
      <h1>Country Search</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a country..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="country-container">
        {filteredCountries.length > 0 ? (
          filteredCountries.map(country => (
            <div className="countryCard">
              <img src={country.png} alt={`Flag of ${country.common}`} />
              <p>{country.common}</p>
            </div>
          ))
        ) : (
          <div className="no-results">
            {searchTerm ? 'No countries found matching your search' : 'No countries available'}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;