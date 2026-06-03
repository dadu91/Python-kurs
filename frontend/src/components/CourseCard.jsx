import { useNavigate } from "react-router-dom";

function CourseCard({ id = 1, badge, title, progress, type }) {
  const navigate = useNavigate();

  const themeMap = {
    intro: "blue",
    loops: "orange",
    tasks: "purple",
  };

  const themeClass = themeMap[type] || "blue";

  const [done, total] = progress.split("/").map(Number);
  const percent = total ? (done / total) * 100 : 0;

  const openLesson = () => {
    navigate(`/lekcije/${id}`);
  };

  return (
    <div className={`course-card ${themeClass}`} onClick={openLesson}>
      <span className="course-badge">{badge}</span>

      <h3>{title}</h3>

      <p>Napredak</p>
      <p>{progress}</p>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>

      <button
        className="continue-btn"
        onClick={(e) => {
          e.stopPropagation();
          openLesson();
        }}
      >
        Nastavi
      </button>
    </div>
  );
}

export default CourseCard;