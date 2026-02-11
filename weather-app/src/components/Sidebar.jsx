import React from "react";
import { Wind, Droplets, Gauge, Eye, MapPin } from "lucide-react";

export default function Sidebar({ weather }) {
  // Helpers for sidebar status
  // We can calculate "Air Quality" loosely or just mock it for now since API doesn't give it in standard call
  // For the "Dangerous" button, we can just make it visual.

  return (
    <aside className="sidebar glass">
      <div className="sideTitle">Today's Highlights</div>

      <div className="statusGrid">
        {/* Wind Status */}
        <div className="statusCard">
          <div className="statusTop">
            <span className="statusLabel">Wind Status</span>
            <Wind size={18} className="statusIcon" />
          </div>
          <div className="statusValue">{weather?.wind?.speed || 0} <span className="unit">m/s</span></div>
          <div className="statusDesc">Direction: {weather?.wind?.deg}°</div>
        </div>

        {/* Humidity */}
        <div className="statusCard">
           <div className="statusTop">
            <span className="statusLabel">Humidity</span>
            <Droplets size={18} className="statusIcon" />
          </div>
          <div className="statusValue">{weather?.main?.humidity || 0} <span className="unit">%</span></div>
          <div className="statusDesc">Dew point: {Math.round((weather?.main?.temp || 0) - ((100 - (weather?.main?.humidity || 0)) / 5))}°</div>
        </div>

         {/* Visibility */}
         <div className="statusCard">
           <div className="statusTop">
            <span className="statusLabel">Visibility</span>
            <Eye size={18} className="statusIcon" />
          </div>
          <div className="statusValue">{(weather?.visibility / 1000).toFixed(1) || 0} <span className="unit">km</span></div>
          <div className="statusDesc">{weather?.visibility > 5000 ? "Good visibility" : "Poor visibility"}</div>
        </div>

        {/* Pressure */}
        <div className="statusCard">
           <div className="statusTop">
            <span className="statusLabel">Pressure</span>
            <Gauge size={18} className="statusIcon" />
          </div>
          <div className="statusValue">{weather?.main?.pressure || 0} <span className="unit">hPa</span></div>
          <div className="statusDesc">Atmospheric</div>
        </div>
      </div>

      <div className="sideTitle mt-large">Location</div>
      <div className="miniMap">
        <div className="mapVisual">
           <MapPin size={32} className="mapPinIcon" />
        </div>
        <p className="miniCity">
          {weather ? `${weather.name}, ${weather.sys.country}` : "Select a city"}
        </p>
      </div>
    </aside>
  );
}
