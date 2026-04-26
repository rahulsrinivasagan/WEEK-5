const Forecast = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="forecast">
        <h3>5-Day Forecast</h3>

        <div className="forecast-grid">
            {forecast.slice(0, 5).map((f, i) => (
            <div key={i} className="forecast-card">
                <p>{new Date(f.dt_txt).toLocaleDateString()}</p>

                <img
                src={`https://openweathermap.org/img/wn/${f.weather[0].icon}.png`}
                alt=""
                />

                <p>{Math.round(f.main.temp)}°C</p>
            </div>
            ))}
        </div>
    </div>
  );
};
export default Forecast;