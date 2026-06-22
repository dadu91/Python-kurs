import "./Profile.css";
import Sidebar from "../components/Sidebar";
import AdminSidebar from "../components/AdminSidebar";
import Topbar from "../components/Topbar";
import { useState, useEffect } from "react";
import { User, Camera, X, Users, BookOpen, ShieldCheck, Star, Zap, Lock, PenLine } from "lucide-react";

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

function computeAchievements(stats) {
  const ukupnoZadataka = stats.tacni + stats.netacni;
  const tacnostPct = ukupnoZadataka > 0 ? Math.round((stats.tacni / ukupnoZadataka) * 100) : 0;
  return [
    { icon: "🏆", label: "Prva lekcija",    desc: "Završi prvu lekciju",         earned: stats.zavrseneLekcije >= 1 },
    { icon: "📚", label: "Marljivi učenik", desc: "Završi 3 lekcije",             earned: stats.zavrseneLekcije >= 3 },
    { icon: "⭐", label: "100 bodova",      desc: "Skupi 100 bodova",             earned: stats.bodovi >= 100 },
    { icon: "⚡", label: "Nivo 3",          desc: "Dostigni nivo 3",              earned: stats.nivo >= 3 },
    { icon: "🎯", label: "Oštar um",        desc: "90%+ tačnost na zadacima",     earned: tacnostPct >= 90 && ukupnoZadataka > 0 },
    { icon: "🐍", label: "Python majstor",  desc: "Dostigni nivo 5",              earned: stats.nivo >= 5 },
  ];
}

function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [uloga, setUloga] = useState("");

  const [avatar, setAvatar] = useState(localStorage.getItem("profileImage") || null);
  const [profile, setProfile] = useState({ name: "", username: "", email: "" });
  const [form, setForm]       = useState({ name: "", username: "", email: "", password: "" });
  const [stats, setStats]     = useState({ bodovi: 0, zavrseneLekcije: 0, nivo: 1, tacni: 0, netacni: 0 });
  const [adminStats, setAdminStats] = useState({ korisnici: 0, lekcije: 0 });
  const [loading, setLoading] = useState(true);

  const bodoviZaSljedeciNivo = stats.nivo * 100;
  const progresNivo   = Math.min(Math.round((stats.bodovi % 100) / bodoviZaSljedeciNivo * 100), 100);
  const achievements  = computeAchievements(stats);
  const earnedCount   = achievements.filter((a) => a.earned).length;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = getUsername();
    if (!username) { setLoading(false); return; }

    fetch(`http://localhost:8000/korisnik/pretraga/username?username=${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((k) => {
        const p = { name: k.username, username: `@${k.username}`, email: k.mail };
        setProfile(p);
        setForm({ ...p, password: "" });
        setUloga(k.uloga || "");

        if (k.uloga === "admin") {
          fetch("http://localhost:8000/admin/korisnici", { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.ok ? r.json() : [])
            .then((d) => setAdminStats((prev) => ({ ...prev, korisnici: Array.isArray(d) ? d.length : 0 })))
            .catch(() => {});
          fetch("http://localhost:8000/lekcije/", { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.ok ? r.json() : [])
            .then((d) => setAdminStats((prev) => ({ ...prev, lekcije: Array.isArray(d) ? d.length : 0 })))
            .catch(() => {});
        } else {
          fetch(`http://localhost:8000/progres/po-korisniku/${k.id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.ok ? r.json() : null)
            .then((p) => { if (p) setStats((prev) => ({ ...prev, bodovi: p.bodovi, nivo: p.nivo })); })
            .catch(() => {});
          fetch(`http://localhost:8000/zavrsena_lekcija/po-korisnik-id/${k.id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.ok ? r.json() : null)
            .then((d) => { if (d) setStats((prev) => ({ ...prev, zavrseneLekcije: Array.isArray(d) ? d.length : 0 })); })
            .catch(() => {});
          fetch(`http://localhost:8000/zadatak_korisnik/tacni/po-korisnik/${k.id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.ok ? r.json() : [])
            .then((d) => setStats((prev) => ({ ...prev, tacni: Array.isArray(d) ? d.length : 0 })))
            .catch(() => {});
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const username = getUsername();
    const res = await fetch(`http://localhost:8000/korisnik/pretraga/username?username=${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const k = await res.json();
    const body = { username: form.name, mail: form.email };
    if (form.password) body.password = form.password;
    await fetch(`http://localhost:8000/korisnik/${k.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    setProfile({ name: form.name, username: `@${form.name}`, email: form.email });
    setEditing(false);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => { setAvatar(reader.result); localStorage.setItem("profileImage", reader.result); };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="page-bg"><div className="dashboard-shell">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="dashboard-main"><Topbar /><div className="profile-loading">Učitavanje...</div></main>
      </div></div>
    );
  }

  return (
    <div className="page-bg">
      <div className="dashboard-shell">
        {uloga === "admin"
          ? <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          : <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        }

        <main className="dashboard-main">
          <Topbar />
          <h1 className="page-title">Profil</h1>

          {/* ── PROFIL KARTICA ── */}
          <div className="profile-card-new">
            {/* Banner */}
            <div className="profile-banner">
              <span className="banner-label">Python kurs</span>
              {!editing && (
                <button className="banner-edit-btn" onClick={() => setEditing(true)}>
                  <PenLine size={14} /> Izmijeni
                </button>
              )}
            </div>

            {/* Avatar + info */}
            <div className="profile-body">
              <div className="profile-avatar-wrap">
                <div className="profile-avatar">
                  {avatar ? <img src={avatar} alt="avatar" /> : <User size={40} />}
                  {editing && (
                    <>
                      <label className="avatar-upload">
                        <Camera size={14} />
                        <input type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
                      </label>
                      {avatar && (
                        <button className="avatar-remove" onClick={() => { setAvatar(null); localStorage.removeItem("profileImage"); }}>
                          <X size={11} />
                        </button>
                      )}
                    </>
                  )}
                </div>
                {uloga === "admin"
                  ? <span className="level-pill admin-pill">Admin</span>
                  : <span className="level-pill">Nivo {stats.nivo}</span>
                }
              </div>

              {editing ? (
                <div className="profile-form">
                  <label className="form-label">Korisničko ime</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ime" />
                  <label className="form-label">Email</label>
                  <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
                  <label className="form-label">Nova lozinka</label>
                  <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Ostavi prazno ako ne mijenjаš" />
                  <div className="profile-btns">
                    <button className="save-btn" onClick={handleSave}>Sačuvaj</button>
                    <button className="cancel-btn" onClick={() => setEditing(false)}>Otkaži</button>
                  </div>
                </div>
              ) : (
                <div className="profile-info">
                  <h2>{profile.name || "—"}</h2>
                  <p className="profile-username">{profile.username || "—"}</p>
                  <p className="profile-email">{profile.email || "—"}</p>
                </div>
              )}
            </div>

            {/* Mini stats u kartici */}
            {uloga !== "admin" && !editing && (
              <div className="profile-mini-stats">
                <div className="mini-stat">
                  <Star size={16} className="mini-stat-icon teal" />
                  <div><span className="mini-val">{stats.bodovi}</span><span className="mini-lbl">Bodovi</span></div>
                </div>
                <div className="mini-divider" />
                <div className="mini-stat">
                  <BookOpen size={16} className="mini-stat-icon orange" />
                  <div><span className="mini-val">{stats.zavrseneLekcije}</span><span className="mini-lbl">Lekcije</span></div>
                </div>
                <div className="mini-divider" />
                <div className="mini-stat">
                  <Zap size={16} className="mini-stat-icon purple" />
                  <div><span className="mini-val">{stats.nivo}</span><span className="mini-lbl">Nivo</span></div>
                </div>
              </div>
            )}
          </div>

          {/* ADMIN STATS */}
          {uloga === "admin" && (
            <div style={{ marginTop: "20px" }}>
              <h2 className="section-title">Pregled sistema</h2>
              <div className="stats-grid">
                <div className="stat-card blue">
                  <div className="stat-icon-row"><Users size={22} /><span className="stat-label">Ukupno korisnika</span></div>
                  <h2 className="stat-value">{adminStats.korisnici}</h2>
                </div>
                <div className="stat-card orange">
                  <div className="stat-icon-row"><BookOpen size={22} /><span className="stat-label">Ukupno lekcija</span></div>
                  <h2 className="stat-value">{adminStats.lekcije}</h2>
                </div>
                <div className="stat-card purple">
                  <div className="stat-icon-row"><ShieldCheck size={22} /><span className="stat-label">Uloga</span></div>
                  <h2 className="stat-value" style={{ fontSize: "24px" }}>Administrator</h2>
                </div>
              </div>
            </div>
          )}

          {/* KORISNIK — nivo progres + dostignuća */}
          {uloga !== "admin" && (
            <>
              {/* NIVO TRAKA */}
              <div className="level-progress-card" style={{ marginTop: "18px" }}>
                <div className="level-progress-header">
                  <span className="level-progress-title">Napredak do nivoa {stats.nivo + 1}</span>
                  <span className="level-progress-pts">{stats.bodovi} / {stats.nivo * 100} bodova</span>
                </div>
                <div className="level-track">
                  <div className="level-fill" style={{ width: `${progresNivo}%` }} />
                </div>
              </div>

              {/* DOSTIGNUĆA */}
              <div className="achievements-section" style={{ marginTop: "18px" }}>
                <div className="achievements-header">
                  <h2 className="section-title" style={{ marginBottom: 0 }}>Dostignuća</h2>
                  <span className="achievements-count">{earnedCount} / {achievements.length} osvajeno</span>
                </div>
                <div className="achievements-grid">
                  {achievements.map((a, i) => (
                    <div key={i} className={`achievement-card ${a.earned ? "earned" : "locked"}`}>
                      <div className="achievement-icon">{a.icon}</div>
                      <div className="achievement-info">
                        <span className="achievement-label">{a.label}</span>
                        <span className="achievement-desc">{a.desc}</span>
                      </div>
                      {!a.earned && <div className="achievement-lock"><Lock size={13} /></div>}
                    </div>
                  ))}
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
