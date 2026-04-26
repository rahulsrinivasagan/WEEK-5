import React from "react";

function Weather({ weather, forecast }) {
  if (!weather) {
    return <p className="empty">Search a city</p>;
  }

  return (
    <div className="hero">

      {/* LEFT INFO */}
      <div className="hero-left">
        <p className="city">📍 {weather.name}</p>

        <h1 className="time">
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </h1>

        <p className="condition">{weather.weather[0].main}</p>
      </div>

      {/* RIGHT SIDE */}
      <div className="hero-right">
        <h1 className="temp">{Math.round(weather.main.temp)}°C</h1>

        <p>Pressure: {weather.main.pressure} hPa</p>
        <p>Humidity: {weather.main.humidity}%</p>
        <p>Wind: {weather.wind.speed} m/s</p>
      </div>

      {/* FORECAST STRIP */}
      {forecast && forecast.length > 0 && (
        <div className="forecast-strip">
          {forecast.slice(0, 7).map((f, i) => (
            <div key={i} className="forecast-box">

              <p>
                {new Date(f.dt_txt).toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </p>

              <img
                src={`https://openweathermap.org/img/wn/${f.weather[0].icon}.png`}
                alt=""
              />

              <p>{Math.round(f.main.temp)}°</p>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Weather;