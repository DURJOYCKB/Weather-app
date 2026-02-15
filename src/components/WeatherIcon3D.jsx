import React from 'react';

const WeatherIcon3D = ({ condition, isNight }) => {
    let iconClass = '';

    switch (condition) {
        case 'Clear':
        case 'Sunny':
            iconClass = isNight ? 'moon-3d' : 'sun-3d';
            break;
        case 'Clouds':
        case 'Mist':
        case 'Smoke':
        case 'Haze':
        case 'Dust':
        case 'Fog':
            iconClass = 'cloud-3d';
            break;
        case 'Rain':
        case 'Drizzle':
            iconClass = 'rain-3d';
            break;
        case 'Thunderstorm':
            iconClass = 'storm-3d';
            break;
        case 'Snow':
            iconClass = 'snow-3d';
            break;
        default:
            iconClass = 'cloud-3d'; 
    }

    return (
        <div className={`weather-icon-3d ${iconClass}`}>
            
            {(iconClass === 'rain-3d' || iconClass === 'storm-3d') && (
                <div className="rain-drops">
                    <span></span><span></span><span></span>
                </div>
            )}
            {iconClass === 'storm-3d' && (
                <div className="lightning">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#FFD700" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            )}
            {iconClass === 'snow-3d' && (
                <div className="snow-flakes">
                    <span></span><span></span><span></span>
                </div>
            )}
            {iconClass === 'moon-3d' && (
                <div className="moon-3d-star"></div>
            )}
            {(iconClass === 'cloud-3d' || iconClass === 'rain-3d' || iconClass === 'storm-3d' || iconClass === 'snow-3d') && (
                <div className="cloud-body"></div>
            )}
        </div>
    );
};

export default WeatherIcon3D;
