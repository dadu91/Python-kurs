import { Home, BookOpen, Trophy, User, Settings, AlertCircle, LogOut } from "lucide-react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

function Sidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const menu = [
    { id: "lessons", icon: <Home size={18} />, label: "Dashboard" },
    { id: "points", icon: <Trophy size={18} />, label: "Statistika" },
    { id: "current", icon: <BookOpen size={18} />, label: "Trenutna" },
    { id: "errors", icon: <AlertCircle size={18} />, label: "Greške" },
    { id: "profile", icon: <User size={18} />, label: "Profil" },
    { id: "settings", icon: <Settings size={18} />, label: "Podešavanja" },
  ];

  return (
    <div className="sidebar">
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