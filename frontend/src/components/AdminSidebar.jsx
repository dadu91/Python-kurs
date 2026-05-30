import {
  Home,
  BookOpen,
  Trophy,
  Settings,
  LogOut,
  Users,
  FileText,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function AdminSidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const menu = [
    { id: "dashboard", icon: <Home size={20} />, label: "Dashboard" },
    { id: "lessons", icon: <BookOpen size={20} />, label: "Lekcije" },
    { id: "tasks", icon: <FileText size={20} />, label: "Zadaci" },
    { id: "users", icon: <Users size={20} />, label: "Korisnici" },
    { id: "achievements", icon: <Trophy size={20} />, label: "Dostignuća" },
    { id: "statistics", icon: <BarChart3 size={20} />, label: "Statistika" },
    { id: "settings", icon: <Settings size={20} />, label: "Podešavanja" },
  ];

  const handleClick = (id) => {
    setActiveTab(id);
    navigate(`/admin?tab=${id}`);
  };

  return (
    <div className="sidebar expanded">
      <div className="sidebar-nav">
        {menu.map((item) => (
          <button
            key={item.id}
            className={`side-icon ${activeTab === item.id ? "active" : ""}`}
            onClick={() => handleClick(item.id)}
          >
            <div className="icon-wrap">{item.icon}</div>
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

export default AdminSidebar;