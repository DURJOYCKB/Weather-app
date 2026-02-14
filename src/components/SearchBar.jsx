import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({ searchRef, input, setInput, handleSearch, handleKeyDown, suggestions, showSuggestions, onSelectSuggestion }) {
    return (
        <div className="searchContainer" ref={searchRef}>
            <div className="searchWrap">
                <Search className="searchIcon" size={20} />
                <input
                    type="text"
                    placeholder="Search city..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>

            {showSuggestions && suggestions && suggestions.length > 0 && (
                <ul className="suggestionsList">
                    {suggestions.map((item, index) => (
                        <li key={index} onClick={() => onSelectSuggestion(item)} className="suggestionItem">
                            <span className="suggName">{item.name}</span>
                            <span className="suggCountry">{item.country}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
