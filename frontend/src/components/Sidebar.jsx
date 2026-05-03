import { useState } from "react";
import { Home, BookOpen, Trophy, User, Settings, AlertCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Sidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const menu = [
    { id: "lessons", icon: <Home size={20} />, label: "Dashboard" },
    { id: "points", icon: <Trophy size={20} />, label: "Statistika" },
    { id: "current", icon: <BookOpen size={20} />, label: "Trenutna" },
    { id: "errors", icon: <AlertCircle size={20} />, label: "Greške" },
    { id: "profile", icon: <User size={20} />, label: "Profil" },
    { id: "settings", icon: <Settings size={20} />, label: "Podešavanja" },
  ];

  return (
    <div
      className={`sidebar ${isExpanded ? "expanded" : ""}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="sidebar-nav">
        {menu.map((item) => (
          <button
            key={item.id}
            className={`side-icon ${activeTab === item.id ? "active" : ""}`}
            onClick={() => {
              setActiveTab(item.id);
              navigate(item.id === "profile" ? "/profile" : `/?tab=${item.id}`);
            }}
          >
            <div className="icon-wrap">
              {item.icon}
            </div>
            <span className="label">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="logout">
        <button className="side-icon" onClick={() => navigate("/login")}>
          <div className="icon-wrap">
            <LogOut size={20} />
          </div>
          <span className="label">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;