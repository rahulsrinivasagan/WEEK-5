import React, { useState } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Weather from "./components/Weather";
import { useEffect } from "react";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const customIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
});

const API_KEY = "0f36607f5e5172322e9d86b94ca74eb3"; // 🔑 replace

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [recent, setRecent] = useState([]);
  const [activeTab, setActiveTab] = useState("weather");
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      fetchByCoords(pos.coords.latitude, pos.coords.longitude);
    });
  }, []);

  const LocationPicker = ({ onSelect }) => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        onSelect(lat, lng);
      },
    });
    return null;
  };

  const fetchByCoords = async (lat, lon) => {
    setPosition([lat, lon]); // 🔥 set marker

    try {
      const res1 = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data1 = await res1.json();
      setWeather(data1);

      const res2 = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data2 = await res2.json();

      const daily = data2.list.filter((_, i) => i % 8 === 0);
      setForecast(daily);

    } catch (err) {
      console.log(err);
    }
  };

  const fetchWeather = async (cityName) => {
    if (!cityName) return;
    
    setLoading(true);
    setError("");

    try {
      const res1 = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data1 = await res1.json();

      if (data1.cod !== 200) {
        alert("City not found");
        return;
      }

      setWeather(data1);

      const res2 = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data2 = await res2.json();

      const daily = data2.list.filter((_, i) => i % 8 === 0);
      setForecast(daily);

      setRecent((prev) => {
        const exists = prev.find((c) => c.name === data1.name);
        if (exists) return prev;

        return [
          {
            name: data1.name,
            temp: Math.round(data1.main.temp),
          },
          ...prev.slice(0, 4),
        ];
      });

    } catch (err) {
      setError("Something went wrong");
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather(city);
    setCity("");
  };

  const MapView = () => {
  return (
    <div className="fade">

      <MapContainer
        center={[20, 77]}
        zoom={5}
        style={{ height: "400px", borderRadius: "12px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationPicker onSelect={fetchByCoords} />

        {/* 🔥 MARKER */}
        {position && (
          <Marker position={position} icon={customIcon}>
            <Popup>Selected Location</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* WEATHER CARD */}
      {weather && (
        <div className="map-weather slide-up">
          <h3>{weather.name}</h3>
          <p>{weather.weather[0].main}</p>
          <h2>{Math.round(weather.main.temp)}°C</h2>
        </div>
      )}

      {/* FORECAST */}
      {forecast.length > 0 && (
        <div className="forecast slide-up">
          <h3>Forecast</h3>

          <div className="forecast-grid">
            {forecast.slice(0, 5).map((f, i) => (
              <div key={i} className="forecast-card fade">
                <p>{new Date(f.dt_txt).toLocaleDateString()}</p>
                <p>{Math.round(f.main.temp)}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

  return (
    <div className="app">

      <div className="header">
        <h2>🌤 Weather Dashboard</h2>

        <div className="header-right">
          <button
            onClick={() =>
              navigator.geolocation.getCurrentPosition((pos) =>
                fetchByCoords(pos.coords.latitude, pos.coords.longitude)
              )
            }
          >
            📍 My Location
          </button>
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="sidebar">
        <p onClick={() => setActiveTab("weather")}>Weather</p>
        <p onClick={() => setActiveTab("cities")}>Cities</p>
        <p onClick={() => setActiveTab("map")}>Map</p>
      </div>

      {/* LEFT PANEL */}
      <div className="left">
        <form className="search" onSubmit={handleSubmit}>
          <input
            placeholder="Search city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </form>

        <h4>Latest Searches</h4>

        {recent.length === 0 && <p>No searches yet</p>}

        {recent.map((c, i) => (
          <div
            key={i}
            className="city"
            onClick={() => fetchWeather(c.name)}
          >
            {c.name}
            <span>{c.temp}°C</span>
          </div>
        ))}
      </div>

      {/* RIGHT PANEL */}
      <div className="right">

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* WEATHER TAB */}
        {activeTab === "weather" && (
          <Weather weather={weather} forecast={forecast} />
        )}

        {/* MAP TAB */}
        {activeTab === "map" && <MapView />}

        {/* CITIES TAB */}
        {activeTab === "cities" && (
          <div>
            <h3>Recent Cities</h3>
            {recent.map((c, i) => (
              <div key={i} className="city">
                {c.name} — {c.temp}°C
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;