import React, { useState } from 'react';
import axios from 'axios';

function WeatherPage() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    try {
      const res = await axios.get(`http://localhost:5050/api/weather/${city}`);
      setWeather(res.data);
      setError('');
    } catch (err) {
      setError('查询失败，请检查城市名称。');
      setWeather(null);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">天气查询</h2>

      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="请输入城市名称，如：Beijing"
        className="w-full px-4 py-2 border rounded mb-4"
      />

      <button
        onClick={fetchWeather}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        查询天气
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {weather && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow">
          <h3 className="text-xl font-semibold">{weather.name}</h3>
          <p>🌡️ 温度：{weather.main.temp}°C</p>
          <p>🌥️ 天气：{weather.weather[0].description}</p>
          <p>💨 风速：{weather.wind.speed} m/s</p>
          <p>🌡️ 湿度：{weather.main.humidity}%</p>
        </div>
      )}
    </div>
  );
}

export default WeatherPage;
