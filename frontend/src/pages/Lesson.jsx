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
import lesson3 from "../lessons/lesson3";

const lessons = { 1: uvod, 2: petlje, 3: lesson3 };

function Lesson() {
  const navigate = useNavigate();
  const { id } = useParams();

  const lesson = lessons[id] || lessons[1];

  const [activeTab, setActiveTab] = useState("lessons");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [taskCodes, setTaskCodes] = useState({});
  const [taskResults, setTaskResults] = useState({});
  const [taskOutputs, setTaskOutputs] = useState({});
  const [shownSolutions, setShownSolutions] = useState({});
  const [vjezbaKodovi, setVjezbaKodovi] = useState({});
  const [vjezbaRezultati, setVjezbaRezultati] = useState({});

  const textareaRefs = useRef({});
  const cursorPos = useRef(null);

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
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex,
    });
  };

  const normalizeCode = (code) => {
    return code
      .replaceAll(" ", "")
      .replaceAll("\n", "")
      .replaceAll("\t", "")
      .replaceAll("'", '"')
      .toLowerCase();
  };

  const getTaskError = (taskIndex, code) => {
    if (taskIndex === 0) {
      if (!code.includes("foriinrange(5):")) {
        return "SyntaxError: očekuje se for petlja oblika: for i in range(5):";
      }

      if (!code.includes("print(i)")) {
        return "LogicError: petlja postoji, ali ne ispisuje vrijednost i. Dodaj print(i).";
      }
    }

    if (taskIndex === 1) {
      if (!code.includes("brojevi=[2,4,6,8]")) {
        return "NameError: lista brojevi nije pravilno definisana. Očekuje se brojevi = [2, 4, 6, 8].";
      }

      if (!code.includes("forbrojinbrojevi:")) {
        return "SyntaxError: fali for petlja koja prolazi kroz listu brojevi.";
      }

      if (!code.includes("print(broj)")) {
        return "LogicError: prolaziš kroz listu, ali ne ispisuješ trenutni broj. Dodaj print(broj).";
      }
    }

    if (taskIndex === 2) {
      if (!code.includes("brojevi=[10,15,22,31,44,57,68]")) {
        return "NameError: lista brojevi nije pravilno definisana. Očekuje se brojevi = [10, 15, 22, 31, 44, 57, 68].";
      }

      if (!code.includes("forbrojinbrojevi:")) {
        return "SyntaxError: fali for petlja koja prolazi kroz listu brojevi.";
      }

      if (!code.includes("ifbroj%2==0:")) {
        return "LogicError: fali uslov koji provjerava da li je broj paran: if broj % 2 == 0:";
      }

      if (!code.includes("print(broj)")) {
        return "LogicError: pronašao si parne brojeve, ali ih ne ispisuješ. Dodaj print(broj).";
      }
    }

    if (taskIndex === 3) {
      if (!code.includes("brojevi=[12,19,24,33,40,55,72,81]")) {
        return "NameError: lista brojevi nije pravilno definisana. Očekuje se brojevi = [12, 19, 24, 33, 40, 55, 72, 81].";
      }

      if (!code.includes("brojac=0")) {
        return "NameError: brojač nije postavljen. Dodaj brojac = 0 prije petlje.";
      }

      if (!code.includes("forbrojinbrojevi:")) {
        return "SyntaxError: fali for petlja koja prolazi kroz listu brojevi.";
      }

      if (!code.includes("ifbroj%2==0:")) {
        return "LogicError: fali provjera da li je broj paran: if broj % 2 == 0:";
      }

      if (!code.includes("brojac+=1")) {
        return "LogicError: pronađeš paran broj, ali ne povećavaš brojač. Dodaj brojac += 1.";
      }

      if (!code.includes("print(")) {
        return "LogicError: rezultat se ne ispisuje. Dodaj print(brojac).";
      }
    }

    if (taskIndex === 4) {
      if (!code.includes("foriinrange(5):")) {
        return "SyntaxError: fali dvotačka poslije range(5). Ispravno je: for i in range(5):";
      }

      if (!code.includes("print(i)")) {
        return "LogicError: petlja postoji, ali ne ispisuje vrijednost i. Dodaj print(i).";
      }
    }

    return "Greška: kod nije tačan. Provjeri sintaksu i pokušaj ponovo.";
  };

  const checkTaskCode = (taskIndex) => {
    const task = lesson.codingTasks[taskIndex];
    const userCode = textareaRefs.current[taskIndex]?.value || "";
    const normalizedCode = normalizeCode(userCode);

    const isCorrect = task.check(normalizedCode);

    setTaskResults({
      ...taskResults,
      [taskIndex]: isCorrect ? "correct" : "wrong",
    });
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
      } else {
        const output = data.output || "";
        setTaskOutputs({ ...taskOutputs, [taskIndex]: `>>> Pokreni kod\n${output}` });

        if (task.check(normalizedCode)) {
          setTaskResults({ ...taskResults, [taskIndex]: "correct" });
        } else {
          setTaskResults({ ...taskResults, [taskIndex]: "wrong" });
        }
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
              <span className="lesson-pill">{lesson.badge}</span>
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
                <div className="goal-item" key={index}>
                  <CheckCircle2 size={19} />
                  <span>{goal}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="theory-flow">
            {lesson.theoryBlocks.map((block, blockIndex) => (
              <div key={blockIndex} className="theory-block lesson-panel">
                <div className="panel-title-row">
                  <h2>{block.title}</h2>
                  <Code2 size={22} />
                </div>
                <p>{block.text}</p>
                <pre className="mini-code">{block.code}</pre>

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
                <article className="quiz-card" key={questionIndex}>
                  <h3>
                    Pitanje {questionIndex + 1}: {item.question}
                  </h3>

                  <div className="answer-list">
                    {item.answers.map((answer, answerIndex) => {
                      const isSelected =
                        selectedAnswers[questionIndex] === answerIndex;
                      const isCorrect = item.correct === answerIndex;
                      const isAnswered =
                        selectedAnswers[questionIndex] !== undefined;

                      let buttonClass = "answer-btn";

                      if (isAnswered && isSelected && isCorrect) {
                        buttonClass += " correct";
                      }

                      if (isAnswered && isSelected && !isCorrect) {
                        buttonClass += " wrong";
                      }

                      return (
                        <button
                          key={answerIndex}
                          className={buttonClass}
                          onClick={() =>
                            handleAnswer(questionIndex, answerIndex)
                          }
                        >
                          {answer}
                        </button>
                      );
                    })}
                  </div>

                  {selectedAnswers[questionIndex] !== undefined && (
                    <p className="answer-feedback">
                      {selectedAnswers[questionIndex] === item.correct
                        ? "Tačno! Dobro si skontao."
                        : "Nije tačno. Pogledaj još jednom objašnjenje iznad."}
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
                  <div className="code-checker-box" key={taskIndex}>
                    <h3>{task.title}</h3>
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