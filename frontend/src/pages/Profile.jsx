import "./Profile.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { Camera } from "lucide-react";

const badges = [
  { icon: "🏆", label: "Prva lekcija", earned: true },
  { icon: "🔥", label: "7 dana zaredom", earned: true },
  { icon: "⚡", label: "Brzinsko rješavanje", earned: false },
  { icon: "🎯", label: "Perfektan rezultat", earned: false },
  { icon: "🐍", label: "Python majstor", earned: false },
];

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

function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [profile, setProfile] = useState({ name: "", username: "", email: "" });
  const [form, setForm] = useState({ ...profile });
  const [stats, setStats] = useState({ bodovi: 0, zavrseneLekcije: 0, nivo: 1 });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = getUsername();

    if (!username) return;

    fetch(`http://localhost:8000/korisnik/pretraga/username?username=${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((korisnik) => {
        const p = {
          name: korisnik.username,
          username: `@${korisnik.username}`,
          email: korisnik.mail,
        };
        setProfile(p);
        setForm(p);

        // Dohvati progres
        fetch(`http://localhost:8000/progres/po-korisniku/${korisnik.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.ok ? res.json() : null)
          .then((progres) => {
            if (progres) setStats((prev) => ({ ...prev, bodovi: progres.bodovi, nivo: progres.nivo }));
          })
          .catch(() => {});

        // Dohvati broj završenih lekcija
        fetch(`http://localhost:8000/zavrsena_lekcija/po-korisnik-id/${korisnik.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.ok ? res.json() : null)
          .then((data) => {
            if (data) setStats((prev) => ({ ...prev, zavrseneLekcije: Array.isArray(data) ? data.length : 1 }));
          })
          .catch(() => {});
      })
      .catch(() => {});
  }, []);

  const handleSave = () => {
    setProfile(form);
    setEditing(false);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  const earnedBadges = badges.filter((b) => b.earned);

  return (
    <div className="page-bg">
      <div className="dashboard-shell">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="dashboard-main">
          <Topbar />

          <h1 className="page-title">Profil</h1>

          <div className="profile-card">
            <div className="profile-left">
              <div className="profile-avatar">
                {avatar ? (
                  <img src={avatar} alt="avatar" />
                ) : (
                  <User size={48} />
                )}
                {editing && (
                  <label className="avatar-upload">
                    <Camera size={18} />
                    <input type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
                  </label>
                )}
              </div>
              <div className="avatar-badges">
                {earnedBadges.map((b, i) => (
                  <span key={i} title={b.label}>{b.icon}</span>
                ))}
              </div>
            </div>

            {editing ? (
              <div className="profile-form">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ime"
                />
                <input
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Korisničko ime"
                />
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Email"
                />
                <div className="profile-btns">
                  <button className="save-btn" onClick={handleSave}>Sačuvaj</button>
                  <button className="cancel-btn" onClick={() => setEditing(false)}>Otkaži</button>
                </div>
              </div>
            ) : (
              <div className="profile-info">
                <h2>{profile.name || "—"}</h2>
                <p>{profile.username || "—"}</p>
                <p>{profile.email || "—"}</p>
                <button className="edit-btn" onClick={() => setEditing(true)}>
                  Izmijeni profil
                </button>
              </div>
            )}
          </div>

          <div className="stats-grid" style={{ marginTop: "24px" }}>
            <div className="stat-card blue">
              <span className="stat-top">Ukupni bodovi</span>
              <h2>{stats.bodovi}</h2>
            </div>
            <div className="stat-card orange">
              <p>Završene lekcije</p>
              <h2>{stats.zavrseneLekcije}</h2>
            </div>
            <div className="stat-card purple">
              <p>Nivo</p>
              <h2>{stats.nivo}</h2>
            </div>
          </div>

          <div className="progress-section" style={{ marginTop: "24px" }}>
            <h2 className="section-title">Dostignuća</h2>
            <div className="badges-grid">
              {badges.map((b, i) => (
                <div className={`badge-card ${b.earned ? "earned" : "locked"}`} key={i}>
                  <span className="badge-icon">{b.icon}</span>
                  <span className="badge-label">{b.label}</span>
                  {!b.earned && <span className="badge-lock">🔒</span>}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Profile;
