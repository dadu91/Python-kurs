import "./LessonsTable.css";

function LessonsTable() {
  const lessons = [
    {
      lesson: "Uvod u Python",
      subtitle: "Osnovne operacije u pythonu",
      duration: "20 min",
    },
    {
      lesson: "Petlje",
      subtitle: "if, for while",
      duration: "25 min",
    },
  ];

  return (
    <section className="lessons-box">
      <div className="lessons-header">
        <h2>Sve lekcije</h2>
        <a href="#">Pogledaj sve lekcije</a>
      </div>

      <div className="lessons-table">
        <div className="table-head">
          <span>Lekcija</span>
          <span>Vrijeme</span>
        </div>

        {lessons.map((item, index) => (
          <div className="table-row" key={index}>
            <div>
              <h4>{item.lesson}</h4>
              <p>{item.subtitle}</p>
            </div>
            <span>{item.duration}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default LessonsTable;