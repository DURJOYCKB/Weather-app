import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({ input, setInput, handleSearch, handleKeyDown }) {
    return (
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
    );
}
