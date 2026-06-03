import { useState } from "react";
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

const lessons = {
  1: {
    badge: "Lekcija 1",
    title: "Uvod u Python",
    heroClass: "intro-hero",
    description:
      "U ovoj lekciji učiš šta je Python, kako se pokreće prvi program i kako se koristi print naredba.",
    duration: "20 min",
    level: "Početnik",
    theoryTitle: "Šta je Python?",
    theory:
      "Python je programski jezik koji se koristi za web aplikacije, automatizaciju, analizu podataka, vještačku inteligenciju i mnoge druge oblasti.",
    theoryCode: `print("Zdravo, Python!")`,
    goals: [
      "Razumiješ šta je Python",
      "Znaš čemu služi print()",
      "Umiješ da napišeš prvi program",
    ],
    code: `print("Zdravo, svijete!")

ime = "Petar"
print("Zdravo, moje ime je", ime)`,
    secondTitle: "Print naredba",
    secondText:
      "Naredba print() služi za ispis teksta ili vrijednosti na ekran. Tekst pišemo između navodnika.",
    secondCode: `print("Učim Python")`,
    questions: [
      {
        question: "Koja naredba se koristi za ispis u Pythonu?",
        answers: ["echo()", "print()", "write()"],
        correct: 1,
      },
      {
        question: "Šta će ispisati kod: print('Python')?",
        answers: ["Python", "print", "Grešku"],
        correct: 0,
      },
      {
        question: "Tekst u Pythonu najčešće pišemo između:",
        answers: ["zagrada", "navodnika", "zareza"],
        correct: 1,
      },
    ],
    codingTasks: [],
  },

  2: {
    badge: "Lekcija 2",
    title: "Petlje u Pythonu",
    heroClass: "loops-hero",
    description:
      "U ovoj lekciji učiš kako rade for i while petlje, kako se koristi range(), kako se prolazi kroz listu i kako da prepoznaš najčešće greške u petljama.",
    duration: "45 min",
    level: "Početnik",
    theoryTitle: "Šta su petlje?",
    theory:
      "Petlje koristimo kada želimo da se neki dio koda ponovi više puta. Umjesto da istu naredbu pišemo ručno više puta, napišemo petlju koja to radi za nas.",
    theoryCode: `for i in range(5):
    print(i)`,
    goals: [
      "Razumiješ kako radi for petlja",
      "Znaš kako se koristi range()",
      "Razlikuješ for i while petlju",
      "Umiješ da pronađeš grešku u kodu sa petljama",
      "Znaš kako se petljom prolazi kroz listu",
    ],
    code: `for i in range(5):
    print(i)

brojevi = [2, 4, 6, 8]

for broj in brojevi:
    print(broj)

x = 0
while x < 3:
    print("Python")
    x += 1`,
    secondTitle: "Najčešće greške kod petlji",
    secondText:
      "Kod petlji početnici često zaborave dvotačku, pogriješe uvlačenje koda ili naprave while petlju koja se nikad ne završava.",
    secondCode: `# Greška: fali dvotačka
for i in range(5)
    print(i)

# Ispravno:
for i in range(5):
    print(i)`,

    questions: [
      {
        question:
          "Koja petlja se najčešće koristi kada znamo koliko puta nešto ponavljamo?",
        answers: ["for", "while", "if"],
        correct: 0,
      },
      {
        question: "Šta će ispisati kod: for i in range(3): print(i)?",
        answers: ["1 2 3", "0 1 2", "0 1 2 3"],
        correct: 1,
      },
      {
        question: "Koja petlja se koristi kada ponavljanje zavisi od uslova?",
        answers: ["for", "while", "print"],
        correct: 1,
      },
      {
        question: "Šta fali u ovom kodu: for i in range(5) print(i)?",
        answers: ["Dvotačka poslije range(5)", "Navodnici", "Promjenljiva x"],
        correct: 0,
      },
      {
        question:
          "Koja greška se najčešće dobija ako kod unutar petlje nije pravilno uvučen?",
        answers: ["NameError", "IndentationError", "ValueError"],
        correct: 1,
      },
      {
        question: "Šta radi naredba x += 1 u while petlji?",
        answers: [
          "Smanjuje x za 1",
          "Povećava x za 1",
          "Prekida program",
        ],
        correct: 1,
      },
      {
        question:
          "Šta može da se desi ako u while petlji nikad ne promijenimo uslov?",
        answers: [
          "Petlja se nikad ne završava",
          "Program se odmah gasi",
          "Python automatski popravi grešku",
        ],
        correct: 0,
      },
      {
        question: "Kako provjeravamo da li je broj paran?",
        answers: ["broj % 2 == 0", "broj / 2 == 0", "broj + 2 == 0"],
        correct: 0,
      },
    ],

    codingTasks: [
      {
        title: "Mini zadatak 1: Ispiši brojeve od 0 do 4",
        description:
          "Napiši for petlju koja koristi range(5) i ispisuje svaki broj od 0 do 4.",
        solution: `for i in range(5):
    print(i)`,
        expectedOutput: `0
1
2
3
4`,
        hint: "Treba ti for petlja, range(5) i print(i).",
        check: (code) =>
          code.includes("foriinrange(5):") && code.includes("print(i)"),
      },
      {
        title: "Mini zadatak 2: Prođi kroz listu brojeva",
        description:
          "Data je lista brojeva: brojevi = [2, 4, 6, 8]. Napiši program koji pomoću for petlje prolazi kroz listu i ispisuje svaki broj.",
        solution: `brojevi = [2, 4, 6, 8]

for broj in brojevi:
    print(broj)`,
        expectedOutput: `2
4
6
8`,
        hint: "Treba ti lista brojevi = [2, 4, 6, 8], for broj in brojevi i print(broj).",
        check: (code) =>
          code.includes("brojevi=[2,4,6,8]") &&
          code.includes("forbrojinbrojevi:") &&
          code.includes("print(broj)"),
      },
      {
        title: "Mini zadatak 3: Ispiši samo parne brojeve",
        description:
          "Data je lista brojeva: brojevi = [10, 15, 22, 31, 44, 57, 68]. Napiši program koji pomoću for petlje prolazi kroz listu i ispisuje samo parne brojeve.",
        solution: `brojevi = [10, 15, 22, 31, 44, 57, 68]

for broj in brojevi:
    if broj % 2 == 0:
        print(broj)`,
        expectedOutput: `10
22
44
68`,
        hint: "Provjeri listu, for petlju, uslov za paran broj i ispis.",
        check: (code) =>
          code.includes("brojevi=[10,15,22,31,44,57,68]") &&
          code.includes("forbrojinbrojevi:") &&
          code.includes("ifbroj%2==0:") &&
          code.includes("print(broj)"),
      },
      {
        title: "Mini zadatak 4: Prebroj parne brojeve",
        description:
          "Data je lista brojeva: brojevi = [12, 19, 24, 33, 40, 55, 72, 81]. Napiši program koji broji koliko parnih brojeva ima u listi i na kraju ispisuje vrijednost brojača.",
        solution: `brojevi = [12, 19, 24, 33, 40, 55, 72, 81]
brojac = 0

for broj in brojevi:
    if broj % 2 == 0:
        brojac += 1

print(brojac)`,
        expectedOutput: `4`,
        hint: "Provjeri listu, brojač, for petlju, if uslov, povećanje brojača i print.",
        check: (code) =>
          code.includes("brojevi=[12,19,24,33,40,55,72,81]") &&
          code.includes("brojac=0") &&
          code.includes("forbrojinbrojevi:") &&
          code.includes("ifbroj%2==0:") &&
          code.includes("brojac+=1") &&
          code.includes("print("),
      },
      {
        title: "Mini zadatak 5: Pronađi i ispravi grešku",
        description:
          "U kodu ispod fali dvotačka poslije range(5). Napiši ispravan kod koji ispisuje brojeve od 0 do 4: for i in range(5) print(i).",
        solution: `for i in range(5):
    print(i)`,
        expectedOutput: `0
1
2
3
4`,
        hint: "Poslije for i in range(5) mora da stoji dvotačka.",
        check: (code) =>
          code.includes("foriinrange(5):") && code.includes("print(i)"),
      },
    ],
  },

  3: {
    badge: "Lekcija 3",
    title: "Zadaci u Pythonu",
    heroClass: "tasks-hero",
    description:
      "U ovoj lekciji vježbaš osnovne Python zadatke koristeći promjenljive, uslove i petlje.",
    duration: "35 min",
    level: "Početnik",
    theoryTitle: "Kako rješavamo zadatke?",
    theory:
      "Kod zadataka je najbitnije da prvo razumiješ šta se traži, zatim napraviš plan, pa tek onda pišeš kod.",
    theoryCode: `broj = int(input("Unesi broj: "))

if broj > 0:
    print("Broj je pozitivan")`,
    goals: [
      "Razumiješ tekst zadatka",
      "Koristiš input i print",
      "Primjenjuješ uslove i petlje",
    ],
    code: `broj = int(input("Unesi broj: "))

if broj % 2 == 0:
    print("Broj je paran")
else:
    print("Broj je neparan")`,
    secondTitle: "Savjet za zadatke",
    secondText:
      "Uvijek testiraj program sa više primjera. Ako radi za jedan broj, ne znači da radi za sve.",
    secondCode: `# Testiraj za:
# 2, 5, 0, -4`,
    questions: [
      {
        question: "Koja funkcija služi za unos podataka?",
        answers: ["input()", "print()", "range()"],
        correct: 0,
      },
      {
        question: "Kako provjeravamo da li je broj paran?",
        answers: ["broj / 2 == 0", "broj % 2 == 0", "broj + 2 == 0"],
        correct: 1,
      },
      {
        question: "Šta radi if naredba?",
        answers: ["Ponavlja kod", "Provjerava uslov", "Ispisuje tekst"],
        correct: 1,
      },
    ],
    codingTasks: [],
  },
};

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
    const userCode = taskCodes[taskIndex] || "";
    const normalizedCode = normalizeCode(userCode);

    const isCorrect = task.check(normalizedCode);

    setTaskResults({
      ...taskResults,
      [taskIndex]: isCorrect ? "correct" : "wrong",
    });
  };

  const runTaskCode = (taskIndex) => {
    const task = lesson.codingTasks[taskIndex];
    const userCode = taskCodes[taskIndex] || "";
    const normalizedCode = normalizeCode(userCode);

    if (!userCode.trim()) {
      setTaskOutputs({
        ...taskOutputs,
        [taskIndex]: ">>> Pokreni kod\nGreška: prvo upiši kod.",
      });
      return;
    }

    if (task.check(normalizedCode)) {
      setTaskOutputs({
        ...taskOutputs,
        [taskIndex]: `>>> Pokreni kod\n${task.expectedOutput}`,
      });

      setTaskResults({
        ...taskResults,
        [taskIndex]: "correct",
      });
    } else {
      setTaskOutputs({
        ...taskOutputs,
        [taskIndex]: `>>> Pokreni kod\n${getTaskError(taskIndex, normalizedCode)}`,
      });

      setTaskResults({
        ...taskResults,
        [taskIndex]: "wrong",
      });
    }
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

          <section className="lesson-grid">
            <article className="lesson-panel theory-panel">
              <h2>{lesson.theoryTitle}</h2>
              <p>{lesson.theory}</p>
              <pre className="mini-code">{lesson.theoryCode}</pre>
            </article>

            <article className="lesson-panel">
              <h2>Šta učiš?</h2>

              <div className="goal-list">
                {lesson.goals.map((goal, index) => (
                  <div className="goal-item" key={index}>
                    <CheckCircle2 size={19} />
                    <span>{goal}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="lesson-panel code-panel">
              <div className="panel-title-row">
                <h2>Primjer koda</h2>
                <Code2 size={22} />
              </div>

              <pre>{lesson.code}</pre>
            </article>

            <article className="lesson-panel theory-panel">
              <h2>{lesson.secondTitle}</h2>
              <p>{lesson.secondText}</p>
              <pre className="mini-code">{lesson.secondCode}</pre>
            </article>
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
                      value={taskCodes[taskIndex] || ""}
                      onChange={(e) => {
                        setTaskCodes({
                          ...taskCodes,
                          [taskIndex]: e.target.value,
                        });

                        setTaskResults({
                          ...taskResults,
                          [taskIndex]: null,
                        });

                        setTaskOutputs({
                          ...taskOutputs,
                          [taskIndex]: null,
                        });
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
              onClick={() => setFinished(true)}
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