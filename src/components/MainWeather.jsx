import React from "react";
import { CalendarDays } from "lucide-react";
import WeatherIcon3D from "./WeatherIcon3D";

export default function MainWeather({ weather, forecast, loading, error, formatDate, formatDay, emoji }) {
    if (loading) return <div className="main glass loading"><div className="spinner"></div><p>Loading weather data...</p></div>;
    if (error) return <div className="main glass error"><p className="errorText">{error}</p></div>;
    if (!weather) return <div className="main glass empty"><p>Search for a city to see the weather.</p></div>;

    const weatherMain = weather.weather[0].main;
    const description = weather.weather[0].description;

    // Check if it is currently night
    const now = weather.dt;
    const { sunrise, sunset } = weather.sys;
    const isNight = now < sunrise || now > sunset;

    return (
        <section className="main glass">
            {/* Header / Date */}
            <div className="locationRow">
                <p className="dateText">{formatDate()}</p>
                <p className="locationText">
                    {weather.name}, {weather.sys.country}
                </p>
            </div>

            {/* Hero Section */}
            <div className="hero">
                <div className="heroLeft">
                    <h1 className="bigTemp">{Math.round(weather.main.temp)}°</h1>
                </div>

                <div className="heroCenter">
                    <WeatherIcon3D condition={weatherMain} isNight={isNight} />
                    <span className="conditionText">{weatherMain}</span>
                </div>

                <div className="heroRight">
                    <p className="description">{description}</p>
                    <div className="hiLowTag">
                        <span>H: {Math.round(weather.main.temp_max)}°</span>
                        <span>L: {Math.round(weather.main.temp_min)}°</span>
                    </div>
                </div>
            </div>

            {/* Forecast */}
            <div className="forecastSection">
                <div className="sectionHeader">
                    <CalendarDays size={18} />
                    <h3>7-Day Forecast</h3>
                </div>

                <div className="forecastGrid">
                    {forecast.map((item, i) => {
                        const d = item.day || item.night; // fallback
                        if (!d) return null;

                        return (
                            <div key={i} className="dayCard">
                                <p className="dayName">{formatDay(d.dt_txt)}</p>
                                <div className="dayIcon">{emoji(d.weather[0].main)}</div>
                                <p className="dayTemp">
                                    <span title="Day">{Math.round(item.day ? item.day.main.temp : d.main.temp)}°</span>
                                    {item.night && <span className="nightTemp" title="Night"> / {Math.round(item.night.main.temp)}°</span>}
                                </p>
                                <p className="dayDesc">{d.weather[0].main}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
