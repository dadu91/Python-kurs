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
  ChevronRight,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import uvod from "../lessons/uvod";
import petlje from "../lessons/petlje";
import promjenljive from "../lessons/promjenljive";
import liste from "../lessons/liste";
import stringovi from "../lessons/stringovi";
import uslovi from "../lessons/uslovi";
import funkcije from "../lessons/funkcije";
import rjecnici from "../lessons/rjecnici";
import skupoviTuple from "../lessons/skupovi_tuple";
import moduli from "../lessons/moduli";
import greske from "../lessons/greske";

const lessonsByRedoslijed = { 1: uvod, 2: promjenljive, 3: uslovi, 4: petlje, 5: liste, 6: stringovi, 7: funkcije, 8: skupoviTuple, 9: rjecnici, 10: moduli, 11: greske };
function Lesson() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [redoslijed, setRedoslijed] = useState(null);
  const [dbLekcija, setDbLekcija] = useState(null);
  const [nextLessonId, setNextLessonId] = useState(null);
  const hardkodiranaLekcija = lessonsByRedoslijed[redoslijed];


let parsedSadrzaj = {
  oblasti: [],
  miniProvjere: [],
};

try {
  const parsed = dbLekcija?.sadrzaj ? JSON.parse(dbLekcija.sadrzaj) : null;

  if (Array.isArray(parsed)) {
    parsedSadrzaj = {
      oblasti: parsed,
      miniProvjere: [],
    };
  } else if (parsed) {
    parsedSadrzaj = {
      oblasti: parsed.oblasti || [],
      miniProvjere: parsed.miniProvjere || [],
    };
  }
} catch {
  parsedSadrzaj = {
    oblasti: [],
    miniProvjere: [],
  };
}

const adminTheoryBlocks = parsedSadrzaj.oblasti.map((oblast, index) => ({
  title: oblast.naziv || `Oblast ${index + 1}`,
  elementi: oblast.elementi || [],
}));

const adminQuestions = parsedSadrzaj.miniProvjere.map((p, index) => ({
  redoslijed: index + 1,
  question: p.pitanje || "",
  answers: [p.a, p.b, p.c, p.d].filter(Boolean),
  correct: Number(p.tacan),
}));

const lesson = hardkodiranaLekcija || (dbLekcija
  ? {
      badge: `Lekcija ${dbLekcija.redoslijed}`,
      title: dbLekcija.naziv,
      description: dbLekcija.opis || "",
      heroClass: "variables-hero",
      duration: dbLekcija.trajanje || "30 min",
      level: dbLekcija.nivo || "Početnik",

      goals: dbLekcija.ciljevi
        ? dbLekcija.ciljevi.split("\n").map((cilj, index) => ({
            tekst: cilj,
            blockIndex: index,
          }))
        : [],

      theoryBlocks: adminTheoryBlocks,
      questions: adminQuestions,
      codingTasks: [],
    }
  : null);


  const [activeTab, setActiveTab] = useState("lessons");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [adminSelectedAnswers, setAdminSelectedAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [taskCodes, setTaskCodes] = useState({});
  const [taskResults, setTaskResults] = useState({});
  const [taskOutputs, setTaskOutputs] = useState({});
  const [shownSolutions, setShownSolutions] = useState({});
  const [vjezbaKodovi, setVjezbaKodovi] = useState({});
  const [vjezbaRezultati, setVjezbaRezultati] = useState({});
  const [zadaciMapa, setZadaciMapa] = useState({});
  const [zadaciIzBaze, setZadaciIzBaze] = useState([]);
  const [uradjeniZadaci, setUradjeniZadaci] = useState(new Set());
  const [currentStep, setCurrentStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [lessonAlreadyFinished, setLessonAlreadyFinished] = useState(false);

  const textareaRefs = useRef({});
  const cursorPos = useRef(null);
  const mainRef = useRef(null);

  useEffect(() => {
    setFinished(false);
    setLessonAlreadyFinished(false);
    const savedMax = parseInt(localStorage.getItem(`lesson_progress_${id}`)) || 0;
    setMaxStep(savedMax);
    setCurrentStep(0);
    setSelectedAnswers({});
    setTaskCodes({});
    setTaskResults({});
    setTaskOutputs({});
    setVjezbaKodovi({});
    setVjezbaRezultati({});

    const token = localStorage.getItem("token");

    fetch(`http://localhost:8000/lekcije/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : null)
      .then((lekcija) => {
        if (lekcija) {
          setDbLekcija(lekcija);
          setRedoslijed(lekcija.redoslijed);

          fetch(`http://localhost:8000/lekcije/`, {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((r) => r.ok ? r.json() : [])
            .then((sve) => {
              const sledeca = sve.find((l) => l.redoslijed === lekcija.redoslijed + 1);
              if (sledeca) setNextLessonId(sledeca.id);
            })
            .catch(() => {});
        }
      })
      .catch(() => {});

    fetch(`http://localhost:8000/zadaci/po-lekciji/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : [])
      .then((zadaci) => {
        setZadaciIzBaze(zadaci);

        const mapa = {};
        zadaci.forEach((z) => {
          if (z.redoslijed) mapa[z.redoslijed] = z.id;
        });
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
            setLessonAlreadyFinished(true);
          }
        })
        .catch(() => {});
    });
  }, [id]);

  useEffect(() => {
    if (lessonAlreadyFinished && lesson) {
      const totalSteps = 1
        + (lesson.theoryBlocks?.length || 0)
        + 1
        + (lesson.codingTasks?.length > 0 ? 1 : 0)
        + 1;
      setMaxStep(totalSteps - 1);
      setFinished(true);
    }
  }, [lessonAlreadyFinished, lesson]);

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
  };

  const runTaskCode = async (taskIndex) => {
    const task = lesson.codingTasks[taskIndex];
    const userCode = textareaRefs.current[taskIndex]?.value || "";
    const normalizedCode = normalizeCode(userCode);
    const token = localStorage.getItem("token");

    if (!userCode.trim()) {
      setTaskOutputs({ ...taskOutputs, [taskIndex]: ">>> Predaj kod\nGreška: prvo upiši kod." });
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
        setTaskOutputs({ ...taskOutputs, [taskIndex]: `>>> Predaj kod\n${data.greska.tip}: ${data.greska.poruka}` });
        setTaskResults({ ...taskResults, [taskIndex]: "wrong" });
        upisiZadatakKorisnik(task.redoslijed, false, data.greska.tip);
      } else {
        const output = data.output || "";
        setTaskOutputs({ ...taskOutputs, [taskIndex]: `>>> Predaj kod\n${output}` });

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
    const code = vjezbaKodovi[blockIndex] !== undefined ? vjezbaKodovi[blockIndex] : (block.vjezbaSintakse.initialCode || "");
    const normalized = normalizeCode(code);
    const isCorrect = block.vjezbaSintakse.check(normalized);
    setVjezbaRezultati((prev) => ({
      ...prev,
      [blockIndex]: isCorrect ? "correct" : "wrong",
    }));
  };

  if (!lesson) {
    return <p>Učitavanje lekcije...</p>;
  }

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

  if (!lesson) return <p>Učitavanje lekcije...</p>;

  // Build steps
  const steps = [
    { type: "goals", label: "Uvod" },
    ...lesson.theoryBlocks.map((b, i) => ({
      type: "theory",
      index: i,
      label: b.title,
    })),
    ...(lesson.questions.length > 0
      ? [{ type: "quiz", label: "Mini provjere" }]
      : []),
    ...(hasCodingTasks ? [{ type: "coding", label: "Kod zadaci" }] : []),
    { type: "finish", label: "Završi" },
  ];

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const canProceed = (() => {
    if (lessonAlreadyFinished) return true;
    if (currentStep < maxStep) return true;
    if (step.type === "goals") return true;
    if (step.type === "theory") {
      const block = lesson.theoryBlocks[step.index];
      if (!block.vjezbaSintakse) return true;
      return vjezbaRezultati[step.index] === "correct";
    }
    if (step.type === "quiz") return correctCount === lesson.questions.length;
    if (step.type === "coding") return canFinishCodingTasks;
    return true;
  })();

  const goToStep = (i) => {
    if (i > maxStep) return;
    setCurrentStep(i);
    if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextStep = () => {
    if (isLastStep) return;
    const next = currentStep + 1;
    setCurrentStep(next);
    setMaxStep((m) => {
      const newMax = Math.max(m, next);
      localStorage.setItem(`lesson_progress_${id}`, newMax);
      return newMax;
    });
    if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="page-bg">
      <div className="dashboard-shell">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="dashboard-main lesson-main" ref={mainRef}>
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
                <span>
                  Mini provjere: {
                    lesson.questions.length +
                    zadaciIzBaze.filter((z) => z.tip === "quiz" && z.naziv && z.opis).length
                  }
                </span>
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

          {/* Step navigation */}
          <nav className="lesson-steps-nav">
            {steps.map((s, i) => (
              <button
                key={i}
                className={`step-pill${i === currentStep ? " step-active" : ""}${i < currentStep ? " step-done" : ""}${i > currentStep && i <= maxStep ? " step-done" : ""}${i > maxStep ? " step-locked" : ""}`}
                onClick={() => goToStep(i)}
                disabled={i > maxStep}
                title={s.label}
              >
                {i < currentStep ? <CheckCircle2 size={13} /> : <span className="step-num">{i + 1}</span>}
                <span className="step-label">{s.label}</span>
              </button>
            ))}
          </nav>

          {/* Step content */}
          {step.type === "goals" && (
            <section className="lesson-panel step-content" style={{ marginBottom: "24px" }}>
              <h2>Šta učiš?</h2>
              <div className="goal-list">
                {lesson.goals.map((goal, index) => (
                  <div className="goal-item" key={index}>
                    <CheckCircle2 size={19} />
                    <span>{goal.tekst}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {step.type === "theory" && (
  <div className="theory-flow step-content">
    {(() => {
      const block = lesson.theoryBlocks[step.index];
      const blockIndex = step.index;

      return (
        <div className="theory-block lesson-panel">
          <div className="panel-title-row">
            <h2>{block.title}</h2>
            <Code2 size={22} />
          </div>

          {block.elementi ? (
            block.elementi.map((el, i) => (
              <div key={el.id || i} className="admin-content-block">
                  {el.tip === "teorija" && (
                    <>
                      {el.naslov && <h3>{el.naslov}</h3>}
                      <p>{el.tekst}</p>
                    </>
                  )}

                  {el.tip === "kod" && (
                    <>
                      <pre className="mini-code">{el.kod}</pre>

                      {el.objasnjenje && (
                        <div className="code-objasnjenje">
                          {(Array.isArray(el.objasnjenje)
                            ? el.objasnjenje
                            : (el.objasnjenje || "").split("\n")
                          )
                            .filter((red) => red.trim() !== "")
                            .map((red, i) => (
                              <div className="code-objasnjenje-red" key={i}>
                                <span className="code-objasnjenje-broj">{i + 1}</span>
                                <span>{red}</span>
                              </div>
                            ))}
                        </div>
                      )}
                    </>
                  )}

                  {el.tip === "vjezba" && (
                    <div className="vjezba-sintakse">
                      <h4>Vježba sintakse</h4>
                      <p>{el.tekst}</p>

                      <textarea
                        className="code-input"
                        placeholder="Ovdje upiši kod..."
                        value={vjezbaKodovi[el.id] || ""}
                        onChange={(e) =>
                          setVjezbaKodovi((prev) => ({
                            ...prev,
                            [el.id]: e.target.value,
                          }))
                        }
                      />

                      <div className="code-actions">
                        <button
                          className="check-code-btn"
                          onClick={() => {
                            const unos = (vjezbaKodovi[el.id] || "").trim();
                            const tacno = (el.rjesenje || "").trim();

                            setVjezbaRezultati((prev) => ({
                              ...prev,
                              [el.id]: unos === tacno ? "correct" : "wrong",
                            }));
                          }}
                        >
                          Provjeri
                        </button>
                      </div>

                      {vjezbaRezultati[el.id] === "correct" && (
                        <div className="code-result correct-result">
                          ✅ Tačno!
                        </div>
                      )}

                      {vjezbaRezultati[el.id] === "wrong" && (
                        <div className="code-result wrong-result">
                          Nije tačno.
                          {el.rjesenje && (
                            <> Treba ti: <strong>{el.rjesenje}</strong></>
                          )}
                        </div>
)}
                    </div>
                  )}

                  {el.tip === "quiz" && (
                    <article className="quiz-card">
                      <h3>{el.pitanje}</h3>

                      <div className="answer-list">
                        {[el.a, el.b, el.c, el.d].map((odg, index) => {
                          if (!odg) return null;

                          const key = el.id;
                          const selected = adminSelectedAnswers[key];
                          const isSelected = selected === index;
                          const isCorrect = Number(el.tacan) === index;

                          let buttonClass = "answer-btn";
                          if (selected !== undefined && isSelected && isCorrect) {
                            buttonClass += " correct";
                          }
                          if (selected !== undefined && isSelected && !isCorrect) {
                            buttonClass += " wrong";
                          }

                          return (
                            <button
                              key={index}
                              className={buttonClass}
                              onClick={() =>
                                setAdminSelectedAnswers({
                                  ...adminSelectedAnswers,
                                  [key]: index,
                                })
                              }
                            >
                              {odg}
                            </button>
                          );
                        })}
                      </div>

                      {adminSelectedAnswers[el.id] !== undefined && (
                        <p className="answer-feedback">
                          {adminSelectedAnswers[el.id] === Number(el.tacan)
                            ? "Tačno!"
                            : "Nije tačno. Pokušaj ponovo."}
                        </p>
                      )}
                    </article>
                  )}
                </div>
              ))
            ) : (
              <>
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
                      value={
                        vjezbaKodovi[blockIndex] !== undefined
                          ? vjezbaKodovi[blockIndex]
                          : block.vjezbaSintakse.initialCode || ""
                      }
                      onChange={(e) => {
                        setVjezbaKodovi((prev) => ({
                          ...prev,
                          [blockIndex]: e.target.value,
                        }));
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
              </>
            )}
          </div>
        );
      })()}
    </div>
  )}

          {step.type === "quiz" && (
            <section className="quiz-section step-content">
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
          )}

          {step.type === "coding" && hasCodingTasks && (
            <section className="final-task lesson-panel step-content">
              <div className="panel-title-row">
                <div>
                  <h2>Zadaci za pisanje koda</h2>
                  <p>
                    Upiši svoje rješenje ispod svakog zadatka. Klikni
                    <b> Provjeri kod</b> da vidiš da li je tačno ili
                    <b> Predaj kod</b> da dobiješ izlaz kao u konzoli.
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
                    <p style={{ whiteSpace: "pre-wrap" }}>{task.description}</p>

                    <textarea
                      className="code-input"
                      ref={(el) => (textareaRefs.current[taskIndex] = el)}
                      defaultValue=""
                      onKeyDown={(e) => {
                        const el = e.target;
                        const start = el.selectionStart;
                        const end = el.selectionEnd;
                        const code = el.value;
                        const pairs = { "(": ")", '"': '"', "'": "'", "{": "}", "[": "]" };

                        if (pairs[e.key]) {
                          e.preventDefault();
                          el.value = code.substring(0, start) + e.key + pairs[e.key] + code.substring(end);
                          el.selectionStart = start + 1;
                          el.selectionEnd = start + 1;
                          return;
                        }

                        if (e.key === "Tab") {
                          e.preventDefault();
                          el.value = code.substring(0, start) + "    " + code.substring(end);
                          el.selectionStart = start + 4;
                          el.selectionEnd = start + 4;
                        }

                        if (e.key === "Backspace" && start === end && code.substring(start - 4, start) === "    ") {
                          e.preventDefault();
                          el.value = code.substring(0, start - 4) + code.substring(end);
                          el.selectionStart = start - 4;
                          el.selectionEnd = start - 4;
                        }

                        if (e.key === "Enter") {
                          e.preventDefault();
                          const currentLine = code.substring(0, start).split("\n").pop();
                          const indent = currentLine.match(/^(\s*)/)[1];
                          const extraIndent = currentLine.trimEnd().endsWith(":") ? "    " : "";
                          if (code[start - 1] === "{" && code[start] === "}") {
                            el.value = code.substring(0, start) + "\n" + indent + "    " + "\n" + indent + code.substring(end);
                            const newPos = start + 1 + indent.length + 4;
                            el.selectionStart = newPos;
                            el.selectionEnd = newPos;
                          } else {
                            el.value = code.substring(0, start) + "\n" + indent + extraIndent + code.substring(end);
                            const newPos = start + 1 + indent.length + extraIndent.length;
                            el.selectionStart = newPos;
                            el.selectionEnd = newPos;
                          }
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
                        Predaj kod
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

                {zadaciIzBaze
                  .filter((z) => z.tip === "prakticni" && z.naziv && z.opis)
                  .map((z) => (
                    <div className="code-checker-box" key={`admin-kod-${z.id}`}>
                      <h3>{z.naziv}</h3>
                      <p>{z.opis}</p>

                      <textarea
                        id={`admin-code-${z.id}`}
                        className="code-input"
                        placeholder="Ovdje upiši svoje rješenje..."
                      />

                      <div className="code-actions">
                        <button
                          className="check-code-btn"
                          onClick={() => {
                            const kod = document.getElementById(`admin-code-${z.id}`).value;

                            setTaskResults({
                              ...taskResults,
                              [`admin-${z.id}`]:
                                kod.trim() === z.rjesenje?.trim()
                                  ? "correct"
                                  : "wrong",
                            });
                          }}
                        >
                          Provjeri kod
                        </button>

                        <button
                          className="run-code-btn"
                          onClick={async () => {
                            const kod = document.getElementById(`admin-code-${z.id}`).value;
                            const token = localStorage.getItem("token");

                            const res = await fetch("http://localhost:8000/kod/execute", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify({ kod }),
                            });

                            const data = await res.json();

                            setTaskOutputs({
                              ...taskOutputs,
                              [`admin-${z.id}`]:
                                data.greska
                                  ? `${data.greska.tip}: ${data.greska.poruka}`
                                  : data.output || "Nema izlaza.",
                            });
                          }}
                        >
                          Pokreni kod
                        </button>
                      </div>

                      {taskResults[`admin-${z.id}`] === "correct" && (
                        <div className="code-result correct-result">
                          Tačno! Ovaj zadatak je urađen kako treba.
                        </div>
                      )}

                      {taskResults[`admin-${z.id}`] === "wrong" && (
                        <div className="code-result wrong-result">
                          Netačan kod, pokušaj ponovo.
                        </div>
                      )}

                      {taskOutputs[`admin-${z.id}`] && (
                        <div className="output-box">
                          <p>Konzola:</p>
                          <pre>{taskOutputs[`admin-${z.id}`]}</pre>
                        </div>
                      )}

                      <button
                        className="show-solution-btn"
                        onClick={() =>
                          setShownSolutions({
                            ...shownSolutions,
                            [`admin-${z.id}`]:
                              !shownSolutions[`admin-${z.id}`],
                          })
                        }
                      >
                        {shownSolutions[`admin-${z.id}`]
                          ? "Sakrij rješenje"
                          : "Prikaži rješenje"}
                      </button>

                      {shownSolutions[`admin-${z.id}`] && (
                        <div className="solution-box">
                          <p>Jedno moguće rješenje:</p>
                          <pre className="mini-code">{z.rjesenje}</pre>

                          <p>Izlaz programa:</p>
                          <pre className="mini-code">{z.ocekivani_izlaz}</pre>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {step.type === "finish" && (
            <section className="final-task lesson-panel step-content">
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

                  await fetch("http://localhost:8000/progres/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ korisnik_id: korisnikId }),
                  });

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
                <>
                  <div className="success-box">
                    <Trophy size={22} />
                    <span>
                      Završio si lekciju. Mini provjere: {correctCount}/
                      {lesson.questions.length}
                      {hasCodingTasks &&
                        `, kod zadaci: ${correctCodingTasksCount}/${codingTasksCount}`}
                    </span>
                  </div>
                  {nextLessonId && (
                    <button className="next-lesson-btn" onClick={() => navigate(`/lekcije/${nextLessonId}`)}>
                      Sljedeća lekcija →
                    </button>
                  )}
                </>
              )}
            </section>
          )}

          {/* Next step button */}
          {!isLastStep && (
            <div className="step-nav-row">
              {!canProceed && (
                <span className="step-nav-hint">
                  {step.type === "theory" && "Uradi vježbu tačno da nastaviš."}
                  {step.type === "quiz" && "Odgovori tačno na sva pitanja da nastaviš."}
                  {step.type === "coding" && "Tačno riješi sve kod zadatke da nastaviš."}
                </span>
              )}
              <button className="next-step-btn" onClick={nextStep} disabled={!canProceed}>
                Nastavi <ChevronRight size={18} />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Lesson;
