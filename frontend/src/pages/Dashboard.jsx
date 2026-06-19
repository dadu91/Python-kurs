import "./Dashboard.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import CourseCard from "../components/CourseCard";
import LearningPath from "../components/LearningPath";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

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

        fetch(`http://localhost:8000/zadatak_korisnik/greske-po-korisniku/${korisnik.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => (res.ok ? res.json() : []))
          .then((data) => { if (Array.isArray(data)) setGreske(data); })
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
      })
      .catch(() => {});
  }, [navigate]);

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
            <div>
              <span className="hero-label">Python kurs</span>
              <h1>Pregled učenja</h1>
              <p>Prati lekcije, bodove i trenutni nivo na jednom mjestu.</p>
            </div>

            <button onClick={otvoriTrenutnuLekciju}>Nastavi učenje</button>
          </section>

          <section className="dashboard-stats">
            <div className="dash-stat-card">
              <p>Završene lekcije</p>
              <h2>{stats.zavrseneLekcije}</h2>
            </div>

            <div className="dash-stat-card">
              <p>Ukupni bodovi</p>
              <h2>{stats.bodovi}</h2>
            </div>

            <div className="dash-stat-card">
              <p>Trenutni nivo</p>
              <h2>{stats.nivo}</h2>
            </div>
          </section>

          {activeTab !== "errors" && <div className="filter-row">
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
          </div>}

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

            {activeTab === "errors" && (
              <div className="errors-box">
                <h2>Moje greške</h2>
                {greske.length === 0 ? (
                  <div className="empty-card">Nema zabilježenih grešaka. Odlično!</div>
                ) : (
                  <div className="errors-list">
                    {greske.map((g) => (
                      <div
                        key={g.id}
                        className="error-item"
                        onClick={() => navigate(`/lekcije/${g.lekcija_id}#zadatak-${g.zadatak_redoslijed}`)}
                        title={`Idi na: ${g.lekcija_naziv} — Zadatak ${g.zadatak_redoslijed}`}
                      >
                        <div className="error-badge">{g.tip_greske}</div>
                        <div className="error-info">
                          <p className="error-opis">{g.opis}</p>
                          <div className="error-meta">
                            <span className="error-lekcija">
                              {g.lekcija_naziv} — Zadatak {g.zadatak_redoslijed}
                            </span>
                            <span className="error-datum">
                              {new Date(g.datum).toLocaleDateString("bs-BA", {
                                day: "2-digit", month: "2-digit", year: "numeric",
                                hour: "2-digit", minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "current" && (
              <div className="current-box">
                <span>Trenutna lekcija</span>
                <h2>{trenutnaLekcijaNaziv}</h2>

                {trenutnaLekcija ? (
                  <>
                    <p>Nastavi gdje si stao i završi lekciju.</p>
                    <button onClick={otvoriTrenutnuLekciju}>Nastavi lekciju</button>
                  </>
                ) : (
                  <>
                    <p>Kada započneš lekciju, prikazaće se ovdje.</p>
                    <button onClick={otvoriTrenutnuLekciju}>Počni prvu lekciju</button>
                  </>
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