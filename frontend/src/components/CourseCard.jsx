function CourseCard({ badge, title, progress, type }) {
  const themeMap = {
    intro: "blue",
    loops: "orange",
    tasks: "purple"
  };

  const themeClass = themeMap[type] || "blue";

  // progress parsing (8/24 → %)
  const [done, total] = progress.split("/").map(Number);
  const percent = (done / total) * 100;

  return (
    <div className={`course-card ${themeClass}`}>
      
      {/* 🔹 BADGE */}
      <span className="course-badge">{badge}</span>

      {/* 🔹 TITLE */}
      <h3>{title}</h3>

      {/* 🔹 LABEL + PROGRESS */}
      <p>Napredak</p>
      <p>{progress}</p>

      {/* 🔹 PROGRESS BAR */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* 🔹 BUTTON */}
      <button>Nastavi</button>
    </div>
  );
}

export default CourseCard;