import { useEffect, useMemo, useState } from "react";
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

  // 🌙 Dark Mode
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : true;
  });

  // Recent Searches
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem("recentSearches");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
    } else {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  // ============ HELPERS ============
  const addRecentSearch = (city, temp, type) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.city.toLowerCase() !== city.toLowerCase());
      const newItem = { city, temp, type };
      return [newItem, ...filtered].slice(0, 5); // Keep top 5
    });
  };

  // ============ FETCH ============
  const fetchAll = async (cityName) => {
    if (!cityName.trim()) return;

    try {
      setLoading(true);
      setErr("");

      // current
      const res1 = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      if (!res1.ok) throw new Error("City not found!");
      const data1 = await res1.json();

      // forecast (5 days, 3-hour interval)
      const res2 = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      if (!res2.ok) throw new Error("Forecast not available!");
      const data2 = await res2.json();

      setCurrent(data1);

      // Add to recent
      addRecentSearch(data1.name + ", " + data1.sys.country, Math.round(data1.main.temp) + "°", data1.weather[0].main);

      // Map 5-day forecast: Group by date, get 12:00 PM for Day and 09:00 PM for Night
      const dailyMap = new Map();

      data2.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0];
        const time = item.dt_txt.split(" ")[1];

        if (!dailyMap.has(date)) {
          dailyMap.set(date, { day: null, night: null, dt_txt: item.dt_txt }); // Initialize
        }

        const entry = dailyMap.get(date);

        // Prefer 12:00 for day, 21:00 for night
        if (time === "12:00:00") entry.day = item;
        if (time === "21:00:00") entry.night = item;

        // Fallbacks if exact times missing (first item as day, last as night essentially)
        if (!entry.day && time >= "09:00:00" && time <= "15:00:00") entry.day = item;
        if (!entry.night && time >= "18:00:00") entry.night = item;
      });

      // Convert map to array and take 7 days
      const daily = Array.from(dailyMap.values())
        .filter(item => item.day) // Ensure we have at least a day forecast
        .slice(0, 7);

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

  // ============ HELPERS ============
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
            <span></span><span></span><span></span><span></span><span></span>
            <span></span><span></span><span></span><span></span><span></span>
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
            input={input}
            setInput={setInput}
            handleSearch={handleSearch}
            handleKeyDown={handleKeyDown}
          />

          <div className="actions">
            <button
              className="themeBtn"
              onClick={() => setDarkMode(!darkMode)}
              title="Toggle Theme"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {/* Main Grid */}
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
