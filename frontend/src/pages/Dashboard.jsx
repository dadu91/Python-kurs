import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import CourseCard from "../components/CourseCard";
import LessonsTable from "../components/LessonsTable";
import PromoCard from "../components/PromoCard";

function Dashboard() {
  return (
    <div className="page-bg">
      <div className="dashboard-shell">
        <Sidebar />

        <main className="dashboard-main">
          <Topbar />

          <h1 className="page-title">Pregled učenja</h1>

          <div className="filter-row">
            <button className="filter-btn active">Broj završenih lekcija</button>
            <button className="filter-btn">Ukupni bodovi</button>
            <button className="filter-btn">Trenutna lekcija</button>
          </div>

          <div className="top-cards">
            <CourseCard
              badge="Lekcija 1"
              title="Uvod u python"
              progress="8/24 zadataka"
              theme="blue"
            />
            <CourseCard
              badge="Lekcija 2"
              title="Petlje"
              progress="15/30 zadataka"
              theme="orange"
            />
            <CourseCard
              badge="Lekcija 3"
              title="Zadaci"
              progress="18/22 zadataka"
              theme="dark"
            />
          </div>

          <div className="content-grid">
            <LessonsTable />
            <PromoCard />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;