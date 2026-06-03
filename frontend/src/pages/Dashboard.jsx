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
  const [stats, setStats] = useState({ bodovi: 0, zavrseneLekcije: 0, nivo: 1 });
  const [trenutnaLekcija, setTrenutnaLekcija] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = getUsername();

    if (!token) { navigate("/login"); return; }

    // Dohvati lekcije
    fetch("http://localhost:8000/lekcije/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setLekcije)
      .catch(() => {});

    // Dohvati korisnika pa progres i završene lekcije
    if (!username) return;
    fetch(`http://localhost:8000/korisnik/pretraga/username?username=${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((korisnik) => {
        fetch(`http://localhost:8000/progres/po-korisniku/${korisnik.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.ok ? res.json() : null)
          .then((progres) => {
            if (progres) setStats((prev) => ({ ...prev, bodovi: progres.bodovi, nivo: progres.nivo }));
          })
          .catch(() => {});

        fetch(`http://localhost:8000/zavrsena_lekcija/po-korisnik-id/${korisnik.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.ok ? res.json() : null)
          .then((data) => {
            if (data && Array.isArray(data)) {
              setStats((prev) => ({ ...prev, zavrseneLekcije: data.length }));
              if (data.length > 0) setTrenutnaLekcija(data[data.length - 1]);
            }
          })
          .catch(() => {});
      })
      .catch(() => {});
  }, []);

  return (
    <div className="page-bg">
      <div className="dashboard-shell">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="dashboard-main">
          <Topbar />

          <h1 className="page-title">Pregled učenja</h1>

          <div className="filter-row">
            <button
              onClick={() => setActiveTab("lessons")}
              className={`filter-btn ${activeTab === "lessons" ? "active" : ""}`}
            >
              Broj završenih lekcija
            </button>
            <button
              onClick={() => setActiveTab("points")}
              className={`filter-btn ${activeTab === "points" ? "active" : ""}`}
            >
              Ukupni bodovi
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
                <div className="top-cards">
                  {lekcije.map((l) => (
                    <CourseCard
                      key={l.id}
                      id={l.id}
                      badge={`Lekcija ${l.redosljed}`}
                      title={l.naziv}
                      progress={`0/1`}
                      type={typeMap[l.id] || "intro"}
                    />
                  ))}
                </div>

                <div className="content-grid">
                  <div className="left-section">
                    <div className="lessons-section">
                      <h2>Sve lekcije</h2>
                      <LearningPath lekcije={lekcije} />
                    </div>
                  </div>
                  <div className="right-section" />
                </div>
              </>
            )}

            {activeTab === "points" && (
              <div className="stats-box">
                <h3>Statistika</h3>
                <div className="stats-grid">
                  <div className="stat-card blue big">
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
              </div>
            )}

            {activeTab === "current" && (
              <div className="course-card purple large">
                <div className="course-top">
                  <span className="course-badge">Trenutna lekcija</span>
                </div>
                {trenutnaLekcija ? (
                  <>
                    <h3>
                      {lekcije.find((l) => l.id === trenutnaLekcija.lekcija_id)?.naziv || "—"}
                    </h3>
                    <p className="course-desc">Nastavi gdje si stao i završi lekciju</p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: "60%" }} />
                    </div>
                    <button
                      className="continue-btn"
                      onClick={() => navigate(`/lekcije/${trenutnaLekcija.lekcija_id}`)}
                    >
                      Nastavi lekciju
                    </button>
                  </>
                ) : (
                  <p className="course-desc">Još nisi završio nijednu lekciju.</p>
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
