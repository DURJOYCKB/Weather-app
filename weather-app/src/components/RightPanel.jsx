import React from "react";
import { Search, Info } from "lucide-react";

export default function RightPanel({ recentSearches, onSearchSelect }) {
    const list = recentSearches;

    return (
        <aside className="right glass">
            <div className="rightHeader">
                <h3>Recent Search</h3>
            </div>

            <div className="recentGrid">
                {list.map((item, index) => (
                    <div key={index} className="recentCard" onClick={() => onSearchSelect && onSearchSelect(item.city)}>
                        <div className="recentInfo">
                            <span className="recentCity">{item.city}</span>
                            <span className="recentType">{item.type}</span>
                        </div>
                        <span className="recentTemp">{item.temp}</span>
                    </div>
                ))}
            </div>
        </aside>
    );
}
