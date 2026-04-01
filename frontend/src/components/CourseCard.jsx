import { Bookmark } from "lucide-react";
function CourseCard({ badge, title, progress, theme }) {
  return (
    <div className={`course-card ${theme}`}>
      <div className="course-top">
        <span className="course-badge">{badge}</span>
        <Bookmark size={18}></Bookmark>
      </div>

      <h3>{title}</h3>

      <div className="course-progress-info">
        <span>Napredak</span>
        <span>{progress}</span>
      </div>

      <div className="progress-line">
        <div className="progress-fill"></div>
      </div>

      <div className="course-footer">
        <div className="avatars">
        </div>
        <button className="continue-btn">Nastavi</button>
      </div>
    </div>
  );
}

export default CourseCard;