import { useEffect, useState } from 'react';
import weatherService from '../services/weather';

const CountryDetails = ({ name, capital, area, languages, flag }) => {
  const [weatherReport, setWeatherReport] = useState(null);

  const getWeatherReport = (capital) => {
    weatherService.getWeatherReport(capital).then((response) => {
      console.log(response);
      setWeatherReport(response);
    });
  };

  useEffect(() => {
    getWeatherReport(capital);
  }, [capital]);

  return (
    <div>
      <h1>{name}</h1>
      <div>Capital {capital}</div>
      <div>Area {area}</div>
      <h2>Languages </h2>
      <ul>
        {languages.map((language, index) => (
          <li key={index}>{language}</li>
        ))}
      </ul>
      <img src={flag} alt={`${name} flag`} />

      <h2>Weather in {capital}</h2>
      {weatherReport !== null && (
        <>
          <div>Temperature {weatherReport.main.temp} Celcius</div>
          <img
            src={`https://openweathermap.org/img/wn/${weatherReport.weather[0].icon}@2x.png`}
            alt=''
          />
          <div>Wind {weatherReport.wind.speed} m/s</div>
        </>
      )}
    </div>
  );
};

export default CountryDetails;
