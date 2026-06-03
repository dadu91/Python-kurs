import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import CourseCard from "../components/CourseCard";
import LearningPath from "../components/LearningPath";
import PromoCard from "../components/PromoCard"; // možeš ga uključiti kasnije
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "lessons");

  const [stats] = useState({
    total: 120,
    lessons: 5,
    average: 24,
  });

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
            {activeTab === "profile" && (
              <div>
                <h1 className="page-title">Profil</h1>
                <p>Ovdje će biti profil...</p>
              </div>
            )}

            {activeTab === "errors" && (
              <div>
                <h1 className="page-title">Greške</h1>
                <p>Ovdje će biti greške...</p>
              </div>
            )}

            {activeTab === "settings" && (
              <div>
                <h3 className="page-title">Podešavanja</h3>
                <p>Ovdje će biti podešavanja...</p>
              </div>
            )}

            {activeTab === "lessons" && (
              <>
                <div className="top-cards">
                  <CourseCard
                    id={1}
                    badge="Lekcija 1"
                    title="Uvod u Python"
                    progress="8/24"
                    type="intro"
                  />

                  <CourseCard
                    id={2}
                    badge="Lekcija 2"
                    title="Petlje"
                    progress="0/3"
                    type="loops"
                  />

                  <CourseCard
                    id={3}
                    badge="Lekcija 3"
                    title="Zadaci"
                    progress="18/22"
                    type="tasks"
                  />
                </div>

                <div className="content-grid">
                  <div className="left-section">
                    <div className="lessons-section">
                      <h2>Sve lekcije</h2>
                      <LearningPath />
                    </div>
                  </div>

                  <div className="right-section">
                    {/* <PromoCard /> */}
                  </div>
                </div>
              </>
            )}

            {activeTab === "points" && (
              <div className="stats-box">
                <h3>Statistika</h3>

                <div className="stats-grid">
                  <div className="stat-card blue big">
                    <span className="stat-top">Ukupni bodovi</span>
                    <h2>{stats.total}</h2>
                    <p className="stat-extra">Danas: +12</p>
                  </div>

                  <div className="stat-card orange">
                    <p>Završene lekcije</p>
                    <h2>{stats.lessons}</h2>
                  </div>

                  <div className="stat-card purple">
                    <p>Prosjek bodova</p>
                    <h2>{stats.average}</h2>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "current" && (
              <div className="course-card purple large">
                <div className="course-top">
                  <span className="course-badge">Trenutna lekcija</span>
                </div>

                <h3>Petlje u Pythonu</h3>

                <p className="course-desc">
                  Nastavi lekciju o petljama, uradi mini provjere i završni zadatak.
                </p>

                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "0%" }} />
                </div>

                <button
                  className="continue-btn"
                  onClick={() => navigate("/lekcije/2")}
                >
                  Nastavi lekciju
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;