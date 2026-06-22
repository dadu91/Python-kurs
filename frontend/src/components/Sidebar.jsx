import { Home, BookOpen, Trophy, User, Settings, AlertCircle, LogOut } from "lucide-react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

function Sidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const menu = [
    { id: "lessons", icon: <Home size={18} />, label: "Dashboard", path: "/" },
    { id: "progress", icon: <Trophy size={18} />, label: "Statistika", path: "/napredak" },
    { id: "current", icon: <BookOpen size={18} />, label: "Trenutna", path: "/?tab=current" },
    { id: "errors", icon: <AlertCircle size={18} />, label: "Greške", path: "/?tab=errors" },
    { id: "profile", icon: <User size={18} />, label: "Profil", path: "/profile" },
    { id: "settings", icon: <Settings size={18} />, label: "Podešavanja", path: "/settings" },
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
              navigate(item.path);
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