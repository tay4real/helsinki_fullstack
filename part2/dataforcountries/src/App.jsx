import { useState, useEffect } from 'react';
import Notification from './components/Notification';
import countryService from './services/countries';
import CountryDetails from './components/CountryDetails';

function App() {
  const [search, setSearch] = useState('');
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);

  const handleInput = (event) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    countryService.getAllCountries().then((response) => setCountries(response));
  }, []);

  useEffect(() => {
    setFilteredCountries(
      countries.filter((country) =>
        country.name.common.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  const displayCountryDetails = (name) => {
    setFilteredCountries(
      countries.filter((country) => country.name.common === name)
    );
  };

  

 
  return (
    <div>
      <div>
        find countries <input value={search} onChange={handleInput} />
      </div>
      {filteredCountries.length > 10 ? (
        <Notification message='Too many matches, specify another filter' />
      ) : filteredCountries.length === 1 ? (
        <CountryDetails
          name={filteredCountries[0].name.common}
          capital={filteredCountries[0].capital}
          area={filteredCountries[0].area}
          languages={Object.values(filteredCountries[0].languages)}
          flag={filteredCountries[0].flags.png}

        />
      ) : (
        filteredCountries.map((country) => (
          <div key={country.cca2}>
            {country.name.common}{' '}
            <button onClick={() => displayCountryDetails(country.name.common)}>
              Show
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
