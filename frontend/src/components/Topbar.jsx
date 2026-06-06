import { Search, User, ShieldCheck, LayoutDashboard } from "lucide-react";
import "./Topbar.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
  const [query, setQuery] = useState("");
  const [rezultati, setRezultati] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const username = getUsername();
  const avatar = localStorage.getItem("profileImage");
  const uloga = localStorage.getItem("uloga");
  const token = localStorage.getItem("token");
  const searchRef = useRef(null);

  const isAdmin = uloga === "admin";
  const isOnAdmin = location.pathname.startsWith("/admin");

  const handleOdjava = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("uloga");
    navigate("/login");
  };

  useEffect(() => {
    if (query.length < 2) {
      setRezultati([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        if (isAdmin) {
          // Admin pretražuje korisnike i lekcije
          const [lekcijeRes, korisnikRes] = await Promise.all([
            fetch("http://localhost:8000/lekcije/", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`http://localhost:8000/korisnik/pretraga/username?username=${query}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          const lekcije = await lekcijeRes.json();
          const filtrirane = Array.isArray(lekcije)
            ? lekcije.filter((l) => l.naziv.toLowerCase().includes(query.toLowerCase()))
            : [];

          const korisnici = [];
          if (korisnikRes.ok) {
            const k = await korisnikRes.json();
            if (k.id) korisnici.push({ ...k, tip: "korisnik" });
          }

          setRezultati([
            ...filtrirane.map((l) => ({ ...l, tip: "lekcija" })),
            ...korisnici,
          ]);
        } else {
          // Korisnik pretražuje lekcije
          const res = await fetch("http://localhost:8000/lekcije/", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const lekcije = await res.json();
          const filtrirane = Array.isArray(lekcije)
            ? lekcije.filter((l) => l.naziv.toLowerCase().includes(query.toLowerCase()))
            : [];
          setRezultati(filtrirane.map((l) => ({ ...l, tip: "lekcija" })));
        }
        setShowResults(true);
      } catch {
        setRezultati([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Zatvori rezultate kad klikneš van
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (item) => {
    setQuery("");
    setShowResults(false);
    if (item.tip === "lekcija") navigate(`/lekcije/${item.id}`);
    else if (item.tip === "korisnik") navigate("/admin?tab=users");
  };

  return (
    <div className="topbar">
      <div className="brand">
        <span className="brand-accent">Python</span>Kurs
      </div>

      <div className="topbar-right">
        <div className="search-box" ref={searchRef} style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Pretraži"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => rezultati.length > 0 && setShowResults(true)}
          />
          <button><Search size={18} /></button>

          {showResults && rezultati.length > 0 && (
            <div className="search-results">
              {rezultati.map((item, i) => (
                <button key={i} onClick={() => handleSelect(item)}>
                  {item.naziv || item.username}
                </button>
              ))}
            </div>
          )}

          {showResults && rezultati.length === 0 && query.length >= 2 && (
            <div className="search-results">
              <p style={{ padding: "10px 14px", color: "#888", fontSize: "14px" }}>Nema rezultata</p>
            </div>
          )}
        </div>

        {isAdmin && (
          <button
            className="switch-btn"
            onClick={() => navigate(isOnAdmin ? "/" : "/admin")}
            title={isOnAdmin ? "Idi na Dashboard" : "Idi na Admin Panel"}
          >
            {isOnAdmin ? (
              <><LayoutDashboard size={16} /> Dashboard</>
            ) : (
              <><ShieldCheck size={16} /> Admin</>
            )}
          </button>
        )}

        <div className="user-box" style={{ position: "relative" }}>
          <div className="avatar" onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
            {avatar ? (
              <img src={avatar} alt="avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              <User />
            )}
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