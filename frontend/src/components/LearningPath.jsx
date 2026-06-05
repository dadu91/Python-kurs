import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./LearningPath.css";

function LearningPath({ lekcije = [] }) {
  const [openIndex, setOpenIndex] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="learning-path">
      {lekcije.map((lekcija, index) => (
        <div key={lekcija.id} className="module">
          <div
            className="module-header"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <div className="module-left">
              <div className="module-number">{lekcija.redoslijed}</div>
              <h4>{lekcija.naziv}</h4>
            </div>

            <div className="module-right">
              <ChevronDown
                size={18}
                className={openIndex === index ? "rotate" : ""}
                style={{ transition: "transform 0.3s ease" }}
              />
            </div>
          </div>

          <div
            className="steps"
            style={{
              overflow: "hidden",
              maxHeight: openIndex === index ? "500px" : "0px",
              opacity: openIndex === index ? 1 : 0,
              transition: "max-height 0.35s ease, opacity 0.25s ease",
            }}
          >
            <div className="step">
              <div className="step-left">
                <div className="dot" />
                <p>{lekcija.opis}</p>
              </div>
            </div>
            <div className="step">
              <button
                className="continue-btn"
                style={{ marginLeft: "18px" }}
                onClick={() => navigate(`/lekcije/${lekcija.redoslijed}`)}
              >
                Počni lekciju
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LearningPath;
