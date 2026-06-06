import "./Profile.css";
import Sidebar from "../components/Sidebar";
import AdminSidebar from "../components/AdminSidebar";
import Topbar from "../components/Topbar";
import { useState, useEffect } from "react";
import { User, Camera, X, Users, BookOpen, ShieldCheck } from "lucide-react";

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
  const [uloga, setUloga] = useState("");

  const [avatar, setAvatar] = useState(
    localStorage.getItem("profileImage") || null
  );

  const [profile, setProfile] = useState({ name: "", username: "", email: "" });
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });

  const [stats, setStats] = useState({ bodovi: 0, zavrseneLekcije: 0, nivo: 1 });
  const [adminStats, setAdminStats] = useState({ korisnici: 0, lekcije: 0, zadaci: 0 });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = getUsername();
    if (!username) return;

    fetch(`http://localhost:8000/korisnik/pretraga/username?username=${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((korisnik) => {
        const p = { name: korisnik.username, username: `@${korisnik.username}`, email: korisnik.mail };
        setProfile(p);
        setForm({ ...p, password: "" });
        setUloga(korisnik.uloga || "");

        if (korisnik.uloga === "admin") {
          // Dohvati admin statistiku
          fetch("http://localhost:8000/admin/korisnici", { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => res.ok ? res.json() : [])
            .then((data) => setAdminStats((prev) => ({ ...prev, korisnici: Array.isArray(data) ? data.length : 0 })))
            .catch(() => {});

          fetch("http://localhost:8000/lekcije/", { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => res.ok ? res.json() : [])
            .then((data) => setAdminStats((prev) => ({ ...prev, lekcije: Array.isArray(data) ? data.length : 0 })))
            .catch(() => {});
        } else {
          fetch(`http://localhost:8000/progres/po-korisniku/${korisnik.id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => (res.ok ? res.json() : null))
            .then((progres) => { if (progres) setStats((prev) => ({ ...prev, bodovi: progres.bodovi, nivo: progres.nivo })); })
            .catch(() => {});

          fetch(`http://localhost:8000/zavrsena_lekcija/po-korisnik-id/${korisnik.id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => { if (data) setStats((prev) => ({ ...prev, zavrseneLekcije: Array.isArray(data) ? data.length : 1 })); })
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const username = getUsername();
    const res = await fetch(`http://localhost:8000/korisnik/pretraga/username?username=${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const korisnik = await res.json();
    const body = { username: form.name, mail: form.email };
    if (form.password) body.password = form.password;

    await fetch(`http://localhost:8000/korisnik/${korisnik.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });

    setProfile({ name: form.name, username: `@${form.name}`, email: form.email });
    setEditing(false);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        localStorage.setItem("profileImage", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setAvatar(null);
    localStorage.removeItem("profileImage");
  };

  return (
    <div className="page-bg">
      <div className="dashboard-shell">
        {uloga === "admin" ? (
          <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        ) : (
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        )}

        <main className="dashboard-main">
          <Topbar />
          <h1 className="page-title">Profil</h1>

          <div className="profile-card">
            <div className="profile-left">
              <div className="profile-avatar">
                {avatar ? <img src={avatar} alt="avatar" /> : <User size={48} />}
                {editing && (
                  <>
                    <label className="avatar-upload">
                      <Camera size={18} />
                      <input type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
                    </label>
                    {avatar && (
                      <button className="avatar-remove" onClick={handleRemoveImage} title="Ukloni sliku">
                        <X size={14} />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {editing ? (
              <div className="profile-form">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ime" />
                <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Korisničko ime" />
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Nova lozinka (ostavi prazno ako ne mijenjаš)" />
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
                <button className="edit-btn" onClick={() => setEditing(true)}>Izmijeni profil</button>
              </div>
            )}
          </div>

          {/* ADMIN STATS */}
          {uloga === "admin" && (
            <div style={{ marginTop: "24px" }}>
              <h2 className="section-title">Pregled sistema</h2>
              <div className="stats-grid">
                <div className="stat-card blue big">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Users size={28} />
                    <span className="stat-top">Ukupno korisnika</span>
                  </div>
                  <h2>{adminStats.korisnici}</h2>
                </div>
                <div className="stat-card orange">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <BookOpen size={22} />
                    <p>Ukupno lekcija</p>
                  </div>
                  <h2>{adminStats.lekcije}</h2>
                </div>
                <div className="stat-card purple">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <ShieldCheck size={22} />
                    <p>Uloga</p>
                  </div>
                  <h2 style={{ fontSize: "28px" }}>Admin</h2>
                </div>
              </div>
            </div>
          )}

          {/* KORISNIK STATS */}
          {uloga !== "admin" && (
            <>
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
                <div className="empty-card" style={{ color: "#9ca3af", fontSize: "14px" }}>
                  Još nema dostignuća. Nastavite učiti!
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Profile;
