import "./Dashboard.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import CourseCard from "../components/CourseCard";
import LearningPath from "../components/LearningPath";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { BookOpen, Star, TrendingUp, Play, ArrowRight, AlertTriangle, Target, CheckCircle2 } from "lucide-react";

// 1=uvod(teal), 2=promjenljive(ljubičasta), 3=liste(plava/teal2), 4=petlje(naranžasta)
const colorByRedoslijed = { 1: "intro", 2: "purple", 3: "blue", 4: "orange" };

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

function Dashboard() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "lessons");
  const navigate = useNavigate();

  const [lekcije, setLekcije] = useState([]);
  const [stats, setStats] = useState({
    bodovi: 0,
    zavrseneLekcije: 0,
    nivo: 1,
  });
  const [trenutnaLekcija, setTrenutnaLekcija] = useState(null);
  const [zavrseneLekcije, setZavrseneLekcije] = useState([]);
  const [greske, setGreske] = useState([]);
  const [brojNetacnih, setBrojNetacnih] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = getUsername();

    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:8000/lekcije/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setLekcije([...data].sort((a, b) => a.redoslijed - b.redoslijed)))
      .catch(() => {});

    if (!username) return;

    fetch(`http://localhost:8000/korisnik/pretraga/username?username=${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((korisnik) => {
        fetch(`http://localhost:8000/progres/po-korisniku/${korisnik.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => (res.ok ? res.json() : null))
          .then((progres) => {
            if (progres) {
              setStats((prev) => ({
                ...prev,
                bodovi: progres.bodovi,
                nivo: progres.nivo,
              }));
            }
          })
          .catch(() => {});

        fetch(`http://localhost:8000/zavrsena_lekcija/po-korisnik-id/${korisnik.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data && Array.isArray(data)) {
              setStats((prev) => ({
                ...prev,
                zavrseneLekcije: data.length,
              }));
              setZavrseneLekcije(data);
              if (data.length > 0) {
                setTrenutnaLekcija(data[data.length - 1]);
              }
            }
          })
          .catch(() => {});

        fetch(`http://localhost:8000/zadatak_korisnik/greske/po-korisnik/${korisnik.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => (res.ok ? res.json() : []))
          .then((data) => setGreske(Array.isArray(data) ? data : []))
          .catch(() => {});

        fetch(`http://localhost:8000/zadatak_korisnik/netacni/po-korisnik/${korisnik.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => (res.ok ? res.json() : []))
          .then((data) => setBrojNetacnih(Array.isArray(data) ? data.length : 0))
          .catch(() => {});
      })
      .catch(() => {});
  }, [navigate]);

  const ukupnoGresaka = greske.reduce((sum, g) => sum + (g.broj || 0), 0);
  const username = getUsername();

  const trenutnaLekcijaNaziv = trenutnaLekcija
    ? lekcije.find((l) => l.id === trenutnaLekcija.lekcija_id)?.naziv || "Trenutna lekcija"
    : "Još nema započete lekcije";

  const otvoriTrenutnuLekciju = () => {
    if (trenutnaLekcija?.lekcija_id) {
      navigate(`/lekcije/${trenutnaLekcija.lekcija_id}`);
      return;
    }

    if (lekcije[0]?.id) {
      navigate(`/lekcije/${lekcije[0].id}`);
    }
  };

  return (
    <div className="page-bg">
      <div className="dashboard-shell">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="dashboard-main">
          <Topbar />

          <section className="dashboard-hero">
            <div className="hero-content">
              <span className="hero-label">Python kurs</span>
              <h1>Zdravo{username ? `, ${username}` : ""}</h1>
              <p>Prati lekcije, bodove i trenutni nivo na jednom mjestu.</p>

              <div className="hero-chips">
                <span className="hero-chip"><Star size={14} /> {stats.bodovi} bodova</span>
                <span className="hero-chip"><TrendingUp size={14} /> Nivo {stats.nivo}</span>
                <span className="hero-chip"><BookOpen size={14} /> {stats.zavrseneLekcije} lekcija</span>
              </div>
            </div>

            <div className="hero-side">
              <button onClick={otvoriTrenutnuLekciju}>
                <Play size={16} /> Nastavi učenje
              </button>
            </div>

            <span className="hero-glow" />
          </section>

          <section className="dashboard-stats">
            <div className="dash-stat-card">
              <div className="dash-stat-top">
                <div className="dash-stat-icon teal"><BookOpen size={18} /></div>
                <p>Završene lekcije</p>
              </div>
              <h2>{stats.zavrseneLekcije}</h2>
              <div className="dash-stat-foot">
                <div className="dash-stat-bar teal">
                  <span style={{ width: `${lekcije.length ? Math.round((stats.zavrseneLekcije / lekcije.length) * 100) : 0}%` }} />
                </div>
                <small>{stats.zavrseneLekcije} / {lekcije.length || 0} lekcija</small>
              </div>
            </div>

            <div className="dash-stat-card">
              <div className="dash-stat-top">
                <div className="dash-stat-icon orange"><Star size={18} /></div>
                <p>Ukupni bodovi</p>
              </div>
              <h2>{stats.bodovi}</h2>
              <div className="dash-stat-foot">
                <small className="dash-stat-hint">Skupljeno kroz zadatke</small>
              </div>
            </div>

            <div className="dash-stat-card">
              <div className="dash-stat-top">
                <div className="dash-stat-icon purple"><TrendingUp size={18} /></div>
                <p>Trenutni nivo</p>
              </div>
              <h2>{stats.nivo}</h2>
              <div className="dash-stat-foot">
                <small className="dash-stat-hint">Samo nastavi tako!</small>
              </div>
            </div>
          </section>

          <div className="filter-row">
            <button
              onClick={() => setActiveTab("lessons")}
              className={`filter-btn ${activeTab === "lessons" ? "active" : ""}`}
            >
              Lekcije
            </button>

            <button
              onClick={() => setActiveTab("points")}
              className={`filter-btn ${activeTab === "points" ? "active" : ""}`}
            >
              Moj napredak
            </button>

            <button
              onClick={() => setActiveTab("current")}
              className={`filter-btn ${activeTab === "current" ? "active" : ""}`}
            >
              Trenutna lekcija
            </button>

            <button
              onClick={() => setActiveTab("errors")}
              className={`filter-btn ${activeTab === "errors" ? "active" : ""}`}
            >
              Greške
            </button>
          </div>

          <div className="tab-content" key={activeTab}>
            {activeTab === "lessons" && (
              <>
                <div className="section-header">
                  <h2>Odaberi lekciju</h2>
                  <span>{lekcije.length} ukupno</span>
                </div>

                {lekcije.length > 0 ? (
                  <div className="top-cards">
                    {lekcije.map((l) => {
                      const zavrsena = zavrseneLekcije.some((z) => z.lekcija_id === l.id);
                      return (
                        <CourseCard
                          key={l.id}
                          id={l.id}
                          badge={`Lekcija ${l.redoslijed}`}
                          title={l.naziv}
                          progress={zavrsena ? "1/1" : "0/1"}
                          zavrsena={zavrsena}
                          type={colorByRedoslijed[l.redoslijed] || "intro"}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty-card">Lekcije trenutno nisu učitane.</div>
                )}

                <div className="lessons-section">
                  <h2>Sve lekcije</h2>
                  <LearningPath lekcije={lekcije} />
                </div>
              </>
            )}

            {activeTab === "points" && (
              <div className="stats-box">
                <h2>Moj napredak</h2>

                <div className="stats-grid">
                  <div className="stat-card blue">
                    <span>Ukupni bodovi</span>
                    <h2>{stats.bodovi}</h2>
                  </div>

                  <div className="stat-card orange">
                    <span>Završene lekcije</span>
                    <h2>{stats.zavrseneLekcije}</h2>
                  </div>

                  <div className="stat-card purple">
                    <span>Nivo</span>
                    <h2>{stats.nivo}</h2>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "current" && (
              <div className="current-card">
                <div className="current-card-left">
                  <div className="current-icon-circle">
                    <BookOpen size={30} />
                  </div>
                </div>
                <div className="current-card-right">
                  <span className="current-label">Trenutna lekcija</span>
                  <h2 className="current-title">{trenutnaLekcijaNaziv}</h2>

                  {trenutnaLekcija ? (
                    <>
                      <p className="current-desc">Nastavi gdje si stao i završi lekciju.</p>
                      <button className="current-btn" onClick={otvoriTrenutnuLekciju}>
                        <Play size={14} /> Nastavi lekciju <ArrowRight size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="current-desc">Kada započneš lekciju, prikazaće se ovdje.</p>
                      <button className="current-btn" onClick={otvoriTrenutnuLekciju}>
                        <Play size={14} /> Počni prvu lekciju <ArrowRight size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {activeTab === "errors" && (
              <div className="errors-wrap">
                <div className="errors-summary">
                  <div className="err-sum-card red">
                    <div className="err-sum-icon"><AlertTriangle size={20} /></div>
                    <div>
                      <span className="err-sum-label">Ukupno grešaka</span>
                      <h2 className="err-sum-value">{ukupnoGresaka || brojNetacnih}</h2>
                    </div>
                  </div>

                  <div className="err-sum-card amber">
                    <div className="err-sum-icon"><Target size={20} /></div>
                    <div>
                      <span className="err-sum-label">Tipova grešaka</span>
                      <h2 className="err-sum-value">{greske.length}</h2>
                    </div>
                  </div>

                  <div className="err-sum-card green">
                    <div className="err-sum-icon"><CheckCircle2 size={20} /></div>
                    <div>
                      <span className="err-sum-label">Netačni pokušaji</span>
                      <h2 className="err-sum-value">{brojNetacnih}</h2>
                    </div>
                  </div>
                </div>

                <div className="section-header" style={{ marginTop: 22 }}>
                  <h2>Najčešće greške</h2>
                  <span>{greske.length} tipova</span>
                </div>

                {greske.length > 0 ? (
                  <div className="errors-grid">
                    {greske.map((g, i) => (
                      <div className="error-card" key={i}>
                        <div className="error-card-head">
                          <div className="error-icon-box"><AlertTriangle size={18} /></div>
                          <span className="error-type">{g.tip_greske}</span>
                          <span className="error-count">{g.broj}×</span>
                        </div>
                        {g.opis && <p className="error-desc">{g.opis}</p>}
                        {g.zadnji_put && (
                          <span className="error-date">
                            Posljednji put: {String(g.zadnji_put).slice(0, 10)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="errors-empty">
                    <div className="errors-empty-icon"><CheckCircle2 size={36} /></div>
                    <h3>Nema zabilježenih grešaka</h3>
                    <p>Odlično! Riješi zadatke u lekcijama — ako pogriješiš, ovdje ćeš vidjeti šta da ponoviš.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;