import axios from 'axios';

const baseUrl = 'https://api.openweathermap.org/data/2.5';

const getWeatherReport = (city) => {
  const request = axios.get(
    `${baseUrl}/weather?q=${city}&units=metric&appid=${
      import.meta.env.VITE_WEATHER_API_KEY
    }`
  );
  return request.then((response) => response.data);
};

export default { getWeatherReport };
