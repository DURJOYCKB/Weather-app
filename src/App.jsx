import { useEffect, useMemo, useState, useRef } from "react";
import { Sun, Moon, Download } from "lucide-react";
import "./App.css";

// Components
import Sidebar from "./components/Sidebar";
import MainWeather from "./components/MainWeather";
import RightPanel from "./components/RightPanel";
import SearchBar from "./components/SearchBar";
import Stars from "./components/Stars";

const API_KEY = "44bf8383c27e83ae73bf34477a3453be";

export default function App() {
  const [input, setInput] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem("recentSearches");
    return saved ? JSON.parse(saved) : [];
  });

 
  useEffect(() => {
    document.body.classList.add("dark-theme");
    document.body.classList.remove("light-theme");
  }, []);

  useEffect(() => {
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  const addRecentSearch = (city, temp, type) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.city.toLowerCase() !== city.toLowerCase());
      const newItem = { city, temp, type };
      return [newItem, ...filtered].slice(0, 5); 
    });
  };

 
  const fetchAll = async (cityName) => {
    if (!cityName.trim()) return;

    try {
      setLoading(true);
      setErr("");

     
      const res1 = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      if (!res1.ok) throw new Error("City not found!");
      const data1 = await res1.json();

      const { lat, lon } = data1.coord;

      
      const res2 = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      if (!res2.ok) throw new Error("Forecast not available!");
      const data2 = await res2.json();

      setCurrent(data1);

      
      addRecentSearch(data1.name + ", " + data1.sys.country, Math.round(data1.main.temp) + "°", data1.weather[0].main);

      
      const mapCondition = (code) => {
        if (code === 0) return "Clear";
        if (code >= 1 && code <= 3) return "Clouds";
        if (code >= 45 && code <= 48) return "Fog";
        if (code >= 51 && code <= 67) return "Rain";
        if (code >= 71 && code <= 77) return "Snow";
        if (code >= 80 && code <= 82) return "Rain";
        if (code >= 95 && code <= 99) return "Thunderstorm";
        return "Clouds";
      };

      const daily = data2.daily.time.map((date, i) => ({
        day: {
          main: { temp: data2.daily.temperature_2m_max[i] },
          weather: [{ main: mapCondition(data2.daily.weathercode[i]) }],
          dt_txt: date
        },
        night: {
          main: { temp: data2.daily.temperature_2m_min[i] }
        }
      }));

      setForecast(daily);
    } catch (e) {
      setCurrent(null);
      setForecast([]);
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll(city);
  }, []);

 
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (input.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${API_KEY}`
        );
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 200);

    return () => clearTimeout(timer);
  }, [input]);

  const handleSuggestionClick = (suggestion) => {
    const cityName = `${suggestion.name}, ${suggestion.country}`;
    setCity(cityName); 
    fetchAll(suggestion.name);  
    
    setInput(""); 
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    if (input.trim()) {
      setCity(input);
      fetchAll(input);
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const weatherMain = current?.weather?.[0]?.main || "";

  const isNight = useMemo(() => {
    if (!current) return false;
    const now = current.dt;
    const { sunrise, sunset } = current.sys;
    return now < sunrise || now > sunset;
  }, [current]);

  const bgClass = useMemo(() => {
    if (!current) return "bg-default";

    if (isNight) return "bg-night";

    const m = weatherMain.toLowerCase();

    if (m.includes("clear")) return "bg-clear";
    if (m.includes("cloud")) return "bg-clouds";
    if (m.includes("rain") || m.includes("drizzle")) return "bg-rain";
    if (m.includes("thunder")) return "bg-thunder";
    if (m.includes("snow")) return "bg-snow";
    if (m.includes("mist") || m.includes("fog") || m.includes("haze"))
      return "bg-fog";

    return "bg-default";
  }, [weatherMain, current, isNight]);

  const formatDay = (dateText) => {
    const d = new Date(dateText);
    return d.toLocaleDateString(undefined, { weekday: "long" });
  };

  const formatDate = () => {
    const d = new Date();
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const emoji = (main) => {
    if (!main) return "🌍";
    if (main === "Clouds") return "☁️";
    if (main === "Clear") return "☀️";
    if (main === "Rain") return "🌧️";
    if (main === "Thunderstorm") return "⛈️";
    if (main === "Snow") return "❄️";
    if (main === "Haze" || main === "Mist" || main === "Fog") return "🌫️";
    return "🌤️";
  };

  return (
    <div className={`app ${bgClass}`}>
      <div className="overlay"></div>

      {bgClass === "bg-night" && (
        <>
          <div className="shooting-stars">
            <span></span><span></span><span></span>
          </div>
          <Stars />
        </>
      )}

      <div className="container">
        {/* Navbar */}
        <header className="topbar glass">
          <div className="brand">
            <div className="brandDot"></div>
            <h2>WeatherWise</h2>
          </div>

          <SearchBar
            searchRef={searchRef}
            input={input}
            setInput={setInput}
            handleSearch={handleSearch}
            handleKeyDown={handleKeyDown}
            suggestions={suggestions}
            showSuggestions={showSuggestions}
            onSelectSuggestion={handleSuggestionClick}
          />

          <div className="actions">
           
          </div>
        </header>

    
        <div className="mainGrid">
          <Sidebar weather={current} />

          <MainWeather
            weather={current}
            forecast={forecast}
            loading={loading}
            error={err}
            formatDate={formatDate}
            formatDay={formatDay}
            emoji={emoji}
          />

          <RightPanel
            recentSearches={recentSearches}
            onSearchSelect={(city) => {
              setCity(city);
              fetchAll(city);
            }}
          />
        </div>
      </div>
    </div>
  );
}
