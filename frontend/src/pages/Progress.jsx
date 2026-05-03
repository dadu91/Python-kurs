import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useState } from "react";

const lessons = [
  { title: "Uvod u Python", done: 8, total: 24 },
  { title: "Petlje", done: 15, total: 30 },
  { title: "Zadaci", done: 18, total: 22 },
  { title: "Funkcije", done: 4, total: 20 },
  { title: "Liste i rječnici", done: 0, total: 18 },
];

const badges = [
  { icon: "🏆", label: "Prva lekcija", earned: true },
  { icon: "🔥", label: "7 dana zaredom", earned: true },
  { icon: "⚡", label: "Brzinsko rješavanje", earned: false },
  { icon: "🎯", label: "Perfektan rezultat", earned: false },
  { icon: "🐍", label: "Python majstor", earned: false },
];

const activity = [
  { day: "Pon", value: 4 },
  { day: "Uto", value: 7 },
  { day: "Sri", value: 3 },
  { day: "Čet", value: 8 },
  { day: "Pet", value: 5 },
  { day: "Sub", value: 2 },
  { day: "Ned", value: 6 },
];

function Progress() {
  const [activeTab, setActiveTab] = useState("lessons");

  return (
    <div className="page-bg">
      <div className="dashboard-shell">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="dashboard-main">
          <Topbar />

          <h1 className="page-title">Moj napredak</h1>

          {/* PROGRESS BARS */}
          <div className="progress-section">
            <h2 className="section-title">Lekcije</h2>
            <div className="progress-list">
              {lessons.map((l, i) => {
                const pct = Math.round((l.done / l.total) * 100);
                return (
                  <div className="progress-item" key={i}>
                    <div className="progress-item-top">
                      <span>{l.title}</span>
                      <span>{l.done}/{l.total} — {pct}%</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill-blue" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* GRAF AKTIVNOSTI */}
          <div className="progress-section">
            <h2 className="section-title">Aktivnosti ove nedelje</h2>
            <div className="activity-chart">
              {activity.map((a, i) => (
                <div className="activity-col" key={i}>
                  <div
                    className="activity-bar"
                    style={{ height: `${a.value * 12}px` }}
                  />
                  <span className="activity-day">{a.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* BADGES */}
          <div className="progress-section">
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

export default Progress;