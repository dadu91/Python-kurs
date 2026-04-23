import { useState } from "react";
import { ChevronDown, PlayCircle, CheckCircle2 } from "lucide-react";

function LearningPath() {
  const [openIndex, setOpenIndex] = useState(0);

  const data = [
    {
      title: "Uvod u Python",
      duration: "43 min",
      steps: [
        { title: "Šta je Python?", time: "4 min", done: true },
        { title: "Prednosti i mane Python-a", time: "3 min", done: false },
        { title: "Preuzimanje i instalacija", time: "13 min", video: true },
      ],
    },
    {
      title: "Osnove Python-a",
      duration: "1h 36min",
      steps: [],
    },
    {
      title: "Kontrola toka",
      duration: "1h 26min",
      steps: [],
    },
  ];

  return (
    <div className="learning-path">
      {data.map((module, index) => (
        <div key={index} className="module">

          {/* HEADER */}
          <div
            className="module-header"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <div className="module-left">
              <div className="module-number">{index + 1}</div>
              <h4>{module.title}</h4>
            </div>

            <div className="module-right">
              <span>{module.duration}</span>
              <ChevronDown
                size={18}
                className={openIndex === index ? "rotate" : ""}
                style={{ transition: "transform 0.3s ease" }}
              />
            </div>
          </div>

          {/* STEPS — uvijek u DOM-u, animira se kroz CSS */}
          <div
            className="steps"
            style={{
              overflow: "hidden",
              maxHeight: openIndex === index ? "500px" : "0px",
              opacity: openIndex === index ? 1 : 0,
              transition: "max-height 0.35s ease, opacity 0.25s ease",
            }}
          >
            {module.steps.map((step, i) => (
              <div key={i} className="step">
                <div className="step-left">
                  {step.done ? (
                    <CheckCircle2 size={18} className="done" />
                  ) : step.video ? (
                    <PlayCircle size={18} className="video" />
                  ) : (
                    <div className="dot" />
                  )}
                  <p>{step.title}</p>
                </div>
                <span className="time">{step.time}</span>
              </div>
            ))}
          </div>

        </div>
      ))}
    </div>
  );
}

export default LearningPath;