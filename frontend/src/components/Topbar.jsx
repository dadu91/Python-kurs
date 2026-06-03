import { Search, User, Award } from "lucide-react";
import "./Topbar.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function getUsername() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub || null;
  } catch {
    return null;
  }
}

function Topbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const username = getUsername();

  const handleOdjava = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="topbar">
      <div className="brand">
        <span className="brand-accent">Python</span>Kurs
      </div>

      <div className="topbar-right">
        <div className="search-box">
          <input type="text" placeholder="Pretraži" />
          <button><Search size={18} /></button>
        </div>

        <div
          className="topbar-badge"
          onClick={() => navigate("/napredak")}
          title="Moja dostignuća"
        >
          <Award size={22} />
          <span className="badge-count">2</span>
        </div>

        <div className="user-box" style={{ position: "relative" }}>
          <div className="avatar" onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
            <User />
          </div>
          <div>
            <p className="user-name">{username || "Gost"}</p>
            <span className="user-handle">@{username || "gost"}</span>
          </div>

          {open && (
            <div className="dropdown">
              <button onClick={() => navigate("/profile")}>Profil</button>
              <button onClick={() => navigate("/napredak")}>Moj napredak</button>
              <hr />
              <button onClick={handleOdjava}>Odjava</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Topbar;
