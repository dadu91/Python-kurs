import "./Lesson.css";
import { useState, useRef, useEffect } from "react";

function getKorisnikId() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.korisnik_id || null;
  } catch {
    return null;
  }
}

async function fetchKorisnikId(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const username = payload.sub;
    const res = await fetch(`http://localhost:8000/korisnik/pretraga/username?username=${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.id;
  } catch {
    return null;
  }
}
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Code2,
  Terminal,
  HelpCircle,
  Trophy,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import uvod from "../lessons/uvod";
import petlje from "../lessons/petlje";
import promjenljive from "../lessons/promjenljive";
import liste from "../lessons/liste";

const lessonsByRedoslijed = { 1: uvod, 2: promjenljive, 3: liste, 4: petlje };

function Lesson() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [redoslijed, setRedoslijed] = useState(null);
  const lesson = lessonsByRedoslijed[redoslijed] || lessonsByRedoslijed[1];

  const [activeTab, setActiveTab] = useState("lessons");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [taskCodes, setTaskCodes] = useState({});
  const [taskResults, setTaskResults] = useState({});
  const [taskOutputs, setTaskOutputs] = useState({});
  const [shownSolutions, setShownSolutions] = useState({});
  const [vjezbaKodovi, setVjezbaKodovi] = useState({});
  const [vjezbaRezultati, setVjezbaRezultati] = useState({});
  const [zadaciMapa, setZadaciMapa] = useState({});
  const [uradjeniZadaci, setUradjeniZadaci] = useState(new Set());

  const textareaRefs = useRef({});
  const cursorPos = useRef(null);

  useEffect(() => {
    if (window.location.hash) {
      const targetId = window.location.hash.slice(1);
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 600);
    }
  }, [redoslijed]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8000/lekcije/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : null)
      .then((lekcija) => { if (lekcija?.redoslijed) setRedoslijed(lekcija.redoslijed); })
      .catch(() => {});

    fetch(`http://localhost:8000/zadaci/po-lekciji/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : [])
      .then((zadaci) => {
        const mapa = {};
        zadaci.forEach((z) => { mapa[z.redoslijed] = z.id; });
        setZadaciMapa(mapa);
      })
      .catch(() => {});

    fetchKorisnikId(token).then((korisnikId) => {
      if (!korisnikId) return;

      fetch(`http://localhost:8000/zadatak_korisnik/tacni/po-korisnik/${korisnikId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.ok ? res.json() : [])
        .then((data) => {
          setUradjeniZadaci(new Set(data.map((zk) => zk.zadatak_id)));
        })
        .catch(() => {});

      fetch(`http://localhost:8000/zavrsena_lekcija/po-korisnik-id/${korisnikId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.ok ? res.json() : [])
        .then((data) => {
          if (Array.isArray(data) && data.some((zl) => zl.lekcija_id === parseInt(id))) {
            setFinished(true);
          }
        })
        .catch(() => {});
    });
  }, [id]);

  const upisiZadatakKorisnik = async (redoslijed, tacno, tipGreske = null) => {
    const zadatakId = zadaciMapa[redoslijed];
    if (!zadatakId) return;
    const token = localStorage.getItem("token");
    const korisnikId = await fetchKorisnikId(token);
    if (!korisnikId) return;
    const body = { zadatak_id: zadatakId, korisnik_id: korisnikId, tacno };
    if (tipGreske) body.tip_greske = tipGreske;
    fetch("http://localhost:8000/zadatak_korisnik/", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    }).catch(() => {});
    if (tacno) {
      setUradjeniZadaci((prev) => new Set([...prev, zadatakId]));
    }
  };

  useEffect(() => {
    if (cursorPos.current !== null) {
      const { index, pos } = cursorPos.current;
      const el = textareaRefs.current[index];
      if (el) {
        el.selectionStart = pos;
        el.selectionEnd = pos;
      }
      cursorPos.current = null;
    }
  });

  const handleAnswer = (questionIndex, answerIndex) => {
    if (selectedAnswers[questionIndex] === lesson.questions[questionIndex].correct) return;
    const tacno = answerIndex === lesson.questions[questionIndex].correct;
    setSelectedAnswers({ ...selectedAnswers, [questionIndex]: answerIndex });
    upisiZadatakKorisnik(lesson.questions[questionIndex].redoslijed, tacno);
  };

  const normalizeCode = (code) => {
    return code
      .replaceAll(" ", "")
      .replaceAll("\n", "")
      .replaceAll("\t", "")
      .replaceAll("'", '"')
      .toLowerCase();
  };


  const checkTaskCode = (taskIndex) => {
    const task = lesson.codingTasks[taskIndex];
    const userCode = textareaRefs.current[taskIndex]?.value || "";
    const normalizedCode = normalizeCode(userCode);
    const isCorrect = task.check(normalizedCode);
    setTaskResults({ ...taskResults, [taskIndex]: isCorrect ? "correct" : "wrong" });
    upisiZadatakKorisnik(task.redoslijed, isCorrect);
  };

  const runTaskCode = async (taskIndex) => {
    const task = lesson.codingTasks[taskIndex];
    const userCode = textareaRefs.current[taskIndex]?.value || "";
    const normalizedCode = normalizeCode(userCode);
    const token = localStorage.getItem("token");

    if (!userCode.trim()) {
      setTaskOutputs({ ...taskOutputs, [taskIndex]: ">>> Pokreni kod\nGreška: prvo upiši kod." });
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/kod/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ kod: userCode }),
      });
      const data = await res.json();

      if (data.greska) {
        setTaskOutputs({ ...taskOutputs, [taskIndex]: `>>> Pokreni kod\n${data.greska.tip}: ${data.greska.poruka}` });
        setTaskResults({ ...taskResults, [taskIndex]: "wrong" });
        upisiZadatakKorisnik(task.redoslijed, false, data.greska.tip);
      } else {
        const output = data.output || "";
        setTaskOutputs({ ...taskOutputs, [taskIndex]: `>>> Pokreni kod\n${output}` });

        const isCorrect = task.check(normalizedCode);
        setTaskResults({ ...taskResults, [taskIndex]: isCorrect ? "correct" : "wrong" });
        if (isCorrect) upisiZadatakKorisnik(task.redoslijed, true);
      }
    } catch {
      setTaskOutputs({ ...taskOutputs, [taskIndex]: ">>> Greška pri povezivanju sa serverom." });
    }
  };

  const checkVjezbu = (blockIndex) => {
    const block = lesson.theoryBlocks[blockIndex];
    const code = vjezbaKodovi[blockIndex] || "";
    const normalized = normalizeCode(code);
    const isCorrect = block.vjezbaSintakse.check(normalized);
    setVjezbaRezultati((prev) => ({
      ...prev,
      [blockIndex]: isCorrect ? "correct" : "wrong",
    }));
  };

  const correctCount = lesson.questions.filter(
    (q, index) => selectedAnswers[index] === q.correct
  ).length;

  const answeredCount = Object.keys(selectedAnswers).length;
  const canFinishQuiz = answeredCount === lesson.questions.length;

  const codingTasksCount = lesson.codingTasks.length;
  const correctCodingTasksCount = Object.values(taskResults).filter(
    (result) => result === "correct"
  ).length;

  const hasCodingTasks = codingTasksCount > 0;
  const canFinishCodingTasks =
    !hasCodingTasks || correctCodingTasksCount === codingTasksCount;

  const canCompleteLesson = canFinishQuiz && canFinishCodingTasks;

  return (
    <div className="page-bg">
      <div className="dashboard-shell">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="dashboard-main lesson-main">
          <Topbar />

          <button className="back-btn" onClick={() => navigate("/")}>
            <ArrowLeft size={18} /> Nazad na lekcije
          </button>

          <section className={`lesson-hero ${lesson.heroClass}`}>
            <div>
              <span className="lesson-pill">Lekcija {redoslijed}</span>
              <h1>{lesson.title}</h1>
              <p>{lesson.description}</p>

              <div className="lesson-meta">
                <span>Trajanje: {lesson.duration}</span>
                <span>Nivo: {lesson.level}</span>
                <span>Mini provjere: {lesson.questions.length}</span>
                {hasCodingTasks && <span>Kod zadaci: {codingTasksCount}</span>}
              </div>
            </div>

            <div className="lesson-score-card">
              <span>Rezultat</span>
              <h2>
                {correctCount}/{lesson.questions.length}
              </h2>

              <div className="lesson-progress-track">
                <div
                  className="lesson-progress-fill"
                  style={{
                    width: `${(answeredCount / lesson.questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </section>

          <section className="lesson-panel" style={{ marginBottom: "24px" }}>
            <h2>Šta učiš?</h2>
            <div className="goal-list">
              {lesson.goals.map((goal, index) => (
                <div
                  className="goal-item goal-item-link"
                  key={index}
                  onClick={() => {
                    const el = document.getElementById(`theory-block-${goal.blockIndex}`);
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  <CheckCircle2 size={19} />
                  <span>{goal.tekst}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="theory-flow">
            {lesson.theoryBlocks.map((block, blockIndex) => (
              <div key={blockIndex} id={`theory-block-${blockIndex}`} className="theory-block lesson-panel">
                <div className="panel-title-row">
                  <h2>{block.title}</h2>
                  <Code2 size={22} />
                </div>
                <p>{block.text}</p>
                <pre className="mini-code">{block.code}</pre>

                {block.codeObjasnjenje && (
                  <div className="code-objasnjenje">
                    {block.codeObjasnjenje.map((linija, i) => (
                      <div key={i} className="code-objasnjenje-red">
                        <span className="code-objasnjenje-broj">{i + 1}</span>
                        <span>{linija}</span>
                      </div>
                    ))}
                  </div>
                )}

                {block.vjezbaSintakse && (
                  <div className="vjezba-sintakse">
                    <h4>Vježba sintakse</h4>
                    <p>{block.vjezbaSintakse.uputstvo}</p>
                    <textarea
                      className="code-input"
                      placeholder={block.vjezbaSintakse.placeholder}
                      value={vjezbaKodovi[blockIndex] || ""}
                      onChange={(e) =>
                        setVjezbaKodovi((prev) => ({
                          ...prev,
                          [blockIndex]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        const el = e.target;
                        const start = el.selectionStart;
                        const end = el.selectionEnd;
                        const code = el.value;
                        if (e.key === "Tab") {
                          e.preventDefault();
                          const newVal = code.substring(0, start) + "    " + code.substring(end);
                          setVjezbaKodovi((prev) => ({ ...prev, [blockIndex]: newVal }));
                        }
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const currentLine = code.substring(0, start).split("\n").pop();
                          const indent = currentLine.match(/^(\s*)/)[1];
                          const extraIndent = currentLine.trimEnd().endsWith(":") ? "    " : "";
                          const newVal = code.substring(0, start) + "\n" + indent + extraIndent + code.substring(end);
                          setVjezbaKodovi((prev) => ({ ...prev, [blockIndex]: newVal }));
                        }
                      }}
                    />
                    <div className="code-actions">
                      <button
                        className="check-code-btn"
                        onClick={() => checkVjezbu(blockIndex)}
                      >
                        Provjeri
                      </button>
                    </div>
                    {vjezbaRezultati[blockIndex] === "correct" && (
                      <div className="code-result correct-result">
                        Tačno! Sintaksa je ispravna.
                      </div>
                    )}
                    {vjezbaRezultati[blockIndex] === "wrong" && (
                      <div className="code-result wrong-result">
                        Nije tačno. {block.vjezbaSintakse.hint}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </section>

          <section className="quiz-section">
            <div className="quiz-header">
              <HelpCircle size={26} />
              <div>
                <h2>Mini provjere</h2>
                <p>Odgovori na pitanja da provjeriš da li si razumio lekciju.</p>
              </div>
            </div>

            <div className="quiz-list">
              {lesson.questions.map((item, questionIndex) => (
                <article id={`zadatak-${item.redoslijed}`} className={`quiz-card ${uradjeniZadaci.has(zadaciMapa[item.redoslijed]) ? "quiz-card-done" : ""}`} key={questionIndex}>
                  <h3>
                    {uradjeniZadaci.has(zadaciMapa[item.redoslijed]) && <CheckCircle2 size={18} style={{ color: "#23a455", marginRight: "8px", display: "inline" }} />}
                    Pitanje {questionIndex + 1}: {item.question}
                  </h3>

                  <div className="answer-list">
                    {item.answers.map((answer, answerIndex) => {
                      const isSelected = selectedAnswers[questionIndex] === answerIndex;
                      const isCorrect = item.correct === answerIndex;
                      const isAnswered = selectedAnswers[questionIndex] !== undefined;
                      const isLocked = selectedAnswers[questionIndex] === item.correct;

                      let buttonClass = "answer-btn";
                      if (isAnswered && isSelected && isCorrect) buttonClass += " correct";
                      if (isAnswered && isSelected && !isCorrect) buttonClass += " wrong";

                      return (
                        <button
                          key={answerIndex}
                          className={buttonClass}
                          disabled={isLocked}
                          onClick={() => handleAnswer(questionIndex, answerIndex)}
                        >
                          {answer}
                        </button>
                      );
                    })}
                  </div>

                  {selectedAnswers[questionIndex] !== undefined && (
                    <p className="answer-feedback">
                      {selectedAnswers[questionIndex] === item.correct
                        ? "Tačno!"
                        : "Nije tačno. Razmisli ponovo."}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>

          {hasCodingTasks && (
            <section className="final-task lesson-panel">
              <div className="panel-title-row">
                <div>
                  <h2>Zadaci za pisanje koda</h2>
                  <p>
                    Upiši svoje rješenje ispod svakog zadatka. Klikni
                    <b> Provjeri kod</b> da vidiš da li je tačno ili
                    <b> Pokreni kod</b> da dobiješ izlaz kao u konzoli.
                  </p>
                </div>
                <Terminal size={26} />
              </div>

              <div className="coding-task-list">
                {lesson.codingTasks.map((task, taskIndex) => (
                  <div id={`zadatak-${task.redoslijed}`} className={`code-checker-box ${uradjeniZadaci.has(zadaciMapa[task.redoslijed]) ? "code-checker-done" : ""}`} key={taskIndex}>
                    <h3>
                      {uradjeniZadaci.has(zadaciMapa[task.redoslijed]) && <CheckCircle2 size={18} style={{ color: "#23a455", marginRight: "8px", display: "inline" }} />}
                      {task.title}
                    </h3>
                    <p>{task.description}</p>

                    <textarea
                      className="code-input"
                      ref={(el) => (textareaRefs.current[taskIndex] = el)}
                      defaultValue=""
                      onKeyDown={(e) => {
                        const el = e.target;
                        const start = el.selectionStart;
                        const end = el.selectionEnd;
                        const code = el.value;

                        if (e.key === "Tab") {
                          e.preventDefault();
                          el.value = code.substring(0, start) + "    " + code.substring(end);
                          el.selectionStart = start + 4;
                          el.selectionEnd = start + 4;
                        }

                        if (e.key === "Enter") {
                          e.preventDefault();
                          const currentLine = code.substring(0, start).split("\n").pop();
                          const indent = currentLine.match(/^(\s*)/)[1];
                          const extraIndent = currentLine.trimEnd().endsWith(":") ? "    " : "";
                          el.value = code.substring(0, start) + "\n" + indent + extraIndent + code.substring(end);
                          const newPos = start + 1 + indent.length + extraIndent.length;
                          el.selectionStart = newPos;
                          el.selectionEnd = newPos;
                        }
                      }}
                      placeholder="Ovdje upiši svoje rješenje..."
                    />

                    <div className="code-actions">
                      <button
                        className="check-code-btn"
                        onClick={() => checkTaskCode(taskIndex)}
                      >
                        Provjeri kod
                      </button>

                      <button
                        className="run-code-btn"
                        onClick={() => runTaskCode(taskIndex)}
                      >
                        Pokreni kod
                      </button>
                    </div>

                    {taskResults[taskIndex] === "correct" && (
                      <div className="code-result correct-result">
                        Tačno! Ovaj zadatak je urađen kako treba.
                      </div>
                    )}

                    {taskResults[taskIndex] === "wrong" && (
                      <div className="code-result wrong-result">
                        Netačan kod, pokušaj ponovo. Pogledaj poruku u konzoli ispod.
                      </div>
                    )}

                    {taskOutputs[taskIndex] && (
                      <div className="output-box">
                        <p>Konzola:</p>
                        <pre>{taskOutputs[taskIndex]}</pre>
                      </div>
                    )}

                    <button
                      className="show-solution-btn"
                      onClick={() =>
                        setShownSolutions({
                          ...shownSolutions,
                          [taskIndex]: !shownSolutions[taskIndex],
                        })
                      }
                    >
                      {shownSolutions[taskIndex]
                        ? "Sakrij rješenje"
                        : "Prikaži rješenje"}
                    </button>

                    {shownSolutions[taskIndex] && (
                      <div className="solution-box">
                        <p>Jedno moguće rješenje:</p>
                        <pre className="mini-code">{task.solution}</pre>

                        <p>Izlaz programa:</p>
                        <pre className="mini-code">{task.expectedOutput}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="final-task lesson-panel">
            <div className="panel-title-row">
              <div>
                <h2>Završi lekciju</h2>
                <p>
                  Lekciju možeš završiti kada odgovoriš na sva pitanja
                  {hasCodingTasks && " i tačno riješiš sve zadatke za kod"}.
                </p>
              </div>
              <Trophy size={26} />
            </div>

            <button
              className={finished ? "done-btn completed" : "done-btn"}
              disabled={!canCompleteLesson}
              onClick={async () => {
                const token = localStorage.getItem("token");
                const korisnikId = await fetchKorisnikId(token);
                if (!korisnikId) return;

                // Kreiraj progres ako ne postoji
                await fetch("http://localhost:8000/progres/", {
                  method: "POST",
                  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                  body: JSON.stringify({ korisnik_id: korisnikId }),
                });

                // Upiši završenu lekciju
                await fetch("http://localhost:8000/zavrsena_lekcija/", {
                  method: "POST",
                  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                  body: JSON.stringify({ lekcija_id: parseInt(id), korisnik_id: korisnikId }),
                });

                setFinished(true);
              }}
            >
              {finished
                ? "Lekcija završena"
                : !canFinishQuiz
                ? "Odgovori na mini provjere"
                : hasCodingTasks && !canFinishCodingTasks
                ? "Riješi sve kod zadatke"
                : "Označi kao završeno"}
            </button>

            {finished && (
              <div className="success-box">
                <Trophy size={22} />
                <span>
                  Završio si lekciju. Mini provjere: {correctCount}/
                  {lesson.questions.length}
                  {hasCodingTasks &&
                    `, kod zadaci: ${correctCodingTasksCount}/${codingTasksCount}`}
                </span>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default Lesson;