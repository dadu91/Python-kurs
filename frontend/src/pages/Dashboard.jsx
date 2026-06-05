import "./Dashboard.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import CourseCard from "../components/CourseCard";
import LearningPath from "../components/LearningPath";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const typeMap = { 1: "intro", 2: "loops", 3: "tasks" };

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
      .then(setLekcije)
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
          </div>

          <div className="tab-content" key={activeTab}>
            {activeTab === "lessons" && (
              <>
                <div className="section-header">
                  <h2>Preporučene lekcije</h2>
                  <span>{lekcije.length} ukupno</span>
                </div>

                {lekcije.length > 0 ? (
                  <div className="top-cards">
                    {lekcije.slice(0, 3).map((l) => (
                      <CourseCard
                        key={l.id}
                        id={l.id}
                        badge={`Lekcija ${l.redosljed}`}
                        title={l.naziv}
                        progress="0/1"
                        type={typeMap[l.id] || "intro"}
                      />
                    ))}
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