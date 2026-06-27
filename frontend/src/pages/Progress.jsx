import "./Progress.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useState, useEffect } from "react";

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

function Progress() {
  const [activeTab, setActiveTab] = useState("progress");
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({ bodovi: 0, nivo: 1, tacni: 0, netacni: 0 });
  const [lekcije, setLekcije] = useState([]);
  const [zavrseneIds, setZavrseneIds] = useState([]);
  const [activity, setActivity] = useState([]);

  const ukupnoLekcija = lekcije.length;
  const zavrseneLekcije = zavrseneIds.length;
  const pctLekcija = ukupnoLekcija > 0 ? Math.round((zavrseneLekcije / ukupnoLekcija) * 100) : 0;
  const ukupnoZadataka = stats.tacni + stats.netacni;
  const tacnostPct = ukupnoZadataka > 0 ? Math.round((stats.tacni / ukupnoZadataka) * 100) : 0;
  const maxActivity = Math.max(...activity.map((a) => a.value), 1);

  const badges = [
    { icon: "🏆", label: "Prva lekcija", desc: "Završi prvu lekciju", earned: zavrseneLekcije >= 1 },
    { icon: "📚", label: "Marljivi učenik", desc: "Završi 3 lekcije", earned: zavrseneLekcije >= 3 },
    { icon: "🔥", label: "Na pola puta", desc: "Završi 6 lekcija", earned: zavrseneLekcije >= 6 },
    { icon: "⭐", label: "100 bodova", desc: "Skupi 100 bodova", earned: stats.bodovi >= 100 },
    { icon: "💎", label: "500 bodova", desc: "Skupi 500 bodova", earned: stats.bodovi >= 500 },
    { icon: "⚡", label: "Nivo 3", desc: "Dostigni nivo 3", earned: stats.nivo >= 3 },
    { icon: "🐍", label: "Python majstor", desc: "Dostigni nivo 5", earned: stats.nivo >= 5 },
    { icon: "🎯", label: "Oštar um", desc: "90%+ tačnost na zadacima", earned: tacnostPct >= 90 && ukupnoZadataka > 0 },
    { icon: "✅", label: "Vrijedan", desc: "50 tačnih zadataka", earned: stats.tacni >= 50 },
    { icon: "🎓", label: "Kurs završen", desc: "Završi sve lekcije", earned: ukupnoLekcija > 0 && zavrseneLekcije >= ukupnoLekcija },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = getUsername();
    if (!username) { setLoading(false); return; }

    fetch("http://localhost:8000/lekcije/", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setLekcije(Array.isArray(data) ? data.sort((a, b) => a.redoslijed - b.redoslijed) : []))
      .catch(() => {});

    fetch(`http://localhost:8000/korisnik/pretraga/username?username=${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((korisnik) => {
        fetch(`http://localhost:8000/progres/po-korisniku/${korisnik.id}`, { headers: { Authorization: `Bearer ${token}` } })
          .then((r) => r.ok ? r.json() : null)
          .then((p) => { if (p) setStats((prev) => ({ ...prev, bodovi: p.bodovi, nivo: p.nivo })); })
          .catch(() => {});

        fetch(`http://localhost:8000/zavrsena_lekcija/po-korisnik-id/${korisnik.id}`, { headers: { Authorization: `Bearer ${token}` } })
          .then((r) => r.ok ? r.json() : [])
          .then((data) => setZavrseneIds(Array.isArray(data) ? data.map((z) => z.lekcija_id) : []))
          .catch(() => {});

        fetch(`http://localhost:8000/zadatak_korisnik/tacni/po-korisnik/${korisnik.id}`, { headers: { Authorization: `Bearer ${token}` } })
          .then((r) => r.ok ? r.json() : [])
          .then((data) => setStats((prev) => ({ ...prev, tacni: Array.isArray(data) ? data.length : 0 })))
          .catch(() => {});

        fetch(`http://localhost:8000/zadatak_korisnik/aktivnost/sedmica/${korisnik.id}`, { headers: { Authorization: `Bearer ${token}` } })
          .then((r) => r.ok ? r.json() : [])
          .then((data) => { if (Array.isArray(data) && data.length > 0) setActivity(data); })
          .catch(() => {});

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="page-bg">
      <div className="dashboard-shell">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="dashboard-main">
          <Topbar />
          <h1 className="page-title">Moj napredak</h1>

          {loading ? (
            <div className="prog-loading">Učitavanje...</div>
          ) : (
            <>
              {/* STATS KARTICE */}
              <div className="prog-stats-grid">
                <div className="prog-stat teal">
                  <span className="prog-stat-label">Ukupni bodovi</span>
                  <span className="prog-stat-value">{stats.bodovi}</span>
                </div>
                <div className="prog-stat orange">
                  <span className="prog-stat-label">Završene lekcije</span>
                  <span className="prog-stat-value">{zavrseneLekcije} / {ukupnoLekcija}</span>
                </div>
                <div className="prog-stat purple">
                  <span className="prog-stat-label">Tačni zadaci</span>
                  <span className="prog-stat-value">{stats.tacni}</span>
                </div>
                <div className="prog-stat dark">
                  <span className="prog-stat-label">Tačnost</span>
                  <span className="prog-stat-value">{tacnostPct}%</span>
                </div>
              </div>

              {/* PROGRES LEKCIJA */}
              <div className="prog-section">
                <div className="prog-section-header">
                  <h2 className="section-title" style={{ marginBottom: 0 }}>Napredak po lekcijama</h2>
                  <span className="prog-badge">{pctLekcija}% završeno</span>
                </div>

                {lekcije.length === 0 ? (
                  <p className="prog-empty">Nema lekcija za prikaz.</p>
                ) : (
                  <div className="progress-list">
                    {lekcije.map((l) => {
                      const done = zavrseneIds.includes(l.id);
                      return (
                        <div className="progress-item" key={l.id}>
                          <div className="progress-item-top">
                            <span className="progress-item-name">
                              {done && <span className="done-dot">✓</span>}
                              {l.naziv}
                            </span>
                            <span className="progress-item-pct">{done ? "100%" : "0%"}</span>
                          </div>
                          <div className="progress-track">
                            <div className="progress-fill-blue" style={{ width: done ? "100%" : "0%" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* GRAF AKTIVNOSTI */}
              <div className="prog-section">
                <h2 className="section-title">Aktivnosti ove sedmice</h2>
                <div className="activity-chart-wrap">
                  <div className="activity-chart-inner">
                    {activity.map((a, i) => (
                      <div className="activity-col" key={i}>
                        <div className="activity-bar-wrap">
                          <div
                            className="activity-bar"
                            style={{ height: `${Math.max(Math.round((a.value / maxActivity) * 108), 8)}px` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="activity-day-row">
                    {activity.map((a, i) => (
                      <span className="activity-day-label" key={i}>{a.day}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* DOSTIGNUCA */}
              <div className="prog-section">
                <div className="prog-section-header">
                  <h2 className="section-title" style={{ marginBottom: 0 }}>Dostignuća</h2>
                  <span className="prog-badge">
                    {badges.filter((b) => b.earned).length} / {badges.length}
                  </span>
                </div>
                <div className="badges-grid">
                  {badges.map((b, i) => (
                    <div key={i} className={`badge-card ${b.earned ? "earned" : "locked"}`}>
                      <span className="badge-icon">{b.icon}</span>
                      <span className="badge-label">{b.label}</span>
                      <span className="badge-desc">{b.desc}</span>
                      {!b.earned && <span className="badge-lock">🔒</span>}
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

export default Progress;
