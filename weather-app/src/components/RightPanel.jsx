import React from "react";
import { Search, Info } from "lucide-react";

export default function RightPanel({ recentSearches, onSearchSelect }) {
    // If no recent searches, we can show a message or nothing.
    // Ideally we might want to keep the mocks for initial demo if list is empty, 
    // BUT the user asked for "dynamic not fixed". So let's show the dynamic list.
    // If empty, show nothing or a "No recent searches" message.

    // However, to keep the UI looking good on first load if empty, maybe we keep the mock?
    // User instruction: "make the recent search section dynamic not fixed".
    // I will prioritize the dynamic list. If it's empty, it will be empty.

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
